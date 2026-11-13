import { cpSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
const source = fileURLToPath(new URL("../../../components/web/", import.meta.url));
const target = fileURLToPath(new URL("../src/components/", import.meta.url));
rmSync(target, { recursive: true, force: true });
mkdirSync(target, { recursive: true });
cpSync(source, target, { recursive: true });
console.log("Staged original shared web components for fixture compilation.");
