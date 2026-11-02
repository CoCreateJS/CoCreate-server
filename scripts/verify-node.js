import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "dist/node");
const storageSourceRoot = `${path.resolve(root, "../CoCreate-storages")}${path.sep}`;
const packageManifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const { default: config } = await import(pathToFileURL(path.join(root, "CoCreate.config.js")));
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
const repositories = {};
for (const [group, entries] of Object.entries({ modules: config.modules })) {
    for (const [name, entry] of Object.entries(entries || {})) {
        if (!entry?.path) continue;
        const repositoryPath = path.resolve(root, entry.path);
        if (repositoryPath.startsWith(storageSourceRoot)) continue;
        const manifestPath = path.join(repositoryPath, "package.json");
        if (!fs.existsSync(manifestPath)) {
            throw new Error(`Missing configured ${group} package: ${name} (${repositoryPath})`);
        }
        const sourceManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
        repositories[`${group}.${name}`] = {
            package: sourceManifest.name || null,
            version: sourceManifest.version || null,
            commit: execFileSync("git", ["rev-parse", "HEAD"], {
                cwd: repositoryPath,
                encoding: "utf8"
            }).trim()
        };
    }
}
fs.writeFileSync(path.join(directory, "build-manifest.json"), JSON.stringify({
    builtAt: new Date().toISOString(),
    package: packageManifest.name,
    packageVersion: packageManifest.version,
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    commit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim(),
    repositories,
    files
}, null, 2) + "\n");
console.log(`Verified ${packageManifest.name}@${packageManifest.version}, server syntax, ${storages.length} storage drivers, AI modules, and executable; wrote build-manifest.json.`);
