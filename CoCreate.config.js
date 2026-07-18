export default {
	organization_id: "",
	key: "",
	host: "",
    workers: true, // Number of worker processes
    certificate: {
        provider: "acme" // Options: "acme", "self-signed", "none"
    },
    ingress: {
        provider: "nginx" // Options: "nginx", "haproxy", "none"
    },
    mesh: {
        provider: "server-mesh" // Options: "server-mesh", "none"
    },
    storage: {
        mongodb: {
            provider: "mongodb",
            url: ""
        }
    },
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
    
    /**
     * @namespace modules
     * @description Merged configuration containing both core components (modules/plugins/databases) and external API libraries.
     * For development environments, the Poly Repo CLI reads the 'path' and 'repo' keys from these objects.
     */
    modules: {
        // --- Core Server & Deployment Modules ---
        CoCreateWS: {
            path: "../CoCreateWS",
            repo: "github.com/CoCreate-app/CoCreateWS.git",
            exclude: ["git"]
        },
        server: {
            import: "@cocreate/server",
            path: "../CoCreate-modules/CoCreate-server",
            repo: "github.com/CoCreate-app/CoCreate-server.git"
        },
        "server-mesh": {
            import: "@cocreate/server-mesh",
            path: "../CoCreate-modules/CoCreate-server-mesh",
            repo: "github.com/CoCreate-app/CoCreate-server-mesh.git"
        },
        "server-autoscaler": {
            import: "@cocreate/server-autoscaler",
            path: "../CoCreate-modules/CoCreate-server-autoscaler",
            repo: "github.com/CoCreate-app/CoCreate-server-autoscaler.git"
        },
        "server-telemetry": {
            import: "@cocreate/server-telemetry",
            path: "../CoCreate-modules/CoCreate-server-telemetry",
            repo: "github.com/CoCreate-app/CoCreate-server-telemetry.git"
        },
        "crud-server": {
            import: "@cocreate/crud-server",
            path: "../CoCreate-modules/CoCreate-crud-server",
            repo: "github.com/CoCreate-app/CoCreate-crud-server.git"
        },
        acme: {
            import: "@cocreate/acme",
            path: "../CoCreate-plugins/CoCreate-acme",
            repo: "github.com/CoCreate-app/CoCreate-acme.git"
        },
        authenticate: {
            import: "@cocreate/authenticate",
            path: "../CoCreate-modules/CoCreate-authenticate",
            repo: "github.com/CoCreate-app/CoCreate-authenticate.git"
        },
        authorize: {
            import: "@cocreate/authorize",
            path: "../CoCreate-modules/CoCreate-authorize",
            repo: "github.com/CoCreate-app/CoCreate-authorize.git"
        },
        "file-server": {
            import: "@cocreate/file-server",
            path: "../CoCreate-modules/CoCreate-file-server",
            repo: "github.com/CoCreate-app/CoCreate-file-server.git",
            unload: false // true, false, number in milliseconds to wait before unloading
        },
        "server-side-render": {
            import: "@cocreate/server-side-render",
            path: "../CoCreate-modules/CoCreate-server-side-render",
            repo: "github.com/CoCreate-app/CoCreate-server-side-render.git"
        },
        sitemap: {
            import: "@cocreate/sitemap",
            path: "../CoCreate-modules/CoCreate-sitemap",
            repo: "github.com/CoCreate-app/CoCreate-sitemap.git"
        },
        "cron-jobs": {
            import: "@cocreate/cron-jobs",
            path: "../CoCreate-modules/CoCreate-cron-jobs",
            repo: "github.com/CoCreate-app/CoCreate-cron-jobs.git"
        },
        usage: {
            import: "@cocreate/usage",
            path: "../CoCreate-modules/CoCreate-usage",
            repo: "github.com/CoCreate-app/CoCreate-usage.git"
        },

        // --- Database & Storage Modules ---
        "amazon-redshift": {
            import: "@cocreate/amazon-redshift",
            path: "../CoCreate-databases/CoCreate-amazon-redshift",
            repo: "github.com/CoCreate-app/CoCreate-amazon-redshift.git"
        },
        auroradb: {
            import: "@cocreate/auroradb",
            path: "../CoCreate-databases/CoCreate-auroradb",
            repo: "github.com/CoCreate-app/CoCreate-auroradb.git"
        },
        cockroachdb: {
            import: "@cocreate/cockroachdb",
            path: "../CoCreate-databases/CoCreate-cockroachdb",
            repo: "github.com/CoCreate-app/CoCreate-cockroachdb.git"
        },
        cosmosdb: {
            import: "@cocreate/cosmosdb",
            path: "../CoCreate-databases/CoCreate-cosmosdb",
            repo: "github.com/CoCreate-app/CoCreate-cosmosdb.git"
        },
        documentdb: {
            import: "@cocreate/documentdb",
            path: "../CoCreate-databases/CoCreate-documentdb",
            repo: "github.com/CoCreate-app/CoCreate-documentdb.git"
        },
        dqlite: {
            import: "@cocreate/dqlite",
            path: "../CoCreate-databases/CoCreate-dqlite",
            repo: "github.com/CoCreate-app/CoCreate-dqlite.git"
        },
        dynamodb: {
            import: "@cocreate/dynamodb",
            path: "../CoCreate-databases/CoCreate-dynamodb",
            repo: "github.com/CoCreate-app/CoCreate-dynamodb.git"
        },
        ferretdb: {
            import: "@cocreate/ferretdb",
            path: "../CoCreate-databases/CoCreate-ferretdb",
            repo: "github.com/CoCreate-app/CoCreate-ferretdb.git"
        },
        firestore: {
            import: "@cocreate/firestore",
            path: "../CoCreate-databases/CoCreate-firestore",
            repo: "github.com/CoCreate-app/CoCreate-firestore.git"
        },
        mariadb: {
            import: "@cocreate/mariadb",
            path: "../CoCreate-databases/CoCreate-mariadb",
            repo: "github.com/CoCreate-app/CoCreate-mariadb.git"
        },
        mongodb: {
            import: "@cocreate/mongodb",
            path: "../CoCreate-databases/CoCreate-mongodb",
            repo: "github.com/CoCreate-app/CoCreate-mongodb.git"
        },
        mysql: {
            import: "@cocreate/mysql",
            path: "../CoCreate-databases/CoCreate-mysql",
            repo: "github.com/CoCreate-app/CoCreate-mysql.git"
        },
        oracledb: {
            import: "@cocreate/oracledb",
            path: "../CoCreate-databases/CoCreate-oracledb",
            repo: "github.com/CoCreate-app/CoCreate-oracledb.git"
        },
        planetscale: {
            import: "@cocreate/planetscale",
            path: "../CoCreate-databases/CoCreate-planetscale",
            repo: "github.com/CoCreate-app/CoCreate-planetscale.git"
        },
        postgresql: {
            import: "@cocreate/postgresql",
            path: "../CoCreate-databases/CoCreate-postgresql",
            repo: "github.com/CoCreate-app/CoCreate-postgresql.git"
        },
        rqlite: {
            import: "@cocreate/rqlite",
            path: "../CoCreate-databases/CoCreate-rqlite",
            repo: "github.com/CoCreate-app/CoCreate-rqlite.git"
        },
        sqlite: {
            import: "@cocreate/sqlite",
            path: "../CoCreate-databases/CoCreate-sqlite",
            repo: "github.com/CoCreate-app/CoCreate-sqlite.git"
        },
        tidb: {
            import: "@cocreate/tidb",
            path: "../CoCreate-databases/CoCreate-tidb",
            repo: "github.com/CoCreate-app/CoCreate-tidb.git"
        },
        timescaledb: {
            import: "@cocreate/timescaledb",
            path: "../CoCreate-databases/CoCreate-timescaledb",
            repo: "github.com/CoCreate-app/CoCreate-timescaledb.git"
        },
        turso: {
            import: "@cocreate/turso",
            path: "../CoCreate-databases/CoCreate-turso",
            repo: "github.com/CoCreate-app/CoCreate-turso.git"
        },
        yugabytedb: {
            import: "@cocreate/yugabytedb",
            path: "../CoCreate-databases/CoCreate-yugabytedb",
            repo: "github.com/CoCreate-app/CoCreate-yugabytedb.git"
        },

        // --- Standard Client/Server Modules ---
        config: {
            import: "@cocreate/config",
            path: "../CoCreate-modules/CoCreate-config",
            repo: "github.com/CoCreate-app/CoCreate-config.git"
        },
        api: {
            import: "@cocreate/api",
            path: "../CoCreate-modules/CoCreate-api",
            repo: "github.com/CoCreate-app/CoCreate-api.git"
        },
        "lazy-loader": {
            import: "@cocreate/lazy-loader",
            path: "../CoCreate-modules/CoCreate-lazy-loader",
            repo: "github.com/CoCreate-app/CoCreate-lazy-loader.git"
        },
        notification: {
            import: "@cocreate/notification",
            path: "../CoCreate-modules/CoCreate-notification",
            repo: "github.com/CoCreate-app/CoCreate-notification.git"
        },
        organizations: {
            import: "@cocreate/organizations",
            path: "../CoCreate-modules/CoCreate-organizations",
            repo: "github.com/CoCreate-app/CoCreate-organizations.git"
        },
        users: {
            import: "@cocreate/users",
            path: "../CoCreate-modules/CoCreate-users",
            repo: "github.com/CoCreate-app/CoCreate-users.git"
        },
        unique: {
            import: "@cocreate/unique",
            path: "../CoCreate-modules/CoCreate-unique",
            repo: "github.com/CoCreate-app/CoCreate-unique.git"
        },
        "url-uploader": {
            import: "@cocreate/url-uploader",
            path: "../CoCreate-modules/CoCreate-url-uploader",
            repo: "github.com/CoCreate-app/CoCreate-url-uploader.git"
        },
        utils: {
            import: "@cocreate/utils",
            path: "../CoCreate-modules/CoCreate-utils",
            repo: "github.com/CoCreate-app/CoCreate-utils.git"
        },
        uuid: {
            import: "@cocreate/uuid",
            path: "../CoCreate-modules/CoCreate-uuid",
            repo: "github.com/CoCreate-app/CoCreate-uuid.git"
        },

        // --- Dev Modules ---
        cli: {
            import: "@cocreate/cli",
            path: "../CoCreate-modules/CoCreate-cli",
            repo: "github.com/CoCreate-app/CoCreate-cli.git"
        },
        loadtest: {
            import: "@cocreate/loadtest",
            path: "../CoCreate-modules/CoCreate-loadtest",
            repo: "github.com/CoCreate-app/CoCreate-loadtest.git"
        }

    }};
