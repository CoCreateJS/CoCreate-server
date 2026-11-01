export default {
    organization_id: "",
    key: "",
    host: "",
    workers: 2, // Number of worker processes

    telemetry: {
        "enabled": true,
        "collectionInterval": 1000,
        "writeInterval": 240000,
        "retentionDays": 30,
        "broadcast": false,
        "scaleUpMemoryThreshold": 85,
        "safetyLimits": {
            "cordonMemoryThreshold": 90,
            "cordonCpuThreshold": 90
        }
    },

    // Horizontal scaling configuration
    autoscaler: {
        horizontal: {
            enabled: true, // Enable or disable horizontal scaling
            memoryThreshold: "70%", // Memory usage threshold for scaling
            cpuThreshold: "70%", // CPU usage threshold for scaling
            maxServers: 10 // Maximum number of servers to scale out to
        },
        vertical: false // Vertical scaling not enabled
    },
    ai: {

    },

    /**
 * @property {string} moduleOutputPath
 * @description Defines the destination file path where the build system (e.g., ModuleGenerator Webpack plugin)
 * will save the dynamically generated module entry file. This file contains the automated import and lazy-loading logic.
 */
    moduleOutputPath: "./CoCreate.index.js",

    /**
     * @namespace modules
     * @description Configures core modules, storage adapters, and external API libraries.
     * For development environments, the Poly Repo CLI reads the 'path' and 'repo' keys from these objects.
     */
    modules: {
        // --- Core Server & Deployment Modules ---
        server: {
            import: "@cocreate/server",
            path: "../CoCreate-modules/server",
            repo: "github.com/cocreatejs/CoCreate-server.git"
        },
        "server-mesh": {
            import: "@cocreate/server-mesh",
            path: "../CoCreate-modules/server-mesh",
            repo: "github.com/cocreatejs/CoCreate-server-mesh.git"
        },
        "server-autoscaler": {
            import: "@cocreate/server-autoscaler",
            path: "../CoCreate-modules/server-autoscaler",
            repo: "github.com/cocreatejs/CoCreate-server-autoscaler.git"
        },
        "server-telemetry": {
            import: "@cocreate/server-telemetry",
            path: "../CoCreate-modules/server-telemetry",
            repo: "github.com/cocreatejs/CoCreate-server-telemetry.git"
        },
        "crud-server": {
            import: "@cocreate/crud-server",
            path: "../CoCreate-modules/crud-server",
            repo: "github.com/cocreatejs/CoCreate-crud-server.git"
        },
        "server-tls": {
            import: "@cocreate/server-tls",
            path: "../CoCreate-modules/server-tls",
            repo: "github.com/cocreatejs/CoCreate-server-tls.git"
        },
        authenticate: {
            import: "@cocreate/authenticate",
            path: "../CoCreate-modules/authenticate",
            repo: "github.com/cocreatejs/CoCreate-authenticate.git"
        },
        authorize: {
            import: "@cocreate/authorize",
            path: "../CoCreate-modules/authorize",
            repo: "github.com/cocreatejs/CoCreate-authorize.git"
        },
        "socket-server": {
            import: "@cocreate/socket-server",
            path: "../CoCreate-modules/socket-server",
            repo: "github.com/cocreatejs/CoCreate-socket-server.git",
        },
        "file-server": {
            import: "@cocreate/file-server",
            path: "../CoCreate-modules/file-server",
            repo: "github.com/cocreatejs/CoCreate-file-server.git",
        },
        "server-side-render": {
            import: "@cocreate/server-side-render",
            path: "../CoCreate-modules/server-side-render",
            repo: "github.com/cocreatejs/CoCreate-server-side-render.git"
        },
        "server-sitemap": {
            import: "@cocreate/server-sitemap",
            path: "../CoCreate-modules/server-sitemap",
            repo: "github.com/CoCreateJS/CoCreate-server-sitemap.git"
        },
        "server-cron": {
            import: "@cocreate/server-cron",
            path: "../CoCreate-modules/server-cron",
            repo: "github.com/cocreatejs/CoCreate-server-cron.git"
        },
        "server-usage": {
            import: "@cocreate/server-usage",
            path: "../CoCreate-modules/server-usage",
            repo: "github.com/cocreatejs/CoCreate-server-usage.git"
        },

        // --- Database & Storage Modules ---
        "amazon-redshift": {
            import: "@cocreate/amazon-redshift",
            path: "../CoCreate-storages/amazon-redshift",
            repo: "github.com/cocreatejs/CoCreate-amazon-redshift.git"
        },
        auroradb: {
            import: "@cocreate/auroradb",
            path: "../CoCreate-storages/auroradb",
            repo: "github.com/cocreatejs/CoCreate-auroradb.git"
        },
        cockroachdb: {
            import: "@cocreate/cockroachdb",
            path: "../CoCreate-storages/cockroachdb",
            repo: "github.com/cocreatejs/CoCreate-cockroachdb.git"
        },
        cosmosdb: {
            import: "@cocreate/cosmosdb",
            path: "../CoCreate-storages/cosmosdb",
            repo: "github.com/cocreatejs/CoCreate-cosmosdb.git"
        },
        documentdb: {
            import: "@cocreate/documentdb",
            path: "../CoCreate-storages/documentdb",
            repo: "github.com/cocreatejs/CoCreate-documentdb.git"
        },
        dqlite: {
            import: "@cocreate/dqlite",
            path: "../CoCreate-storages/dqlite",
            repo: "github.com/cocreatejs/CoCreate-dqlite.git"
        },
        dynamodb: {
            import: "@cocreate/dynamodb",
            path: "../CoCreate-storages/dynamodb",
            repo: "github.com/cocreatejs/CoCreate-dynamodb.git"
        },
        ferretdb: {
            import: "@cocreate/ferretdb",
            path: "../CoCreate-storages/ferretdb",
            repo: "github.com/cocreatejs/CoCreate-ferretdb.git"
        },
        firestore: {
            import: "@cocreate/firestore",
            path: "../CoCreate-storages/firestore",
            repo: "github.com/cocreatejs/CoCreate-firestore.git"
        },
        mariadb: {
            import: "@cocreate/mariadb",
            path: "../CoCreate-storages/mariadb",
            repo: "github.com/cocreatejs/CoCreate-mariadb.git"
        },
        mongodb: {
            import: "@cocreate/mongodb",
            path: "../CoCreate-storages/mongodb",
            repo: "github.com/cocreatejs/CoCreate-mongodb.git"
        },
        mysql: {
            import: "@cocreate/mysql",
            path: "../CoCreate-storages/mysql",
            repo: "github.com/cocreatejs/CoCreate-mysql.git"
        },
        oracledb: {
            import: "@cocreate/oracledb",
            path: "../CoCreate-storages/oracledb",
            repo: "github.com/cocreatejs/CoCreate-oracledb.git"
        },
        planetscale: {
            import: "@cocreate/planetscale",
            path: "../CoCreate-storages/planetscale",
            repo: "github.com/cocreatejs/CoCreate-planetscale.git"
        },
        postgresql: {
            import: "@cocreate/postgresql",
            path: "../CoCreate-storages/postgresql",
            repo: "github.com/cocreatejs/CoCreate-postgresql.git"
        },
        rqlite: {
            import: "@cocreate/rqlite",
            path: "../CoCreate-storages/rqlite",
            repo: "github.com/cocreatejs/CoCreate-rqlite.git"
        },
        qdrant: {
            import: "@cocreate/qdrant",
            path: "../CoCreate-storages/qdrant",
            repo: "github.com/cocreatejs/CoCreate-qdrant.git"
        },
        sqlite: {
            import: "@cocreate/sqlite",
            path: "../CoCreate-storages/sqlite",
            repo: "github.com/cocreatejs/CoCreate-sqlite.git"
        },
        tidb: {
            import: "@cocreate/tidb",
            path: "../CoCreate-storages/tidb",
            repo: "github.com/cocreatejs/CoCreate-tidb.git"
        },
        timescaledb: {
            import: "@cocreate/timescaledb",
            path: "../CoCreate-storages/timescaledb",
            repo: "github.com/cocreatejs/CoCreate-timescaledb.git"
        },
        turso: {
            import: "@cocreate/turso",
            path: "../CoCreate-storages/turso",
            repo: "github.com/cocreatejs/CoCreate-turso.git"
        },
        yugabytedb: {
            import: "@cocreate/yugabytedb",
            path: "../CoCreate-storages/yugabytedb",
            repo: "github.com/cocreatejs/CoCreate-yugabytedb.git"
        },

        // --- Standard Client/Server Modules ---
        config: {
            import: "@cocreate/config",
            path: "../CoCreate-modules/config",
            repo: "github.com/cocreatejs/CoCreate-config.git"
        },
        api: {
            import: "@cocreate/api",
            path: "../CoCreate-modules/api",
            repo: "github.com/cocreatejs/CoCreate-api.git"
        },
        "lazy-loader": {
            import: "@cocreate/lazy-loader",
            path: "../CoCreate-modules/lazy-loader",
            repo: "github.com/cocreatejs/CoCreate-lazy-loader.git"
        },
        notification: {
            import: "@cocreate/notification",
            path: "../CoCreate-modules/notification",
            repo: "github.com/cocreatejs/CoCreate-notification.git"
        },
        organizations: {
            import: "@cocreate/organizations",
            path: "../CoCreate-modules/organizations",
            repo: "github.com/cocreatejs/CoCreate-organizations.git"
        },
        users: {
            import: "@cocreate/users",
            path: "../CoCreate-modules/users",
            repo: "github.com/cocreatejs/CoCreate-users.git"
        },
        workflows: {
            import: "@cocreate/workflows",
            path: "../CoCreate-modules/workflows",
            repo: "github.com/CoCreateJS/CoCreate-workflows.git"
        },
        utils: {
            import: "@cocreate/utils",
            path: "../CoCreate-modules/utils",
            repo: "github.com/cocreatejs/CoCreate-utils.git"
        },

        // --- Dev Modules ---
        cli: {
            import: "@cocreate/cli",
            path: "../CoCreate-modules/cli",
            repo: "github.com/cocreatejs/CoCreate-cli.git"
        }
    },
    plugins: {
        ai: {
            import: "@cocreate/ai",
            path: "../CoCreate-plugins/server-ai",
            repo: "github.com/cocreatejs/CoCreate-AI.git"
        }
    },
    projects: {
        CoCreateWS: {
            path: "../CoCreateWS",
            repo: "github.com/cocreatejs/CoCreateWS.git",
            exclude: ["git"]
        }
    }
};
