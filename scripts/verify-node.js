import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "dist/node");
execFileSync(process.execPath, ["--check", path.join(directory, "index.js")]);

const storages = fs.readdirSync(path.join(directory, "storages")).filter(file => file.endsWith(".js")).sort();
if (!storages.length) throw new Error("No storage distributions were packaged");
// This smoke check loads every lazy driver, each with its own cleanup listener.
process.setMaxListeners(process.getMaxListeners() + storages.length);
for (const file of storages) {
    const module = await import(pathToFileURL(path.join(directory, "storages", file)));
    if (typeof (module.default || module).send !== "function") {
        throw new Error(`Storage distribution does not expose send(): ${file}`);
    }
}
for (const file of ["index.js", "runtime.js"]) {
    const module = await import(pathToFileURL(path.join(directory, "plugins/ai", file)));
    if (typeof module.init !== "function" && typeof module.default?.init !== "function") {
        throw new Error(`AI distribution does not expose init(): ${file}`);
    }
}
fs.accessSync(path.join(directory, `plugins/ai/copilot-${process.platform}-${process.arch}`), fs.constants.X_OK);

const files = {};
function fingerprint(folder) {
    for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
        const file = path.join(folder, entry.name);
        if (entry.isDirectory()) fingerprint(file);
        else if (entry.name !== "build-manifest.json") {
            const contents = fs.readFileSync(file);
            files[path.relative(directory, file)] = {
                bytes: contents.length,
                sha256: createHash("sha256").update(contents).digest("hex")
            };
        }
    }
}
fingerprint(directory);
fs.writeFileSync(path.join(directory, "build-manifest.json"), JSON.stringify({
    builtAt: new Date().toISOString(),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    commit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    files
}, null, 2) + "\n");
console.log(`Verified server syntax, ${storages.length} storage drivers, AI modules, and executable; wrote build-manifest.json.`);
