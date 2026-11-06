import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configUrl = pathToFileURL(path.join(root, "CoCreate.config.js"));
const { default: config } = await import(configUrl);
const pluginRoot = path.resolve(root, "../CoCreate-plugins");
const requestedPlugins = new Set(process.argv.slice(2));
const builtPlugins = {};
const plugins = Object.entries(config.plugins || {}).filter(([key, plugin]) =>
    (!requestedPlugins.size || requestedPlugins.has(key)) &&
    typeof plugin?.path === "string" &&
    path.resolve(root, plugin.path).startsWith(`${pluginRoot}${path.sep}`)
);

if (!plugins.length) {
    const requested = requestedPlugins.size
        ? ` matching ${[...requestedPlugins].join(", ")}`
        : "";
    throw new Error(`No configured CoCreate plugins were found${requested}.`);
}

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

    // The server imports AI's bootstrap directly. Keep that entry and its
    // local config beside the committed runtime distribution so packaging
    // does not resolve them from a newer plugin checkout.
    if (outputName === "ai") {
        for (const file of ["bootstrap.js", "config.js"]) {
            const source = path.join(packageDirectory, "src", file);
            if (!fs.existsSync(source)) throw new Error(`Missing AI bootstrap source: ${source}`);
            fs.copyFileSync(source, path.join(outputDirectory, file));
        }
    }

    const files = {};
    function fingerprint(folder) {
        for (const entry of fs.readdirSync(folder, { withFileTypes: true })) {
            const file = path.join(folder, entry.name);
            if (entry.isDirectory()) fingerprint(file);
            else {
                const contents = fs.readFileSync(file);
                files[path.relative(outputDirectory, file)] = {
                    bytes: contents.length,
                    sha256: createHash("sha256").update(contents).digest("hex")
                };
            }
        }
    }
    fingerprint(outputDirectory);
    builtPlugins[key] = {
        package: manifest.name || null,
        version: manifest.version || null,
        commit: execFileSync("git", ["rev-parse", "HEAD"], {
            cwd: packageDirectory,
            encoding: "utf8"
        }).trim(),
        sourceDirty: Boolean(execFileSync("git", ["status", "--porcelain"], {
            cwd: packageDirectory,
            encoding: "utf8"
        }).trim()),
        files
    };
    console.log(`Built plugin ${key}: plugins/${outputName}`);
}

if (builtPlugins.ai) {
    fs.writeFileSync(path.join(root, "plugins/build-manifest.json"), JSON.stringify({
        schemaVersion: 1,
        builtAt: new Date().toISOString(),
        node: process.version,
        platform: process.platform,
        arch: process.arch,
        plugins: builtPlugins
    }, null, 2) + "\n");
    console.log(`Wrote plugin build manifest for ${Object.keys(builtPlugins).length} plugins.`);
}
