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

        // 1. Primary Role Execution (Only loads primary modules and installers into primary memory)
        if (server.isPrimary) {
            await import('@cocreate/cron-jobs');
            // await import('@cocreate/server/storage/dynamodb');
            await import('@cocreate/server/storage/firestore');
            await import('@cocreate/server/storage/mongodb');
            await import('@cocreate/server/storage/mysql');
            await import('@cocreate/server/storage/postgresql');
            await import('@cocreate/server/storage/qdrant');
            await import('@cocreate/server/storage/sqlite');
        }

        // 2. Worker Role Execution (Only loads Worker modules into Worker memory)
        if (server.isWorker || server.totalWorkers <= 1) {
            // Worker 1 specific dynamic import
            // if (server.workerId === 1) {
            //
            // }

            // Dynamic imports for all worker processes
            await import('@cocreate/organizations');
            // await import('@cocreate/notification');
            // await import('@cocreate/unique');
            await import('@cocreate/users');
            await import('@cocreate/url-uploader');

            const { default: AI } = await import('@cocreate/ai');
            server.ai = await AI.init(server);

            // Custom edge HTTP route registered in Map (path -> handler)
            // server.routes.set('/api/v1/health', async (req, res) => {
            //     res.writeHead(200, { 'Content-Type': 'application/json' });
            //     res.end(JSON.stringify({
            //         status: 'healthy',
            //         workerId: server.workerId,
            //         pid: process.pid
            //     }));
            // });
        }

    } catch (error) {
        console.error('[@cocreate/entry] Critical error during server bootstrap:', error);
        process.exit(1);
    }
}

boot();