import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const { default: config } = await import(pathToFileURL(path.join(root, "CoCreate.config.js")));
const entries = [
    ...(Array.isArray(config.repositories)
        ? config.repositories.map((entry, index) => [`repositories[${index}]`, entry])
        : Object.entries(config.repositories || {}).map(([name, entry]) => [`repositories.${name}`, entry])),
    ...Object.entries(config.modules || {}).map(([name, entry]) => [`modules.${name}`, entry]),
    ...Object.entries(config.storages || {}).map(([name, entry]) => [`storages.${name}`, entry]),
    ...Object.entries(config.plugins || {}).map(([name, entry]) => [`plugins.${name}`, entry]),
    ...Object.entries(config.projects || {}).map(([name, entry]) => [`projects.${name}`, entry])
];

for (const [name, entry] of entries) {
    if (!entry?.path || !entry.repo) continue;

    const target = path.resolve(root, entry.path);
    if (fs.existsSync(target)) continue;

    const repoUrl = entry.repo.startsWith("http://") || entry.repo.startsWith("https://")
        ? entry.repo
        : `https://${entry.repo}`;
    const cloneName = path.basename(new URL(repoUrl).pathname.replace(/\/$/, "").replace(/\.git$/, ""));
    const clonedPath = path.join(path.dirname(target), cloneName);

    if (!fs.existsSync(path.join(clonedPath, ".git"))) {
        throw new Error(`Configured ${name} was not cloned: expected ${target} or ${clonedPath}`);
    }

    fs.renameSync(clonedPath, target);
    console.log(`Renamed cloned ${name} directory to configured path: ${entry.path}`);
}
