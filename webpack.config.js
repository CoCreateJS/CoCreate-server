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
function runtimeAliases() {
    // Only the lightweight AI configuration shell belongs in the server
    // bundle. It resolves the disk-based runtime when AI is enabled.
    return {
        "@cocreate/ai$": path.join(__dirname, "plugins/ai/bootstrap.js")
    };
}

class RuntimeAssetsPlugin {
    apply(compiler) {
        compiler.hooks.afterEmit.tap("RuntimeAssetsPlugin", () => {
            // Ship optional host setup as a standalone helper, outside the runtime bundle.
            fs.copyFileSync(path.join(__dirname, "startup.js"), path.join(compiler.options.output.path, "startup.js"));
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

            const storagePackages = path.join(__dirname, "storages");
            const storageOutput = path.join(compiler.options.output.path, "storages");
            fs.mkdirSync(storageOutput, { recursive: true });
            if (!fs.existsSync(storagePackages)) {
                throw new Error(`Missing built storage distributions: ${storagePackages}`);
            }
            fs.cpSync(storagePackages, storageOutput, { recursive: true });
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
        // Runtime packages resolve from node_modules using their published
        // package exports. Only the committed AI bootstrap is bundled locally.
        alias: runtimeAliases(),
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
