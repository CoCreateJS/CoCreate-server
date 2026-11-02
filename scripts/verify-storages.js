import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const storageRoot = path.resolve(root, "../CoCreate-storages");
const outputRoot = path.join(root, "storages");
const { default: config } = await import(pathToFileURL(path.join(root, "CoCreate.config.js")));
const expected = Object.entries(config.modules || {})
    .filter(([name, entry]) =>
        typeof entry?.path === "string" &&
        path.resolve(root, entry.path).startsWith(`${storageRoot}${path.sep}`) &&
        name !== "indexeddb" &&
        name !== "storage-bundler"
    )
    .map(([name]) => name)
    .sort();
const manifestPath = path.join(outputRoot, "manifest.json");

if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing storage build manifest: ${manifestPath}. Run yarn build:storages, test the server, then commit the generated storages/.`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.schemaVersion !== 1 || !manifest.providers) {
    throw new Error(`Unsupported storage build manifest: ${manifestPath}`);
}

const actual = Object.keys(manifest.providers).sort();
if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw new Error(`Storage build manifest does not match CoCreate.config.js. Expected [${expected.join(", ")}], found [${actual.join(", ")}].`);
}

for (const name of expected) {
    const provider = manifest.providers[name];
    const artifactPath = path.join(outputRoot, provider.file);
    if (!fs.existsSync(artifactPath)) throw new Error(`Missing built storage for ${name}: ${artifactPath}`);
    const contents = fs.readFileSync(artifactPath);
    const hash = createHash("sha256").update(contents).digest("hex");
    if (contents.length !== provider.bytes || hash !== provider.sha256) {
        throw new Error(`Built storage does not match its manifest: ${name} (${provider.file})`);
    }
}

const expectedFiles = new Set(Object.values(manifest.providers).map(provider => provider.file));
const extraFiles = fs.readdirSync(outputRoot)
    .filter(file => file.endsWith(".js") && !expectedFiles.has(file));
if (extraFiles.length) throw new Error(`Unexpected storage builds found: ${extraFiles.join(", ")}`);

console.log(`Verified ${expected.length} committed storage distributions and their SHA-256 hashes.`);
