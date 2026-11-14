import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);

function typeMatches(value, type) {
  if (Array.isArray(type)) return type.some(candidate => typeMatches(value, candidate));
  if (type === "null") return value === null;
  if (type === "array") return Array.isArray(value);
  if (type === "object") return value !== null && typeof value === "object" && !Array.isArray(value);
  if (type === "integer") return Number.isInteger(value);
  if (type === "string") return typeof value === "string";
  if (type === "boolean") return typeof value === "boolean";
  return true;
}

function resolvePointer(document, pointer) {
  if (pointer === "#") return document;
  if (!pointer.startsWith("#/")) return undefined;
  return pointer.slice(2).split("/").map(part => part.replaceAll("~1", "/").replaceAll("~0", "~"))
    .reduce((value, key) => value?.[key], document);
}

function checkSchema(value, rule, path, document, errors) {
  if (rule.$ref) {
    const target = resolvePointer(document, rule.$ref);
    if (!target) errors.push(`${path}: unresolved schema reference ${rule.$ref}`);
    else checkSchema(value, target, path, document, errors);
    return;
  }
  if (rule.type && !typeMatches(value, rule.type)) {
    errors.push(`${path}: expected ${Array.isArray(rule.type) ? rule.type.join(" or ") : rule.type}`);
    return;
  }
  if (rule.const !== undefined && JSON.stringify(value) !== JSON.stringify(rule.const)) {
    errors.push(`${path}: must equal ${JSON.stringify(rule.const)}`);
  }
  if (rule.enum && !rule.enum.includes(value)) errors.push(`${path}: value is not in the allowed set`);
  if (typeof value === "string") {
    if (rule.minLength !== undefined && value.length < rule.minLength) errors.push(`${path}: string is too short`);
    if (rule.pattern && !new RegExp(rule.pattern).test(value)) errors.push(`${path}: string does not match ${rule.pattern}`);
    if (rule.format === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(value)) errors.push(`${path}: expected an ISO date`);
  }
  if (Array.isArray(value)) {
    if (rule.minItems !== undefined && value.length < rule.minItems) errors.push(`${path}: requires at least ${rule.minItems} items`);
    if (rule.uniqueItems && new Set(value.map(item => JSON.stringify(item))).size !== value.length) errors.push(`${path}: items must be unique`);
    if (rule.items) value.forEach((item, index) => checkSchema(item, rule.items, `${path}[${index}]`, document, errors));
  }
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (rule.minProperties !== undefined && Object.keys(value).length < rule.minProperties) errors.push(`${path}: requires at least ${rule.minProperties} properties`);
    for (const key of rule.required ?? []) {
      if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}: required property is missing`);
    }
    if (rule.propertyNames) {
      for (const key of Object.keys(value)) checkSchema(key, rule.propertyNames, `${path} property name`, document, errors);
    }
    for (const [key, child] of Object.entries(value)) {
      if (rule.properties?.[key]) checkSchema(child, rule.properties[key], `${path}.${key}`, document, errors);
      else if (rule.additionalProperties === false) errors.push(`${path}.${key}: additional property is not allowed`);
      else if (rule.additionalProperties && typeof rule.additionalProperties === "object") {
        checkSchema(child, rule.additionalProperties, `${path}.${key}`, document, errors);
      }
    }
  }
}

export function validateCatalog(catalog, schema) {
  const errors = [];
  checkSchema(catalog, schema, "$", schema, errors);
  if (errors.length) return errors;

  const resources = catalog.resources;
  const byId = new Map();
  const urls = new Set();
  for (const resource of resources) {
    if (byId.has(resource.id)) errors.push(`Duplicate resource id: ${resource.id}`);
    byId.set(resource.id, resource);
    const normalizedUrl = resource.url.toLowerCase();
    if (urls.has(normalizedUrl)) errors.push(`Duplicate resource URL: ${resource.url}`);
    urls.add(normalizedUrl);

    for (const capability of resource.capabilities) {
      if (!Object.hasOwn(catalog.capability_taxonomy, capability)) {
        errors.push(`${resource.id}: capability ${capability} is missing from capability_taxonomy`);
      }
    }
    for (const relation of [...resource.alternatives, ...resource.conflicts]) {
      if (relation === resource.id) errors.push(`${resource.id}: cannot reference itself`);
      if (!resources.some(candidate => candidate.id === relation)) errors.push(`${resource.id}: unknown related resource ${relation}`);
    }
    if (resource.auto_adoption_allowed !== false) errors.push(`${resource.id}: automatic adoption must remain disabled`);
    if (resource.license_evidence.classification !== resource.license_risk_classification) {
      errors.push(`${resource.id}: license risk classification disagrees with its evidence record`);
    }

    const isUnverified = resource.status.endsWith("_unverified");
    if (isUnverified && (
      resource.license_evidence.verification_status !== "unverified"
      || resource.license_evidence.verified_upstream_license !== null
      || resource.license_evidence.evidence_url !== null
      || resource.provenance_evidence.status !== "unverified"
      || resource.compatibility_evidence.status !== "unverified"
    )) {
      errors.push(`${resource.id}: unverified candidate contains unsupported verification evidence`);
    }
    if (resource.license_evidence.verification_status === "verified" && (
      !resource.license_evidence.verified_upstream_license
      || !resource.license_evidence.evidence_url
      || !resource.license_evidence.checked_at
    )) {
      errors.push(`${resource.id}: verified license needs the exact license, evidence URL, and review date`);
    }
    if (resource.status === "verified_candidate" && (
      resource.license_evidence.verification_status !== "verified"
      || resource.provenance_evidence.status !== "verified"
      || resource.compatibility_evidence.status !== "verified"
    )) {
      errors.push(`${resource.id}: verified_candidate requires license, provenance, and compatibility evidence`);
    }
    if (resource.status === "new_candidate_unverified" && resource.source_origin === "existing_catalog") {
      errors.push(`${resource.id}: new candidate cannot claim existing-catalog origin`);
    }
    const restricted = [
      "commercial_reported_unverified",
      "mixed_license_reported_unverified",
      "source_available_reported_unverified",
      "restricted_terms_reported_unverified"
    ].includes(resource.license_risk_classification);
    if (restricted && resource.integration_disposition !== "excluded_from_automatic_adoption") {
      errors.push(`${resource.id}: restricted or mixed-license signal must be excluded from automatic adoption`);
    }
  }
  return errors;
}

async function main() {
  const [catalogText, schemaText] = await Promise.all([
    readFile(new URL("catalog/resources.json", root), "utf8"),
    readFile(new URL("catalog/resource-registry.schema.json", root), "utf8")
  ]);
  const catalog = JSON.parse(catalogText);
  const schema = JSON.parse(schemaText);
  const errors = validateCatalog(catalog, schema);
  if (errors.length) {
    console.error(`Resource registry validation failed with ${errors.length} issue(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
    return;
  }
  const added = catalog.resources.filter(resource => resource.status === "new_candidate_unverified").length;
  console.log(`Resource registry valid: ${catalog.resources.length} resources (${added} new, all unverified).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
