/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * Licensed under GNU AGPLv3.
 ********************************************************************************/

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import webpack from "webpack";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");

function workspaceAliases() {
    const aliases = {};
    for (const directory of [
        "CoCreate-modules",
        "CoCreate-plugins"
    ]) {
        const packagesDirectory = path.join(workspaceRoot, directory);
        if (!fs.existsSync(packagesDirectory)) continue;

        for (const packageDirectory of fs.readdirSync(packagesDirectory)) {
            const absoluteDirectory = path.join(packagesDirectory, packageDirectory);
            const packagePath = path.join(absoluteDirectory, "package.json");
            if (!fs.existsSync(packagePath)) continue;

            const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
            if (packageJson.name?.startsWith("@cocreate/")) {
                aliases[packageJson.name] = absoluteDirectory;
            }
        }
    }

    // Only the lightweight AI configuration shell belongs in the server
    // bundle. It resolves the disk-based runtime when AI is enabled.
    aliases["@cocreate/ai"] = path.join(
        workspaceRoot,
        "CoCreate-plugins/server-ai/src/bootstrap.js"
    );
    return aliases;
}

class RuntimeAssetsPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tap("RuntimeAssetsPlugin", () => {
            const pluginSource = path.join(__dirname, "plugins");
            const pluginOutput = path.join(compiler.options.output.path, "plugins");

            if (!fs.existsSync(path.join(pluginSource, "ai", "index.js")) ||
                !fs.existsSync(path.join(pluginSource, "ai", "runtime.js"))) {
                throw new Error(`Missing plugin distributions: ${pluginSource}`);
            }
            fs.cpSync(pluginSource, pluginOutput, { recursive: true });

            fs.writeFileSync(
                path.join(compiler.options.output.path, "package.json"),
                `${JSON.stringify({ private: true, type: "module" }, null, 2)}\n`
            );

            const storagePackages = path.join(workspaceRoot, "CoCreate-storages");
            const storageOutput = path.join(compiler.options.output.path, "storages");
            fs.mkdirSync(storageOutput, { recursive: true });

            for (const packageDirectory of fs.readdirSync(storagePackages)) {
                if (!packageDirectory.startsWith("CoCreate-")) continue;

                const provider = packageDirectory.slice("CoCreate-".length);
                const source = path.join(
                    storagePackages,
                    packageDirectory,
                    "dist",
                    `${provider}.js`
                );
                if (!fs.existsSync(source)) continue;

                fs.copyFileSync(
                    source,
                    path.join(storageOutput, `${provider}.js`)
                );
            }
        });
    }
}

export default {
    mode: "production",
    target: "node18",
    entry: "./src/index.js",
    experiments: {
        outputModule: true
    },
    resolve: {
        alias: workspaceAliases(),
        extensions: [".js", ".mjs", ".cjs", ".json"],
        fullySpecified: false
    },
    output: {
        path: path.resolve(__dirname, "dist/node"),
        filename: "index.js",
        library: { type: "module" },
        clean: true,
        globalObject: "this"
    },
    optimization: {
        minimize: false,
        concatenateModules: false,
        splitChunks: false,
        runtimeChunk: false
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
        new RuntimeAssetsPlugin()
    ],
    performance: {
        hints: false
    },
    devtool: false
};
