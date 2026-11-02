import config from '@cocreate/config';
import { dotNotationToObject } from '@cocreate/utils';
import { join } from 'node:path';

export const defaults = {
    enabled: true,
    platformCredentialFallback: false,
    defaultStorageTarget: 'virtual',
    allowLocalFileSystem: false,
    allowUnconfirmedLocalWrite: false,
    allowPlatformCommands: false,
    platformCommandTimeout: 600000,
    platformCommandMaxOutputBytes: 1048576,
    localFsRoot: join(process.cwd(), 'organizations'),
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

    return aiConfig;
}

export default resolveAIConfig;
