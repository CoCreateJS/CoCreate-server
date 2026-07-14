/********************************************************************************
 * Copyright (C) 2023 CoCreate and Contributors.
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

// Commercial Licensing Information:
// For commercial use of this software without the copyleft provisions of the AGPLv3,
// you must obtain a commercial license from CoCreate LLC.
// For details, visit <https://cocreate.app/licenses/> or contact us at sales@cocreate.app.

import server from '@cocreate/server';
import './modules.js'; // Self-registers and imports all background modules for side-effects

/**
 * Clean & Minimal Entry Point.
 * * Since CoCreate Server (defined in the Canvas) now fully manages its own:
 * - Vertical process cluster spawning (Primary/Master process splits)
 * - Crash recovery & automatic worker process recycling
 * - Secure TLS Cert Handshakes & dynamic Ingress setups
 * - Socket connection pipelines & Database (CRUD) links
 * - Static port bindings (8080 and 8443)
 * * We no longer need any boilerplate cluster, fork, or manual socket listening code here!
 */
async function boot() {
    try {
        await server.init();
    } catch (error) {
        console.error('[@cocreate/entry] Critical error during server bootstrap:', error);
        process.exit(1);
    }
}

boot();