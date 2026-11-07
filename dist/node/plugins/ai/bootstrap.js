import { resolveAIConfig } from './config.js';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

function disabledAI(config) {
    return {
        config,
        async send() {
            throw new Error(
                '[@cocreate/ai] AI is disabled by configuration (ai.enabled=false).'
            );
        },
        async stop() { }
    };
}

/**
 * Initialize the CoCreate AI integration on a server instance.
 *
 * @public
 * @environment server
 */
export async function init(server, options = {}) {
    const { pluginDirectory, ...configOptions } = options;
    const aiConfig = await resolveAIConfig(server, configOptions);

    if (!aiConfig.enabled) return disabledAI(aiConfig);

    const pluginDirectories = [
        pluginDirectory,
        path.join(process.cwd(), 'plugins', 'ai'),
        process.argv[1]
            ? path.join(
                path.dirname(path.resolve(process.argv[1])),
                'plugins',
                'ai'
            )
            : null
    ].filter(Boolean);

    let runtimeUrl;
    let resolvedPluginDirectory;
    for (const directory of pluginDirectories) {
        const directoryPath = directory.startsWith?.('file:')
            ? fileURLToPath(directory)
            : directory;
        const runtimePath = path.join(directoryPath, 'runtime.js');
        if (!existsSync(runtimePath)) continue;

        resolvedPluginDirectory = pathToFileURL(
            `${directoryPath}${path.sep}`
        ).href;
        runtimeUrl = pathToFileURL(runtimePath).href;
        break;
    }

    if (!aiConfig.cliPath && !aiConfig.cliDirectory && resolvedPluginDirectory) {
        aiConfig.cliDirectory = resolvedPluginDirectory;
    }

    const runtime = runtimeUrl
        ? await import(/* webpackIgnore: true */ runtimeUrl)
        : await import(/* webpackIgnore: true */ '@cocreate/ai/runtime');
    const { init: initRuntime } = runtime;
    return initRuntime(server, {}, aiConfig);
}

export default { init };

/**
 * Headless server AI for CoCreate with tenant-scoped tools and WebSocket streaming.
 *
 * @module ai
 * @environment server
 */
