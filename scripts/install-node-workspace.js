import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const { default: config } = await import(pathToFileURL(path.join(root, "CoCreate.config.js")));
const storageRoot = `${path.resolve(root, "../CoCreate-storages")}${path.sep}`;
const repositories = Object.entries(config.modules || {})
    .filter(([name, entry]) =>
        name !== "cli" &&
        typeof entry?.path === "string" &&
        !path.resolve(root, entry.path).startsWith(storageRoot)
    );

for (const [name, entry] of repositories) {
    const packagePath = path.resolve(root, entry.path);
    if (!fs.existsSync(path.join(packagePath, "package.json"))) {
        throw new Error(`Missing configured package ${name}: ${packagePath}`);
    }

    console.log(`Installing build dependencies for ${name} (${packagePath})`);
    const result = spawnSync("yarn", ["install", "--non-interactive"], {
        cwd: packagePath,
        stdio: "inherit"
    });
    if (result.error) throw result.error;
    if (result.status !== 0) {
        throw new Error(`Dependency installation failed for ${name} (exit ${result.status})`);
    }
}
