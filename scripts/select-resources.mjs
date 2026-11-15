import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const priorityRank = { P0: 0, P1: 1, P2: 2 };
const compareText = (left, right) => left < right ? -1 : left > right ? 1 : 0;
const usage = `Usage: npm run catalog:select -- [filters]

Filters:
  --platform <name>       Exact platform tag, such as android or web
  --capability <tag>      Exact capability tag, such as web.forms
  --query <text>          Case-insensitive search across ID, name, category, and guidance
  --status <status>       Exact registry status
  --disposition <value>   Exact integration disposition
  --limit <number>        Maximum results (default: 20)
  --format <text|json>    Output format (default: text)
  --help                  Show this help

Results have a screened repository-level license, not app-specific legal clearance. Check the
exact package/version, assets, dependency tree, provenance, and compatibility before integration.`;

export function parseSelectorArgs(args) {
const options = { limit: 20, format: "text" };
  const valueOptions = new Set(["--platform", "--capability", "--query", "--status", "--disposition", "--limit", "--format"]);
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--help") {
      options.help = true;
      continue;
    }
    if (!valueOptions.has(argument)) throw new Error(`Unknown option: ${argument}`);
    const value = args[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`);
    options[argument.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value;
    index += 1;
  }
  if (options.limit !== 20 || args.includes("--limit")) {
    options.limit = Number(options.limit);
    if (!Number.isSafeInteger(options.limit) || options.limit < 1) {
      throw new Error("--limit must be a positive whole number");
    }
  }
  if (!["text", "json"].includes(options.format)) throw new Error("--format must be text or json");
  return options;
}

export function selectResources(catalog, options = {}) {
  const query = options.query?.trim().toLowerCase();
  return catalog.resources
    .filter(resource => {
      if (resource.app_use_status !== "commercial_license_screened_candidate") return false;
      if (resource.license_evidence.verification_status !== "verified") return false;
      if (resource.license_evidence.classification !== "permissive_verified") return false;
      if (options.platform && !resource.platforms.includes(options.platform)) return false;
      if (options.capability && !resource.capabilities.includes(options.capability)) return false;
      if (options.platform && options.capability) {
        const capabilityPlatform = /^(android|web|ios)\./.exec(options.capability)?.[1];
        if (capabilityPlatform && capabilityPlatform !== options.platform) return false;
      }
      if (options.status && resource.status !== options.status) return false;
      if (options.disposition && resource.integration_disposition !== options.disposition) return false;
      if (query) {
        const searchable = [
          resource.id,
          resource.name,
          resource.category,
          resource.selection_guidance,
          ...resource.capabilities
        ].join(" ").toLowerCase();
        if (!searchable.includes(query)) return false;
      }
      return true;
    })
    .sort((left, right) =>
      priorityRank[left.priority] - priorityRank[right.priority]
      || compareText(left.name, right.name)
      || compareText(left.id, right.id)
    )
    .slice(0, options.limit ?? 20);
}

function renderText(resources) {
  if (!resources.length) return "No matching resources.";
  return resources.map(resource => [
    `${resource.name} (${resource.id})`,
    `  Platforms: ${resource.platforms.join(", ")}`,
    `  Capabilities: ${resource.capabilities.join(", ")}`,
    `  Disposition: ${resource.integration_disposition}; status: ${resource.status}`,
    `  License signal: ${resource.license_evidence.research_reported_license ?? "not reported"} (${resource.license_evidence.verification_status})`,
    `  Evidence: license=${resource.license_evidence.verification_status}, provenance=${resource.provenance_evidence.status}, compatibility=${resource.compatibility_evidence.status}`,
    `  URL: ${resource.url}`,
    `  Guidance: ${resource.selection_guidance}`
  ].join("\n")).join("\n\n");
}

async function main() {
  let options;
  try {
    options = parseSelectorArgs(process.argv.slice(2));
  } catch (error) {
    console.error(`${error.message}\n\n${usage}`);
    process.exitCode = 2;
    return;
  }
  if (options.help) {
    console.log(usage);
    return;
  }
  const catalog = JSON.parse(await readFile(new URL("catalog/resources.json", root), "utf8"));
  const results = selectResources(catalog, options);
  console.log(options.format === "json" ? JSON.stringify(results, null, 2) : renderText(results));
  console.error(`Matched ${results.length} candidate(s). Adoption remains disabled pending app-specific review.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) await main();
