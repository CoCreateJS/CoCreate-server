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

import cluster from '@cocreate/cluster';
// import AI from '@cocreate/ai';

async function boot() {
    try {
        // Apply core cluster capabilities (database, IPC, sockets, TLS, state)
        await cluster.init();

        // 1. Primary Role Execution
        if (cluster.isPrimary) {
            await import('@cocreate/cron');
        }

        // 2. Worker Role Execution (Only loads Worker modules into Worker memory)
        if (cluster.isWorker || cluster.totalWorkers <= 1) {
            // Worker 1 specific dynamic import
            // if (cluster.workerId === 1) {
            //
            // }

            // Dynamic imports for all worker processes
            // await import('@cocreate/notification');

            const Organizations = await import('@cocreate/organizations');
            await Organizations.init(cluster);
            const Users = await import('@cocreate/users');
            await Users.init(cluster);

            // cluster.ai = await AI.init(cluster);

            // Custom edge HTTP route registered in Map (path -> handler)
            // cluster.routes.set('/api/v1/health', async (req, res) => {
            //     res.writeHead(200, { 'Content-Type': 'application/json' });
            //     res.end(JSON.stringify({
            //         status: 'healthy',
            //         workerId: cluster.workerId,
            //         pid: process.pid
            //     }));
            // });
        }

        // Initialize core cluster capabilities (database, IPC, sockets, TLS, state)

    } catch (error) {
        console.error('[@cocreate/server] Critical error during server bootstrap:', error);
        process.exit(1);
    }
}

boot();
