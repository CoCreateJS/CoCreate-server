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
            path: "../CoCreate-modules/CoCreate-server",
            repo: "gitlab.com/cocreatejs/CoCreate-server.git"
        },
        "server-mesh": {
            import: "@cocreate/server-mesh",
            path: "../CoCreate-modules/CoCreate-server-mesh",
            repo: "gitlab.com/cocreatejs/CoCreate-server-mesh.git"
        },
        "server-autoscaler": {
            import: "@cocreate/server-autoscaler",
            path: "../CoCreate-modules/CoCreate-server-autoscaler",
            repo: "gitlab.com/cocreatejs/CoCreate-server-autoscaler.git"
        },
        "server-telemetry": {
            import: "@cocreate/server-telemetry",
            path: "../CoCreate-modules/CoCreate-server-telemetry",
            repo: "gitlab.com/cocreatejs/CoCreate-server-telemetry.git"
        },
        "server-container": {
            import: "@cocreate/server-container",
            path: "../CoCreate-modules/CoCreate-server-container",
            repo: "gitlab.com/cocreatejs/CoCreate-server-container.git"
        },
        "crud-server": {
            import: "@cocreate/crud-server",
            path: "../CoCreate-modules/CoCreate-crud-server",
            repo: "gitlab.com/cocreatejs/CoCreate-crud-server.git"
        },
        "server-tls": {
            import: "@cocreate/server-tls",
            path: "../CoCreate-modules/CoCreate-server-tls",
            repo: "gitlab.com/cocreatejs/CoCreate-server-tls.git"
        },
        authenticate: {
            import: "@cocreate/authenticate",
            path: "../CoCreate-modules/CoCreate-authenticate",
            repo: "gitlab.com/cocreatejs/CoCreate-authenticate.git"
        },
        authorize: {
            import: "@cocreate/authorize",
            path: "../CoCreate-modules/CoCreate-authorize",
            repo: "gitlab.com/cocreatejs/CoCreate-authorize.git"
        },
        "socket-server": {
            import: "@cocreate/socket-server",
            path: "../CoCreate-modules/CoCreate-socket-server",
            repo: "gitlab.com/cocreatejs/CoCreate-socket-server.git",
        },
        "file-server": {
            import: "@cocreate/file-server",
            path: "../CoCreate-modules/CoCreate-file-server",
            repo: "gitlab.com/cocreatejs/CoCreate-file-server.git",
        },
        "server-side-render": {
            import: "@cocreate/server-side-render",
            path: "../CoCreate-modules/CoCreate-server-side-render",
            repo: "gitlab.com/cocreatejs/CoCreate-server-side-render.git"
        },
        sitemap: {
            import: "@cocreate/sitemap",
            path: "../CoCreate-modules/CoCreate-sitemap",
            repo: "gitlab.com/cocreatejs/CoCreate-sitemap.git"
        },
        "cron-jobs": {
            import: "@cocreate/cron-jobs",
            path: "../CoCreate-modules/CoCreate-cron-jobs",
            repo: "gitlab.com/cocreatejs/CoCreate-cron-jobs.git"
        },
        usage: {
            import: "@cocreate/usage",
            path: "../CoCreate-modules/CoCreate-usage",
            repo: "gitlab.com/cocreatejs/CoCreate-usage.git"
        },

        // --- Database & Storage Modules ---
        "amazon-redshift": {
            import: "@cocreate/amazon-redshift",
            path: "../CoCreate-storages/CoCreate-amazon-redshift",
            repo: "gitlab.com/cocreatejs/CoCreate-amazon-redshift.git"
        },
        auroradb: {
            import: "@cocreate/auroradb",
            path: "../CoCreate-storages/CoCreate-auroradb",
            repo: "gitlab.com/cocreatejs/CoCreate-auroradb.git"
        },
        cockroachdb: {
            import: "@cocreate/cockroachdb",
            path: "../CoCreate-storages/CoCreate-cockroachdb",
            repo: "gitlab.com/cocreatejs/CoCreate-cockroachdb.git"
        },
        cosmosdb: {
            import: "@cocreate/cosmosdb",
            path: "../CoCreate-storages/CoCreate-cosmosdb",
            repo: "gitlab.com/cocreatejs/CoCreate-cosmosdb.git"
        },
        documentdb: {
            import: "@cocreate/documentdb",
            path: "../CoCreate-storages/CoCreate-documentdb",
            repo: "gitlab.com/cocreatejs/CoCreate-documentdb.git"
        },
        dqlite: {
            import: "@cocreate/dqlite",
            path: "../CoCreate-storages/CoCreate-dqlite",
            repo: "gitlab.com/cocreatejs/CoCreate-dqlite.git"
        },
        dynamodb: {
            import: "@cocreate/dynamodb",
            path: "../CoCreate-storages/CoCreate-dynamodb",
            repo: "gitlab.com/cocreatejs/CoCreate-dynamodb.git"
        },
        ferretdb: {
            import: "@cocreate/ferretdb",
            path: "../CoCreate-storages/CoCreate-ferretdb",
            repo: "gitlab.com/cocreatejs/CoCreate-ferretdb.git"
        },
        firestore: {
            import: "@cocreate/firestore",
            path: "../CoCreate-storages/CoCreate-firestore",
            repo: "gitlab.com/cocreatejs/CoCreate-firestore.git"
        },
        mariadb: {
            import: "@cocreate/mariadb",
            path: "../CoCreate-storages/CoCreate-mariadb",
            repo: "gitlab.com/cocreatejs/CoCreate-mariadb.git"
        },
        mongodb: {
            import: "@cocreate/mongodb",
            path: "../CoCreate-storages/CoCreate-mongodb",
            repo: "gitlab.com/cocreatejs/CoCreate-mongodb.git"
        },
        mysql: {
            import: "@cocreate/mysql",
            path: "../CoCreate-storages/CoCreate-mysql",
            repo: "gitlab.com/cocreatejs/CoCreate-mysql.git"
        },
        oracledb: {
            import: "@cocreate/oracledb",
            path: "../CoCreate-storages/CoCreate-oracledb",
            repo: "gitlab.com/cocreatejs/CoCreate-oracledb.git"
        },
        planetscale: {
            import: "@cocreate/planetscale",
            path: "../CoCreate-storages/CoCreate-planetscale",
            repo: "gitlab.com/cocreatejs/CoCreate-planetscale.git"
        },
        postgresql: {
            import: "@cocreate/postgresql",
            path: "../CoCreate-storages/CoCreate-postgresql",
            repo: "gitlab.com/cocreatejs/CoCreate-postgresql.git"
        },
        rqlite: {
            import: "@cocreate/rqlite",
            path: "../CoCreate-storages/CoCreate-rqlite",
            repo: "gitlab.com/cocreatejs/CoCreate-rqlite.git"
        },
        qdrant: {
            import: "@cocreate/qdrant",
            path: "../CoCreate-storages/CoCreate-qdrant",
            repo: "gitlab.com/cocreatejs/CoCreate-qdrant.git"
        },
        sqlite: {
            import: "@cocreate/sqlite",
            path: "../CoCreate-storages/CoCreate-sqlite",
            repo: "gitlab.com/cocreatejs/CoCreate-sqlite.git"
        },
        tidb: {
            import: "@cocreate/tidb",
            path: "../CoCreate-storages/CoCreate-tidb",
            repo: "gitlab.com/cocreatejs/CoCreate-tidb.git"
        },
        timescaledb: {
            import: "@cocreate/timescaledb",
            path: "../CoCreate-storages/CoCreate-timescaledb",
            repo: "gitlab.com/cocreatejs/CoCreate-timescaledb.git"
        },
        turso: {
            import: "@cocreate/turso",
            path: "../CoCreate-storages/CoCreate-turso",
            repo: "gitlab.com/cocreatejs/CoCreate-turso.git"
        },
        yugabytedb: {
            import: "@cocreate/yugabytedb",
            path: "../CoCreate-storages/CoCreate-yugabytedb",
            repo: "gitlab.com/cocreatejs/CoCreate-yugabytedb.git"
        },

        // --- Standard Client/Server Modules ---
        config: {
            import: "@cocreate/config",
            path: "../CoCreate-modules/CoCreate-config",
            repo: "gitlab.com/cocreatejs/CoCreate-config.git"
        },
        api: {
            import: "@cocreate/api",
            path: "../CoCreate-modules/CoCreate-api",
            repo: "gitlab.com/cocreatejs/CoCreate-api.git"
        },
        "lazy-loader": {
            import: "@cocreate/lazy-loader",
            path: "../CoCreate-modules/CoCreate-lazy-loader",
            repo: "gitlab.com/cocreatejs/CoCreate-lazy-loader.git"
        },
        notification: {
            import: "@cocreate/notification",
            path: "../CoCreate-modules/CoCreate-notification",
            repo: "gitlab.com/cocreatejs/CoCreate-notification.git"
        },
        organizations: {
            import: "@cocreate/organizations",
            path: "../CoCreate-modules/CoCreate-organizations",
            repo: "gitlab.com/cocreatejs/CoCreate-organizations.git"
        },
        users: {
            import: "@cocreate/users",
            path: "../CoCreate-modules/CoCreate-users",
            repo: "gitlab.com/cocreatejs/CoCreate-users.git"
        },
        workflows: {
            import: "@cocreate/workflows",
            path: "../CoCreate-modules/CoCreate-workflows",
            repo: "github.com/CoCreateJS/CoCreate-workflows.git"
        },
        utils: {
            import: "@cocreate/utils",
            path: "../CoCreate-modules/CoCreate-utils",
            repo: "gitlab.com/cocreatejs/CoCreate-utils.git"
        },

        // --- Dev Modules ---
        cli: {
            import: "@cocreate/cli",
            path: "../CoCreate-modules/CoCreate-cli",
            repo: "gitlab.com/cocreatejs/CoCreate-cli.git"
        }
    },
    plugins: {
        ai: {
            import: "@cocreate/ai",
            path: "../CoCreate-plugins/CoCreate-server-ai",
            repo: "gitlab.com/cocreatejs/CoCreate-AI.git"
        }
    },
    projects: {
        CoCreateWS: {
            path: "../CoCreateWS",
            repo: "gitlab.com/cocreatejs/CoCreateWS.git",
            exclude: ["git"]
        }
    }
};
