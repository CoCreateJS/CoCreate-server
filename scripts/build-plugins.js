import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configUrl = pathToFileURL(path.join(root, "CoCreate.config.js"));
const { default: config } = await import(configUrl);
const pluginRoot = path.resolve(root, "../CoCreate-plugins");
const plugins = Object.entries(config.plugins || {}).filter(([, plugin]) =>
    typeof plugin?.path === "string" &&
    path.resolve(root, plugin.path).startsWith(`${pluginRoot}${path.sep}`)
);

if (!plugins.length) throw new Error("No configured CoCreate plugins were found.");

for (const [key, plugin] of plugins) {
    const packageDirectory = path.resolve(root, plugin.path);
    const manifestPath = path.join(packageDirectory, "package.json");
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`Missing plugin package manifest: ${manifestPath}`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    if (!manifest.scripts?.build) {
        throw new Error(`Plugin ${key} has no build script: ${packageDirectory}`);
    }

    const build = spawnSync("yarn", ["--cwd", packageDirectory, "build"], {
        cwd: root,
        stdio: "inherit"
    });
    if (build.error) throw build.error;
    if (build.status !== 0) {
        throw new Error(`Plugin build failed: ${key} (exit ${build.status})`);
    }

    const distribution = path.join(packageDirectory, "dist");
    if (!fs.existsSync(distribution)) {
        throw new Error(`Missing plugin distribution: ${distribution}`);
    }

    const outputName = manifest.name?.startsWith("@cocreate/")
        ? manifest.name.slice("@cocreate/".length)
        : key;
    const outputDirectory = path.join(root, "plugins", outputName);
    fs.rmSync(outputDirectory, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(outputDirectory), { recursive: true });
    fs.cpSync(distribution, outputDirectory, { recursive: true });
    console.log(`Built plugin ${key}: plugins/${outputName}`);
}
