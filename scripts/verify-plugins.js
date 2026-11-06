import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const outputRoot = path.join(root, "plugins");
const { default: config } = await import(pathToFileURL(path.join(root, "CoCreate.config.js")));
const pluginEntries = Object.entries(config.plugins || {}).filter(([, entry]) => entry?.path);
const manifestPath = path.join(outputRoot, "build-manifest.json");

if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing plugin build manifest: ${manifestPath}. Run yarn build:plugins, test the server, then commit the generated plugins/.`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.schemaVersion !== 1 || !manifest.plugins) {
    throw new Error(`Unsupported plugin build manifest: ${manifestPath}`);
}
if (pluginEntries.length !== Object.keys(manifest.plugins).length) {
    throw new Error(`Plugin build manifest does not match CoCreate.config.js. Expected ${pluginEntries.length} plugins, found ${Object.keys(manifest.plugins).length}.`);
}

for (const [key, entry] of pluginEntries) {
    const built = manifest.plugins[key];
    if (!built) throw new Error(`Missing plugin build manifest entry: ${key}`);
    const outputName = built.package?.startsWith("@cocreate/")
        ? built.package.slice("@cocreate/".length)
        : key;
    const pluginPath = path.join(outputRoot, outputName);

    const actualFiles = new Set();
    function verifyFolder(folder) {
        for (const item of fs.readdirSync(folder, { withFileTypes: true })) {
            const file = path.join(folder, item.name);
            if (item.isDirectory()) verifyFolder(file);
            else {
                const relative = path.relative(pluginPath, file);
                actualFiles.add(relative);
                const expected = built.files[relative];
                if (!expected) throw new Error(`Unlisted file in built plugin ${key}: ${relative}`);
                const contents = fs.readFileSync(file);
                const hash = createHash("sha256").update(contents).digest("hex");
                if (contents.length !== expected.bytes || hash !== expected.sha256) {
                    throw new Error(`Built plugin file does not match its manifest: ${key}/${relative}`);
                }
            }
        }
    }
    if (!fs.existsSync(pluginPath)) throw new Error(`Missing built plugin directory: ${pluginPath}`);
    verifyFolder(pluginPath);
    const missing = Object.keys(built.files).filter(file => !actualFiles.has(file));
    if (missing.length) throw new Error(`Missing built plugin files for ${key}: ${missing.join(", ")}`);
    if (key === "ai" && (!actualFiles.has("bootstrap.js") || !actualFiles.has("config.js"))) {
        throw new Error("AI plugin distribution must include bootstrap.js and config.js.");
    }
}

console.log(`Verified ${pluginEntries.length} committed plugin distributions and their SHA-256 hashes.`);
