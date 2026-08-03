/********************************************************************************
 * Copyright (C) 2026 CoCreate and Contributors.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 ********************************************************************************/

import server from '@cocreate/server';

async function boot() {
    try {
        // Initialize core server capabilities (database, IPC, sockets, TLS, state)
        await server.init();

        // 1. Master Role Execution (Only loads Master modules and installers into Master memory)
        if (server.isMaster) {
            await import('@cocreate/cron-jobs');
            await import('@cocreate/crud-server/storage/dynamodb');
            await import('@cocreate/crud-server/storage/firestore');
            await import('@cocreate/crud-server/storage/mongodb');
            await import('@cocreate/crud-server/storage/mysql');
            await import('@cocreate/crud-server/storage/postgresql');
            await import('@cocreate/crud-server/storage/qdrant');
            await import('@cocreate/crud-server/storage/sqlite');
        }

        // 2. Worker Role Execution (Only loads Worker modules into Worker memory)
        if (server.isWorker) {
            // Worker 1 specific dynamic import
            if (server.workerId === 1) {
                await import('@cocreate/notification');
            }

            // Dynamic imports for all worker processes
            const { default: Usage } = await import('@cocreate/usage');
            await import('@cocreate/organizations');
            await import('@cocreate/unique');
            await import('@cocreate/users');
            await import('@cocreate/url-uploader');

            // Instantiating Usage constructor with server organization ID
            new Usage(server.organization_id || server.organizationID);

            // Custom edge HTTP route registered in Map (path -> handler)
            server.routes.set('/api/v1/health', async (req, res) => {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    status: 'healthy',
                    workerId: server.workerId,
                    pid: process.pid
                }));
            });
        }

    } catch (error) {
        console.error('[@cocreate/entry] Critical error during server bootstrap:', error);
        process.exit(1);
    }
}

boot();