import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const directory = path.join(root, "dist/node");
const packageManifest = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const manifestPath = path.join(directory, "build-manifest.json");

if (!fs.existsSync(manifestPath)) {
    throw new Error(`Missing committed local Server distribution: ${manifestPath}`);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
if (manifest.package !== packageManifest.name || manifest.packageVersion !== packageManifest.version) {
    throw new Error("Committed Server distribution does not match package.json name and version.");
}
if (manifest.platform !== "linux" || !["x64", "arm64"].includes(manifest.arch)) {
    throw new Error(`Unsupported committed Server build platform: ${manifest.platform}/${manifest.arch}`);
}
if (!/^[0-9a-f]{40}$/.test(manifest.commit || "")) {
    throw new Error("Committed Server distribution has an invalid source commit.");
}
if (!manifest.files || typeof manifest.files !== "object" || !Object.keys(manifest.files).length) {
    throw new Error("Committed Server distribution has no file integrity records.");
}

execFileSync("git", ["merge-base", "--is-ancestor", manifest.commit, "HEAD"], {
    cwd: root,
    stdio: "ignore"
});

const actualFiles = new Set();
function collect(directoryPath) {
    for (const entry of fs.readdirSync(directoryPath, { withFileTypes: true })) {
        const file = path.join(directoryPath, entry.name);
        if (entry.isDirectory()) collect(file);
        else if (entry.name !== "build-manifest.json") actualFiles.add(path.relative(directory, file));
    }
}
collect(directory);

const listedFiles = Object.keys(manifest.files).sort();
const actualFileList = [...actualFiles].sort();
if (JSON.stringify(listedFiles) !== JSON.stringify(actualFileList)) {
    throw new Error("Committed Server distribution files do not match build-manifest.json.");
}

for (const relative of listedFiles) {
    const file = path.resolve(directory, relative);
    if (!file.startsWith(`${directory}${path.sep}`)) {
        throw new Error(`Invalid path in Server build manifest: ${relative}`);
    }
    const contents = fs.readFileSync(file);
    const expected = manifest.files[relative];
    const hash = createHash("sha256").update(contents).digest("hex");
    if (contents.length !== expected.bytes || hash !== expected.sha256) {
        throw new Error(`Committed Server distribution failed integrity check: ${relative}`);
    }
}

for (const required of ["index.js", "package.json", "plugins/ai/index.js", "plugins/ai/runtime.js"]) {
    if (!actualFiles.has(required)) throw new Error(`Missing required Server distribution file: ${required}`);
}

console.log(`Verified committed ${manifest.package}@${manifest.packageVersion} runtime from ${manifest.commit} (${listedFiles.length} files).`);
