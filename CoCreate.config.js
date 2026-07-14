export default {
	organization_id: "",
	key: "",
	host: "",
    workers: 1, // Number of worker processes
    certificate: {
        provider: "acme" // Options: "acme", "self-signed", "none"
    },
    ingress: {
        provider: "nginx" // Options: "nginx", "haproxy", "none"
    },
    mesh: {
      provider: "socket-mesh" // Options: "socket-mesh", "none"
    },
    storage: {
        mongodb: {
            provider: "mongodb",
            url: ""
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
     * @description Merged configuration containing both core components (modules/plugins) and external API libraries.
     * For development environments, the Poly Repo CLI reads the 'path' and 'repo' keys from these objects.
     */
    modules: {
        // --- Core Server & Deployment Modules ---
        CoCreateWS: {
            path: "../CoCreateWS",
            repo: "github.com/CoCreate-app/CoCreateWS.git",
            exclude: ["git"]
        },
        nginx: {
            import: "@cocreate/nginx",
            path: "../CoCreate-plugins/CoCreate-nginx",
            repo: "github.com/CoCreate-app/CoCreate-nginx.git"
        },
        "node-autoscaler": {
            import: "@cocreate/node-autoscaler",
            path: "../CoCreate-modules/CoCreate-node-autoscaler",
            repo: "github.com/CoCreate-app/CoCreate-node-autoscaler.git"
        },
        "cron-jobs": {
            import: "@cocreate/cron-jobs",
            path: "../CoCreate-modules/CoCreate-cron-jobs",
            repo: "github.com/CoCreate-app/CoCreate-cron-jobs.git"
        },

        // --- Database & Storage Modules ---
        mongodb: {
            import: "@cocreate/mongodb",
            path: "../CoCreate-plugins/CoCreate-mongodb",
            repo: "github.com/CoCreate-app/CoCreate-mongodb.git"
        },
        "file-server": {
            import: "@cocreate/file-server",
            path: "../CoCreate-modules/CoCreate-file-server",
            repo: "github.com/CoCreate-app/CoCreate-file-server.git",
            unload: false // true, false, number in milliseconds to wait before unloading
        },

        // --- Server-Side Engines & APIs ---
        "crud-server": {
            import: "@cocreate/crud-server",
            path: "../CoCreate-modules/CoCreate-crud-server",
            repo: "github.com/CoCreate-app/CoCreate-crud-server.git"
        },
        "socket-server": {
            import: "@cocreate/socket-server",
            path: "../CoCreate-modules/CoCreate-socket-server",
            repo: "github.com/CoCreate-app/CoCreate-socket-server.git"
        },
        "socket-mesh": {
            import: "@cocreate/socket-mesh",
            path: "../CoCreate-modules/CoCreate-socket-mesh",
            repo: "github.com/CoCreate-app/CoCreate-socket-mesh.git"
        },
        "server-side-render": {
            import: "@cocreate/server-side-render",
            path: "../CoCreate-modules/CoCreate-server-side-render",
            repo: "github.com/CoCreate-app/CoCreate-server-side-render.git"
        },
        server: {
            import: "@cocreate/server",
            path: "../CoCreate-modules/CoCreate-server",
            repo: "github.com/CoCreate-app/CoCreate-server.git"
        },

        // --- Standard Client/Server Modules ---
        acme: {
            import: "@cocreate/acme",
            path: "../CoCreate-plugins/CoCreate-acme",
            repo: "github.com/CoCreate-app/CoCreate-acme.git"
        },
        actions: {
            import: "@cocreate/actions",
            path: "../CoCreate-modules/CoCreate-actions",
            repo: "github.com/CoCreate-app/CoCreate-actions.git"
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
        cli: {
            import: "@cocreate/cli",
            path: "../CoCreate-modules/CoCreate-cli",
            repo: "github.com/CoCreate-app/CoCreate-cli.git"
        },
        config: {
            import: "@cocreate/config",
            path: "../CoCreate-modules/CoCreate-config",
            repo: "github.com/CoCreate-app/CoCreate-config.git"
        },
        "crud-client": {
            import: "@cocreate/crud-client",
            path: "../CoCreate-modules/CoCreate-crud-client",
            repo: "github.com/CoCreate-app/CoCreate-crud-client.git"
        },
        docs: {
            import: "@cocreate/docs",
            path: "../CoCreate-modules/CoCreate-docs",
            repo: "github.com/CoCreate-app/CoCreate-docs.git"
        },
        elements: {
            import: "@cocreate/elements",
            path: "../CoCreate-modules/CoCreate-elements",
            repo: "github.com/CoCreate-app/CoCreate-elements.git"
        },
        "lazy-loader": {
            import: "@cocreate/lazy-loader",
            path: "../CoCreate-modules/CoCreate-lazy-loader",
            repo: "github.com/CoCreate-app/CoCreate-lazy-loader.git"
        },
        loadtest: {
            import: "@cocreate/loadtest",
            path: "../CoCreate-modules/CoCreate-loadtest",
            repo: "github.com/CoCreate-app/CoCreate-loadtest.git"
        },
        metrics: {
            import: "@cocreate/metrics",
            path: "../CoCreate-modules/CoCreate-metrics",
            repo: "github.com/CoCreate-app/CoCreate-metrics.git"
        },
        notification: {
            import: "@cocreate/notification",
            path: "../CoCreate-modules/CoCreate-notification",
            repo: "github.com/CoCreate-app/CoCreate-notification.git"
        },
        observer: {
            import: "@cocreate/observer",
            path: "../CoCreate-modules/CoCreate-observer",
            repo: "github.com/CoCreate-app/CoCreate-observer.git"
        },
        organizations: {
            import: "@cocreate/organizations",
            path: "../CoCreate-modules/CoCreate-organizations",
            repo: "github.com/CoCreate-app/CoCreate-organizations.git"
        },
        render: {
            import: "@cocreate/render",
            path: "../CoCreate-modules/CoCreate-render",
            repo: "github.com/CoCreate-app/CoCreate-render.git"
        },
        sitemap: {
            import: "@cocreate/sitemap",
            path: "../CoCreate-modules/CoCreate-sitemap",
            repo: "github.com/CoCreate-app/CoCreate-sitemap.git"
        },
        "socket-client": {
            import: "@cocreate/socket-client",
            path: "../CoCreate-modules/CoCreate-socket-client",
            repo: "github.com/CoCreate-app/CoCreate-socket-client.git"
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
        users: {
            import: "@cocreate/users",
            path: "../CoCreate-modules/CoCreate-users",
            repo: "github.com/CoCreate-app/CoCreate-users.git"
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
        usage: {
            import: "@cocreate/usage",
            path: "../CoCreate-modules/CoCreate-usage",
            repo: "github.com/CoCreate-app/CoCreate-usage.git"
        },

        // --- Custom Business Logic & Third-Party Integrations ---
        industry: {
            import: "@cocreate/industry",
            event: "industry",
            array: "files",
            object: {
                pathname: "/dist/industry-chunk.js"
            },
            unload: "10000",
            path: "../CoCreate-modules/CoCreate-industry",
            repo: "github.com/CoCreate-app/CoCreate-industry.git"
        },
        openai: {
            import: "openai",
            event: "openai",
            initialize: "OpenAI",
            unload: "10000",
            path: "../CoCreate-plugins/CoCreate-openai",
            repo: "github.com/CoCreate-app/CoCreate-openai.git"
        },
        stripe: {
            import: "stripe",
            event: "stripe",
            initialize: "",
            unload: "10000",
            path: "../CoCreate-plugins/CoCreate-stripe",
            repo: "github.com/CoCreate-app/CoCreate-stripe.git"
        },
        postmark: {
            import: "postmark",
            event: "postmark",
            initialize: "ServerClient",
            unload: "10000"
            // No repository listed in original config; keeping custom third-party behavior
        }

        // googleapis: {
        //     import: "googleapis",
        //     event: "googleapis",
        //     initialize: "auth.OAuth2",
        //     unload: "10000"
        // }
    }};
