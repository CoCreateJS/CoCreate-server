import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import webpack from "webpack";

const workspaceRoot = path.resolve(fileURLToPath(new URL("../", import.meta.url)));
const storageRoot = path.resolve(fileURLToPath(new URL("../../CoCreate-storages/", import.meta.url)));
const runtimeStorageRoot = path.join(workspaceRoot, "storages");
const { default: config } = await import(pathToFileURL(path.join(workspaceRoot, "CoCreate.config.js")));
fs.mkdirSync(runtimeStorageRoot, { recursive: true });

const storages = Object.entries(config.modules || {})
    .filter(([name, entry]) =>
        typeof entry?.path === "string" &&
        path.resolve(workspaceRoot, entry.path).startsWith(`${storageRoot}${path.sep}`) &&
        name !== "indexeddb" &&
        name !== "storage-bundler"
    )
    .sort(([nameA], [nameB]) => nameA.localeCompare(nameB));
const providers = {};

for (const [name, entry] of storages) {
    const context = path.resolve(workspaceRoot, entry.path);
    const manifestPath = path.join(context, "package.json");
    if (!fs.existsSync(manifestPath)) throw new Error(`Missing storage package ${name}: ${context}`);
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    const engine = Object.keys(manifest.dependencies || {}).find(name =>
        /^@cocreate\/(mongodb|postgresql|mysql|sqlite)$/.test(name)
    );
    // Alias providers delegate to these engines and need the same transport
    // aliases and optional-dependency rules as their canonical distributions.
    const configurationDirectory = engine
        ? path.resolve(storageRoot, engine.split("/")[1])
        : context;
    if (!fs.existsSync(path.join(configurationDirectory, "webpack.config.js"))) {
        throw new Error(`Missing webpack configuration for storage ${name}: ${configurationDirectory}`);
    }
    const { default: configure } = await import(pathToFileURL(path.join(configurationDirectory, "webpack.config.js")));
    const configurations = await configure({}, { mode: "production", watch: false });
    const distribution = configurations.find(config => config.name === "distribution");
    if (!distribution) throw new Error(`Missing server storage distribution configuration: ${name}`);

    const outputName = manifest.name?.startsWith("@cocreate/")
        ? manifest.name.slice("@cocreate/".length)
        : name;
    const filename = `${outputName}.js`;
    const compiler = webpack({
        ...distribution,
        context,
        output: { ...distribution.output, path: path.join(context, "dist"), filename }
    });
    try {
        await new Promise((resolve, reject) => compiler.run((error, stats) => {
            if (error) return reject(error);
            if (stats.hasErrors()) {
                return reject(new Error(stats.toString({ all: false, errors: true })));
            }
            if (stats.hasWarnings()) console.warn(stats.toString({ all: false, warnings: true }));
            const distributionFile = path.join(context, "dist", filename);
            const outputFile = path.join(runtimeStorageRoot, filename);
            fs.copyFileSync(distributionFile, outputFile);
            const contents = fs.readFileSync(outputFile);
            providers[name] = {
                package: manifest.name || null,
                version: manifest.version || null,
                commit: execFileSync("git", ["rev-parse", "HEAD"], {
                    cwd: context,
                    encoding: "utf8"
                }).trim(),
                file: filename,
                bytes: contents.length,
                sha256: createHash("sha256").update(contents).digest("hex")
            };
            console.log(`Built ${name} and refreshed runtime driver: storages/${filename}`);
            resolve();
        }));
    } finally {
        await new Promise((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()));
    }
}

const expectedFiles = new Set(Object.values(providers).map(provider => provider.file));
for (const file of fs.readdirSync(runtimeStorageRoot)) {
    if (file.endsWith(".js") && !expectedFiles.has(file)) {
        fs.rmSync(path.join(runtimeStorageRoot, file));
    }
}
fs.writeFileSync(path.join(runtimeStorageRoot, "manifest.json"), JSON.stringify({
    schemaVersion: 1,
    builtAt: new Date().toISOString(),
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    providers
}, null, 2) + "\n");
console.log(`Wrote storage build manifest for ${Object.keys(providers).length} providers.`);
