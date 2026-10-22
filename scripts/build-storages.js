import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import webpack from "webpack";

const workspaceRoot = fileURLToPath(new URL("../", import.meta.url));
const storageRoot = fileURLToPath(new URL("../../CoCreate-storages/", import.meta.url));
const runtimeStorageRoot = path.join(workspaceRoot, "storages");
fs.mkdirSync(runtimeStorageRoot, { recursive: true });

for (const directory of fs.readdirSync(storageRoot).sort()) {
    if (!directory.startsWith("CoCreate-") ||
        directory === "CoCreate-indexeddb" || directory === "CoCreate-storage-bundler") continue;

    const context = path.join(storageRoot, directory);
    const manifest = JSON.parse(fs.readFileSync(path.join(context, "package.json"), "utf8"));
    const engine = Object.keys(manifest.dependencies || {}).find(name =>
        /^@cocreate\/(mongodb|postgresql|mysql|sqlite)$/.test(name)
    );
    // Alias providers delegate to these engines and need the same transport
    // aliases and optional-dependency rules as their canonical distributions.
    const configurationDirectory = engine
        ? path.join(storageRoot, `CoCreate-${engine.split("/")[1]}`)
        : context;
    const { default: configure } = await import(pathToFileURL(path.join(configurationDirectory, "webpack.config.js")));
    const configurations = await configure({}, { mode: "production", watch: false });
    const distribution = configurations.find(config => config.name === "distribution");
    if (!distribution) throw new Error(`Missing server storage distribution configuration: ${directory}`);

    const filename = `${directory.slice("CoCreate-".length)}.js`;
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
            fs.copyFileSync(distributionFile, path.join(runtimeStorageRoot, filename));
            console.log(`Built ${directory} and refreshed runtime driver: storages/${filename}`);
            resolve();
        }));
    } finally {
        await new Promise((resolve, reject) => compiler.close(error => error ? reject(error) : resolve()));
    }
}
