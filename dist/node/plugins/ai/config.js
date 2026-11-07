import config from '@cocreate/config';
import { dotNotationToObject } from '@cocreate/utils';

export const defaults = {
    enabled: true,
    platformCredentialFallback: false,
    defaultStorageTarget: 'virtual',
    allowLocalFileSystem: false,
    allowUnconfirmedLocalWrite: false,
    allowPlatformCommands: false,
    platformCommandTimeout: 600000,
    platformCommandMaxOutputBytes: 1048576,
    cliPath: undefined,
    cliDirectory: undefined,
    requestTimeout: 600000,
    systemInstructions: ''
};

export async function resolveAIConfig(server, options = {}) {
    const aiConfig = { ...defaults };
    const localConfig = config.get('ai');
    if (localConfig) dotNotationToObject(localConfig, aiConfig);

    const databaseConfig = await config.query({
        type: 'ai',
        organization_id: server.organization_id
    }, server.crud);
    dotNotationToObject(databaseConfig, aiConfig);
    dotNotationToObject(options, aiConfig);

    // Project paths belong to Cluster's repository configuration, never AI.
    delete aiConfig.localFsRoot;
    return aiConfig;
}

export default resolveAIConfig;
