import * as __WEBPACK_EXTERNAL_MODULE_node_async_hooks_1fa35564__ from "node:async_hooks";
import * as __WEBPACK_EXTERNAL_MODULE_node_child_process_7aa195c7__ from "node:child_process";
import * as __WEBPACK_EXTERNAL_MODULE_node_crypto_803ecaf5__ from "node:crypto";
import * as __WEBPACK_EXTERNAL_MODULE_node_fs_75ed2103__ from "node:fs";
import * as __WEBPACK_EXTERNAL_MODULE_node_fs_promises_4a3ebc43__ from "node:fs/promises";
import * as __WEBPACK_EXTERNAL_MODULE_node_net_4372f4b2__ from "node:net";
import * as __WEBPACK_EXTERNAL_MODULE_node_os_e12349cb__ from "node:os";
import * as __WEBPACK_EXTERNAL_MODULE_node_path_02319fef__ from "node:path";
import * as __WEBPACK_EXTERNAL_MODULE_node_readline_153c82ca__ from "node:readline";
import * as __WEBPACK_EXTERNAL_MODULE_node_stream_62980834__ from "node:stream";
import * as __WEBPACK_EXTERNAL_MODULE_node_url_da953c0c__ from "node:url";
import * as __WEBPACK_EXTERNAL_MODULE_node_util_1f093676__ from "node:util";
import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "node:module";
const __WEBPACK_EXTERNAL_createRequire_require = __WEBPACK_EXTERNAL_createRequire(import.meta.url);
/******/ var __webpack_modules__ = ({

/***/ 5183
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   zP: () => (/* binding */ CanvasError)
/* harmony export */ });
/* unused harmony exports Canvas, createCanvas */
class CanvasError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "CanvasError";
  }
  code;
  /** Default error when an action is declared but no `handler` is wired. */
  static noHandler() {
    return new CanvasError(
      "canvas_action_no_handler",
      "No handler implemented for this canvas action"
    );
  }
}
class Canvas {
  declaration;
  open;
  onClose;
  /** @internal */
  actionHandlers;
  /** @internal */
  constructor(options) {
    const actionHandlers = /* @__PURE__ */ new Map();
    const wireActions = options.actions?.map(
      ({ handler, ...wire }) => {
        actionHandlers.set(wire.name, handler);
        return wire;
      }
    );
    this.declaration = {
      id: options.id,
      displayName: options.displayName,
      description: options.description,
      inputSchema: options.inputSchema,
      actions: wireActions
    };
    this.open = options.open;
    this.onClose = options.onClose;
    this.actionHandlers = actionHandlers;
  }
}
function createCanvas(options) {
  return new Canvas(options);
}



/***/ },

/***/ 4600
(module, __webpack_exports__, __webpack_require__) {

var __webpack_import_meta__ = Object.assign(Object.create(import.meta), import.meta, {url: "file:///home/ubuntu/Dev/CoCreate-plugins/server-ai/node_modules/@github/copilot-sdk/dist/client.js", webpack: 5, main: __webpack_require__.c[__webpack_require__.s] === module, env: {"NODE_ENV":"production","MODE":"production","DEV":false,"PROD":true,"SSR":true,"BASE_URL":"/"}});
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   u: () => (/* binding */ CopilotClient)
/* harmony export */ });
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6564);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2561);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9627);
/* harmony import */ var node_net__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8299);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5663);
/* harmony import */ var node_url__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9061);
/* harmony import */ var vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2067);
/* harmony import */ var vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _generated_rpc_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1254);
/* harmony import */ var _sdkProtocolVersion_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(5231);
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(3807);
/* harmony import */ var _sessionFsProvider_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(653);
/* harmony import */ var _copilotRequestHandler_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(8256);
/* harmony import */ var _telemetry_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(1880);
/* harmony import */ var _toolSet_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(7225);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(1142);
















const MIN_PROTOCOL_VERSION = 3;
const RUNTIME_SHUTDOWN_TIMEOUT_MS = 1e4;
function isZodSchema(value) {
  return value != null && typeof value === "object" && "toJSONSchema" in value && typeof value.toJSONSchema === "function";
}
async function withTimeout(promise, timeoutMs, message) {
  let timeout;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error(message)), timeoutMs);
      })
    ]);
  } finally {
    if (timeout !== void 0) {
      clearTimeout(timeout);
    }
  }
}
async function waitForChildExit(child, timeoutMs) {
  if (child.exitCode != null || child.signalCode != null) {
    return true;
  }
  return new Promise((resolve) => {
    let timeout;
    let settled = false;
    const onExit = () => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timeout);
      resolve(true);
    };
    timeout = setTimeout(() => {
      if (settled) {
        return;
      }
      settled = true;
      child.off("exit", onExit);
      resolve(false);
    }, timeoutMs);
    child.once("exit", onExit);
    if (child.exitCode != null || child.signalCode != null) {
      onExit();
    }
  });
}
function toJsonSchema(parameters) {
  if (!parameters) return void 0;
  if (isZodSchema(parameters)) {
    return parameters.toJSONSchema();
  }
  return parameters;
}
const DEFAULT_PROVIDER_NAME = "default";
function extractBearerTokenProviders(provider, providers) {
  const callbacks = /* @__PURE__ */ new Map();
  let wireProvider = provider;
  if (provider?.bearerTokenProvider) {
    const { bearerTokenProvider, ...rest } = provider;
    callbacks.set(DEFAULT_PROVIDER_NAME, bearerTokenProvider);
    wireProvider = {
      ...rest,
      hasBearerTokenProvider: true
    };
  }
  let wireProviders = providers;
  if (providers?.some((p) => p.bearerTokenProvider)) {
    wireProviders = providers.map((p) => {
      if (!p.bearerTokenProvider) return p;
      const { bearerTokenProvider, ...rest } = p;
      callbacks.set(p.name, bearerTokenProvider);
      return {
        ...rest,
        hasBearerTokenProvider: true
      };
    });
  }
  return { wireProvider, wireProviders, callbacks };
}
function toWireMcpServers(mcpServers) {
  if (!mcpServers) return void 0;
  return Object.fromEntries(
    Object.entries(mcpServers).map(([name, server]) => {
      if ("workingDirectory" in server) {
        const { workingDirectory, ...rest } = server;
        return [name, { ...rest, cwd: workingDirectory }];
      }
      return [name, server];
    })
  );
}
function toWireCustomAgents(agents) {
  if (!agents) return void 0;
  return agents.map((agent) => {
    if (!agent.mcpServers) return agent;
    const { mcpServers, ...rest } = agent;
    return { ...rest, mcpServers: toWireMcpServers(mcpServers) };
  });
}
function toWireLargeOutput(config) {
  if (!config) return void 0;
  const { outputDirectory, ...rest } = config;
  const wire = { ...rest };
  if (outputDirectory !== void 0) {
    wire.outputDir = outputDirectory;
  }
  return wire;
}
function toolFilterListToArray(value) {
  if (value === void 0) {
    return void 0;
  }
  return value instanceof _toolSet_js__WEBPACK_IMPORTED_MODULE_13__/* .ToolSet */ .Z ? value.toArray() : value;
}
function validateToolFilterList(field, list) {
  if (!list) {
    return;
  }
  for (const entry of list) {
    if (entry === "*") {
      throw new Error(
        `Invalid ${field} entry '*': there is no bare wildcard. Use one or more of \`new ToolSet().addBuiltIn('*')\`, \`.addMcp('*')\`, or \`.addCustom('*')\` to target a specific source.`
      );
    }
  }
}
function extractTransformCallbacks(systemMessage) {
  if (!systemMessage || systemMessage.mode !== "customize" || !systemMessage.sections) {
    return { wirePayload: systemMessage, transformCallbacks: void 0 };
  }
  const transformCallbacks = /* @__PURE__ */ new Map();
  const wireSections = {};
  for (const [sectionId, override] of Object.entries(systemMessage.sections)) {
    if (!override) continue;
    if (typeof override.action === "function") {
      transformCallbacks.set(sectionId, override.action);
      wireSections[sectionId] = { action: "transform" };
    } else {
      wireSections[sectionId] = { action: override.action, content: override.content };
    }
  }
  if (transformCallbacks.size === 0) {
    return { wirePayload: systemMessage, transformCallbacks: void 0 };
  }
  const wirePayload = {
    ...systemMessage,
    sections: wireSections
  };
  return { wirePayload, transformCallbacks };
}
function getNodeExecPath() {
  if (process.versions.bun) {
    return "node";
  }
  return process.execPath;
}
function getCliPlatformPackageNames() {
  const arch = process.arch;
  const variants = process.platform === "linux" ? ["linux", "linuxmusl"] : [process.platform];
  return variants.map((variant) => `@github/copilot-${variant}-${arch}`);
}
function getBundledCliPath() {
  const packageNames = getCliPlatformPackageNames();
  if (typeof import.meta.resolve === "function") {
    for (const packageName of packageNames) {
      try {
        const sdkUrl = __webpack_import_meta__.resolve(`${packageName}/sdk`);
        const sdkPath = (0,node_url__WEBPACK_IMPORTED_MODULE_5__.fileURLToPath)(sdkUrl);
        return (0,node_path__WEBPACK_IMPORTED_MODULE_4__.join)((0,node_path__WEBPACK_IMPORTED_MODULE_4__.dirname)((0,node_path__WEBPACK_IMPORTED_MODULE_4__.dirname)(sdkPath)), "index.js");
      } catch {
      }
    }
    throw new Error(
      `Could not resolve a @github/copilot platform package (tried ${packageNames.join(", ")}). Ensure @github/copilot is installed, or pass cliPath/cliUrl to CopilotClient.`
    );
  }
  const req = /* createRequire() */ undefined;
  const searchPaths = req.resolve.paths("@github/copilot") ?? [];
  for (const base of searchPaths) {
    for (const packageName of packageNames) {
      const candidate = (0,node_path__WEBPACK_IMPORTED_MODULE_4__.join)(base, ...packageName.split("/"), "index.js");
      if ((0,node_fs__WEBPACK_IMPORTED_MODULE_2__.existsSync)(candidate)) {
        return candidate;
      }
    }
  }
  throw new Error(
    `Could not find a @github/copilot platform package (tried ${packageNames.join(", ")}). Searched ${searchPaths.length} paths. Ensure @github/copilot is installed, or pass cliPath/cliUrl to CopilotClient.`
  );
}
class TeardownResilientStreamMessageWriter extends vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.StreamMessageWriter {
  suppressWriteErrors = false;
  async write(msg) {
    try {
      await super.write(msg);
    } catch (error) {
      if (!this.suppressWriteErrors) {
        throw error;
      }
    }
  }
}
class CopilotClient {
  cliStartTimeout = null;
  cliProcess = null;
  ffiHost = null;
  connection = null;
  messageWriter = null;
  socket = null;
  runtimePort = null;
  actualHost = "localhost";
  state = "disconnected";
  sessions = /* @__PURE__ */ new Map();
  stderrBuffer = "";
  // Captures CLI stderr for error messages
  /** Resolved connection mode chosen in the constructor. */
  connectionConfig;
  /** Resolved path to the runtime executable (only used for child-process kinds). */
  resolvedCliPath;
  /** Resolved environment passed to the spawned runtime. */
  resolvedEnv;
  options;
  isExternalServer = false;
  forceStopping = false;
  /** Token sent in `connect`; auto-generated when the SDK spawns its own CLI in TCP mode. */
  effectiveConnectionToken;
  onListModels;
  onGetTraceContext;
  modelsCache = null;
  modelsCacheLock = Promise.resolve();
  sessionLifecycleHandlers = /* @__PURE__ */ new Set();
  typedLifecycleHandlers = /* @__PURE__ */ new Map();
  _rpc = null;
  _internalRpc = null;
  processExitPromise = null;
  // Rejects when CLI process exits
  negotiatedProtocolVersion = null;
  /** Connection-level session filesystem config, set via constructor option. */
  sessionFsConfig = null;
  requestHandler = null;
  builtinPluginDirectories = [];
  onGitHubTelemetry;
  clientGlobalHandlers = {};
  /**
   * Typed server-scoped RPC methods.
   * @throws Error if the client is not connected
   */
  get rpc() {
    if (!this.connection) {
      throw new Error("Client is not connected. Call start() first.");
    }
    if (!this._rpc) {
      this._rpc = (0,_generated_rpc_js__WEBPACK_IMPORTED_MODULE_7__/* .createServerRpc */ .dO)(this.connection);
    }
    return this._rpc;
  }
  /**
   * Internal RPC surface (e.g. handshake helpers). Not part of the public API.
   * @internal
   */
  get internalRpc() {
    if (!this.connection) {
      throw new Error("Client is not connected. Call start() first.");
    }
    if (!this._internalRpc) {
      this._internalRpc = (0,_generated_rpc_js__WEBPACK_IMPORTED_MODULE_7__/* .createInternalServerRpc */ .yB)(this.connection);
    }
    return this._internalRpc;
  }
  logDebugTiming(message, startMs) {
    const level = this.options.logLevel?.toLowerCase();
    if (level === "debug" || level === "all") {
      process.stderr.write(`[copilot-sdk] ${message}. Elapsed=${Date.now() - startMs}ms
`);
    }
  }
  logDebug(message) {
    const level = this.options.logLevel?.toLowerCase();
    if (level === "debug" || level === "all") {
      process.stderr.write(`[copilot-sdk] ${message}
`);
    }
  }
  /**
   * Environment variable that overrides the transport when the caller does not set
   * {@link CopilotClientOptions.connection}. Accepts `"inprocess"` or `"stdio"`
   * (case-insensitive); unset preserves the default stdio transport. Any other value
   * is an error.
   */
  static DEFAULT_CONNECTION_ENV_VAR = "COPILOT_SDK_DEFAULT_CONNECTION";
  /**
   * Resolves the default {@link RuntimeConnection} for the no-connection case,
   * honoring {@link CopilotClient.DEFAULT_CONNECTION_ENV_VAR}.
   */
  static resolveDefaultConnection() {
    const value = process.env[CopilotClient.DEFAULT_CONNECTION_ENV_VAR];
    if (!value || value.toLowerCase() === "stdio") {
      return { kind: "stdio" };
    }
    if (value.toLowerCase() === "inprocess") {
      return { kind: "inprocess" };
    }
    throw new Error(
      `Invalid ${CopilotClient.DEFAULT_CONNECTION_ENV_VAR} value '${value}'. Expected 'inprocess', 'stdio', or unset.`
    );
  }
  /**
   * Creates a new CopilotClient instance.
   *
   * @param options - Configuration options for the client
   *
   * @example
   * ```typescript
   * // Default: spawns the bundled runtime over stdio
   * const client = new CopilotClient();
   *
   * // Connect to an existing runtime
   * const client = new CopilotClient({
   *   connection: RuntimeConnection.forUri("localhost:3000"),
   * });
   *
   * // Spawn the runtime over TCP on a chosen port
   * const client = new CopilotClient({
   *   connection: RuntimeConnection.forTcp({ port: 9001 }),
   * });
   *
   * // Use a custom runtime binary
   * const client = new CopilotClient({
   *   connection: RuntimeConnection.forStdio({ path: "/usr/local/bin/copilot" }),
   *   logLevel: "debug",
   * });
   * ```
   */
  constructor(options = {}) {
    const conn = options._internalConnection ?? options.connection ?? CopilotClient.resolveDefaultConnection();
    if (conn.kind === "uri" && (options.gitHubToken !== void 0 || options.useLoggedInUser !== void 0)) {
      throw new Error(
        "gitHubToken and useLoggedInUser cannot be used with RuntimeConnection.forUri (external server manages its own auth)"
      );
    }
    if (conn.kind === "inprocess" && options.workingDirectory !== void 0) {
      throw new Error(
        "workingDirectory is not supported with RuntimeConnection.forInProcess(): the in-process transport hosts the runtime in this process, so honoring it would require mutating the shared process-global cwd. Change the host process's working directory before constructing the client instead."
      );
    }
    if (conn.kind === "inprocess" && options.env !== void 0) {
      throw new Error(
        "env is not supported with RuntimeConnection.forInProcess(): the in-process transport loads the native runtime into the shared host process, whose single environment block cannot carry per-client values. Set the variables on the host process environment instead."
      );
    }
    if (conn.kind === "inprocess" && options.telemetry !== void 0) {
      throw new Error(
        "telemetry is not supported with RuntimeConnection.forInProcess(): telemetry configuration is lowered to environment variables read by native runtime code running in the shared host process, so per-client telemetry cannot be honored in-process. Configure telemetry via the host process environment, or use a child-process transport."
      );
    }
    if ((conn.kind === "stdio" || conn.kind === "tcp") && conn.env !== void 0 && options.env !== void 0) {
      throw new Error(
        "Set environment variables via either the client-level env option or the connection's env (RuntimeConnection.forStdio/forTcp), not both. Prefer the connection-level env for child-process transports."
      );
    }
    if (conn.kind === "tcp" && conn.connectionToken !== void 0) {
      if (typeof conn.connectionToken !== "string" || conn.connectionToken.length === 0) {
        throw new Error("connectionToken must be a non-empty string");
      }
    }
    this.connectionConfig = conn;
    if (options.sessionFs) {
      this.validateSessionFsConfig(options.sessionFs);
    }
    if (options.builtinPluginDirectories) {
      for (const path of options.builtinPluginDirectories) {
        if (!(0,node_path__WEBPACK_IMPORTED_MODULE_4__.isAbsolute)(path)) {
          throw new Error(
            `builtinPluginDirectories must contain only absolute paths: ${path}`
          );
        }
      }
      this.builtinPluginDirectories = [...options.builtinPluginDirectories];
    }
    if (conn.kind === "uri") {
      const { host, port } = this.parseCliUrl(conn.url);
      this.actualHost = host;
      this.runtimePort = port;
      this.isExternalServer = true;
    } else if (conn.kind === "parent-process") {
      this.isExternalServer = true;
    }
    if (conn.kind === "tcp") {
      this.effectiveConnectionToken = conn.connectionToken ?? (0,node_crypto__WEBPACK_IMPORTED_MODULE_1__.randomUUID)();
    } else if (conn.kind === "uri") {
      this.effectiveConnectionToken = conn.connectionToken;
    }
    this.onListModels = options.onListModels;
    this.onGetTraceContext = options.onGetTraceContext;
    this.sessionFsConfig = options.sessionFs ?? null;
    this.requestHandler = options.requestHandler ?? null;
    this.onGitHubTelemetry = options.onGitHubTelemetry;
    this.setupClientGlobalHandlers();
    const connEnv = conn.kind === "stdio" || conn.kind === "tcp" ? conn.env : void 0;
    const effectiveEnv = connEnv ?? options.env ?? process.env;
    this.resolvedEnv = effectiveEnv;
    this.resolvedCliPath = conn.kind === "stdio" || conn.kind === "tcp" ? conn.path ?? effectiveEnv.COPILOT_CLI_PATH ?? getBundledCliPath() : void 0;
    const connArgs = conn.kind === "stdio" || conn.kind === "tcp" ? conn.args ?? [] : [];
    this.connectionExtraArgs = [...connArgs];
    this.options = {
      workingDirectory: options.workingDirectory ?? process.cwd(),
      logLevel: options.logLevel,
      gitHubToken: options.gitHubToken,
      // Default useLoggedInUser to false when gitHubToken is provided, otherwise true.
      useLoggedInUser: options.useLoggedInUser ?? (options.gitHubToken ? false : true),
      telemetry: options.telemetry,
      baseDirectory: options.baseDirectory,
      sessionIdleTimeoutSeconds: options.sessionIdleTimeoutSeconds ?? 0,
      enableRemoteSessions: options.enableRemoteSessions ?? false,
      mode: options.mode ?? "copilot-cli"
    };
    if (this.options.mode === "empty") {
      const hasPersistence = this.options.baseDirectory !== void 0 || this.sessionFsConfig !== null || // External runtimes manage their own persistence layer; the SDK
      // can't enforce it from here.
      conn.kind === "uri" || conn.kind === "parent-process";
      if (!hasPersistence) {
        throw new Error(
          "CopilotClient was created with mode: 'empty' but neither 'baseDirectory' nor 'sessionFs' was set. Empty mode requires an explicit per-session persistence location; pick one."
        );
      }
    }
  }
  connectionExtraArgs = [];
  /**
   * Parse CLI URL into host and port
   * Supports formats: "host:port", "http://host:port", "https://host:port", or just "port"
   */
  parseCliUrl(url) {
    let cleanUrl = url.replace(/^https?:\/\//, "");
    if (/^\d+$/.test(cleanUrl)) {
      return { host: "localhost", port: parseInt(cleanUrl, 10) };
    }
    const parts = cleanUrl.split(":");
    if (parts.length !== 2) {
      throw new Error(
        `Invalid cliUrl format: ${url}. Expected "host:port", "http://host:port", or "port"`
      );
    }
    const host = parts[0] || "localhost";
    const port = parseInt(parts[1], 10);
    if (isNaN(port) || port <= 0 || port > 65535) {
      throw new Error(`Invalid port in cliUrl: ${url}`);
    }
    return { host, port };
  }
  validateSessionFsConfig(config) {
    if (!config.initialCwd) {
      throw new Error("sessionFs.initialCwd is required");
    }
    if (!config.sessionStatePath) {
      throw new Error("sessionFs.sessionStatePath is required");
    }
    if (config.conventions !== "windows" && config.conventions !== "posix") {
      throw new Error("sessionFs.conventions must be either 'windows' or 'posix'");
    }
  }
  setupSessionFs(session, config) {
    if (!this.sessionFsConfig) {
      return;
    }
    if (!config.createSessionFsProvider) {
      throw new Error(
        "createSessionFsProvider is required in session config when sessionFs is enabled in client options."
      );
    }
    const provider = config.createSessionFsProvider(session);
    if (this.sessionFsConfig.capabilities?.sqlite && !provider.sqlite) {
      throw new Error(
        "SessionFsConfig declares capabilities.sqlite but the provider does not implement sqlite."
      );
    }
    session.clientSessionApis.sessionFs = (0,_sessionFsProvider_js__WEBPACK_IMPORTED_MODULE_10__/* .createSessionFsAdapter */ .T)(provider);
  }
  setupClientGlobalHandlers() {
    const handlers = {};
    if (this.requestHandler) {
      handlers.llmInference = (0,_copilotRequestHandler_js__WEBPACK_IMPORTED_MODULE_11__/* .createCopilotRequestAdapter */ .HW)(this.requestHandler, () => {
        if (!this.connection) {
          return void 0;
        }
        this._rpc ??= (0,_generated_rpc_js__WEBPACK_IMPORTED_MODULE_7__/* .createServerRpc */ .dO)(this.connection);
        return this._rpc;
      });
    }
    if (this.onGitHubTelemetry) {
      const onGitHubTelemetry = this.onGitHubTelemetry;
      handlers.gitHubTelemetry = {
        event: async (notification) => {
          try {
            await onGitHubTelemetry(notification);
          } catch {
          }
        }
      };
    }
    this.clientGlobalHandlers = handlers;
  }
  /**
   * Starts the CLI server and establishes a connection.
   *
   * If connecting to an external server (via cliUrl), only establishes the connection.
   * Otherwise, spawns the CLI server process and then connects.
   *
   * This method is called automatically the first time you create or resume a session.
   *
   * @returns A promise that resolves when the connection is established
   * @throws Error if the server fails to start or the connection fails
   *
   * @example
   * ```typescript
   * const client = new CopilotClient();
   * await client.start();
   * // Now ready to create sessions
   * ```
   */
  async start() {
    if (this.state === "connected") {
      return;
    }
    this.state = "connecting";
    try {
      if (this.connectionConfig.kind === "inprocess") {
        await this.startInProcessFfi();
      } else if (!this.isExternalServer) {
        await this.startCLIServer();
      }
      await this.connectToServer();
      await this.verifyProtocolVersion();
      if (this.builtinPluginDirectories.length > 0) {
        try {
          await this.connection.sendRequest("plugins.builtin.set", {
            paths: this.builtinPluginDirectories
          });
        } catch (error) {
          await this.forceStop();
          throw error;
        }
      }
      if (this.sessionFsConfig) {
        await this.connection.sendRequest("sessionFs.setProvider", {
          initialCwd: this.sessionFsConfig.initialCwd,
          sessionStatePath: this.sessionFsConfig.sessionStatePath,
          conventions: this.sessionFsConfig.conventions,
          capabilities: this.sessionFsConfig.capabilities
        });
      }
      if (this.requestHandler) {
        await this.connection.sendRequest("llmInference.setProvider", {});
      }
      this.state = "connected";
    } catch (error) {
      this.state = "error";
      throw error;
    }
  }
  /**
   * Stops the CLI server and closes all active sessions.
   *
   * This method performs graceful cleanup:
   * 1. Closes all active sessions (releases in-memory resources)
   * 2. Requests runtime shutdown for SDK-owned CLI processes
   * 3. Closes the JSON-RPC connection
   * 4. Terminates the CLI server process (if spawned by this client)
   *
   * Note: session data on disk is preserved, so sessions can be resumed later.
   * To permanently remove session data before stopping, call
   * {@link deleteSession} for each session first.
   *
   * @returns A promise that resolves with an array of errors encountered during cleanup.
   *          An empty array indicates all cleanup succeeded.
   *
   * @example
   * ```typescript
   * const errors = await client.stop();
   * if (errors.length > 0) {
   *   console.error("Cleanup errors:", errors);
   * }
   * ```
   */
  async stop() {
    const errors = [];
    const activeSessions = [...this.sessions.values()];
    if (this.connectionConfig.kind === "inprocess") {
      await Promise.allSettled(activeSessions.map((session) => session.abort()));
    }
    for (const session of activeSessions) {
      const sessionId = session.sessionId;
      let lastError = null;
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          await session.disconnect();
          lastError = null;
          break;
        } catch (error) {
          lastError = error instanceof Error ? error : new Error(String(error));
          if (attempt < 3) {
            const delay = 100 * Math.pow(2, attempt - 1);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
      if (lastError) {
        errors.push(
          new Error(
            `Failed to disconnect session ${sessionId} after 3 attempts: ${lastError.message}`
          )
        );
      }
    }
    for (const session of activeSessions) {
      session._markDisconnected();
    }
    this.sessions.clear();
    if (this.connection && (this.cliProcess || this.ffiHost) && !this.isExternalServer) {
      const runtimeShutdownStart = Date.now();
      const shutdownPromise = this.rpc.runtime.shutdown();
      void shutdownPromise.catch(() => void 0);
      try {
        await withTimeout(
          shutdownPromise,
          RUNTIME_SHUTDOWN_TIMEOUT_MS,
          `runtime.shutdown timed out after ${RUNTIME_SHUTDOWN_TIMEOUT_MS}ms`
        );
        this.logDebugTiming(
          "CopilotClient.stop runtime shutdown complete",
          runtimeShutdownStart
        );
      } catch (error) {
        this.logDebugTiming(
          "CopilotClient.stop runtime shutdown failed",
          runtimeShutdownStart
        );
        errors.push(
          new Error(
            `Failed to gracefully shut down runtime: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
    }
    if (this.messageWriter) {
      this.messageWriter.suppressWriteErrors = true;
    }
    if (this.connection) {
      try {
        this.connection.dispose();
      } catch (error) {
        errors.push(
          new Error(
            `Failed to dispose connection: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
      this.connection = null;
      this.messageWriter = null;
      this._rpc = null;
      this._internalRpc = null;
    }
    this.modelsCache = null;
    if (this.socket) {
      const socket = this.socket;
      this.socket = null;
      try {
        if (!socket.destroyed) {
          await new Promise((resolve) => {
            socket.once("close", () => resolve());
            socket.end();
          });
        }
      } catch (error) {
        errors.push(
          new Error(
            `Failed to close socket: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
    }
    if (this.cliProcess && !this.isExternalServer) {
      const child = this.cliProcess;
      this.cliProcess = null;
      try {
        if (child.exitCode == null && child.signalCode == null) {
          child.kill();
          if (!await waitForChildExit(child, RUNTIME_SHUTDOWN_TIMEOUT_MS)) {
            errors.push(
              new Error(
                `Timed out waiting for CLI process to exit after kill: ${RUNTIME_SHUTDOWN_TIMEOUT_MS}ms`
              )
            );
          }
        }
      } catch (error) {
        errors.push(
          new Error(
            `Failed to kill CLI process: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
    }
    if (this.ffiHost) {
      const host = this.ffiHost;
      this.ffiHost = null;
      try {
        host.dispose();
      } catch (error) {
        errors.push(
          new Error(
            `Failed to dispose in-process runtime host: ${error instanceof Error ? error.message : String(error)}`
          )
        );
      }
    }
    if (this.cliStartTimeout) {
      clearTimeout(this.cliStartTimeout);
      this.cliStartTimeout = null;
    }
    this.state = "disconnected";
    this.runtimePort = null;
    this.stderrBuffer = "";
    this.processExitPromise = null;
    return errors;
  }
  /**
   * Alias for {@link stop} that lets `CopilotClient` participate in `await using`
   * blocks for automatic cleanup.
   *
   * @example
   * ```typescript
   * await using client = new CopilotClient();
   * const session = await client.createSession({ onPermissionRequest: approveAll });
   * await session.sendAndWait("Hello");
   * // client.stop() is called automatically when the block exits.
   * ```
   */
  async [Symbol.asyncDispose]() {
    await this.stop();
  }
  /**
   * Forcefully stops the CLI server without graceful cleanup.
   *
   * Use this when {@link stop} fails or takes too long. This method:
   * - Clears all sessions immediately without destroying them
   * - Force closes the connection
   * - Sends SIGKILL to the CLI process (if spawned by this client)
   *
   * @returns A promise that resolves when the force stop is complete
   *
   * @example
   * ```typescript
   * // If normal stop hangs, force stop
   * const stopPromise = client.stop();
   * const timeout = new Promise((_, reject) =>
   *   setTimeout(() => reject(new Error("Timeout")), 5000)
   * );
   *
   * try {
   *   await Promise.race([stopPromise, timeout]);
   * } catch {
   *   await client.forceStop();
   * }
   * ```
   */
  async forceStop() {
    this.forceStopping = true;
    for (const session of this.sessions.values()) {
      session._markDisconnected();
    }
    this.sessions.clear();
    if (this.messageWriter) {
      this.messageWriter.suppressWriteErrors = true;
    }
    if (this.connection) {
      try {
        this.connection.dispose();
      } catch {
      }
      this.connection = null;
      this.messageWriter = null;
      this._rpc = null;
      this._internalRpc = null;
    }
    this.modelsCache = null;
    if (this.socket) {
      try {
        this.socket.destroy();
      } catch {
      }
      this.socket = null;
    }
    if (this.cliProcess && !this.isExternalServer) {
      try {
        this.cliProcess.kill("SIGKILL");
      } catch {
      }
      this.cliProcess = null;
    }
    if (this.ffiHost) {
      try {
        this.ffiHost.dispose();
      } catch {
      }
      this.ffiHost = null;
    }
    if (this.cliStartTimeout) {
      clearTimeout(this.cliStartTimeout);
      this.cliStartTimeout = null;
    }
    this.state = "disconnected";
    this.runtimePort = null;
    this.stderrBuffer = "";
    this.processExitPromise = null;
  }
  /**
   * Creates a new conversation session with the Copilot CLI.
   *
   * Sessions maintain conversation state, handle events, and manage tool execution.
   * If the client is not connected, this method automatically starts the connection.
   *
   * @param config - Optional configuration for the session
   * @returns A promise that resolves with the created session
   * @throws Error if the client fails to start
   *
   * @example
   * ```typescript
   * // Basic session
   * const session = await client.createSession({ onPermissionRequest: approveAll });
   *
   * // Session with model and tools
   * const session = await client.createSession({
   *   onPermissionRequest: approveAll,
   *   model: "gpt-4",
   *   tools: [{
   *     name: "get_weather",
   *     description: "Get weather for a location",
   *     parameters: { type: "object", properties: { location: { type: "string" } } },
   *     handler: async (args) => ({ temperature: 72 })
   *   }]
   * });
   * ```
   */
  /**
   * Normalizes session-level tool filter options. Converts {@link ToolSet}
   * instances to plain string arrays, rejects misuse (bare `"*"`) and the
   * missing-availableTools case in `mode = "empty"`.
   *
   * The SDK always sends `toolFilterPrecedence: "excluded"` so callers can
   * compose include + exclude lists naturally (e.g. "everything matching X
   * except Y") regardless of mode. Allowlist-precedence is intentionally not
   * exposed — it's available on the runtime side as a CLI-only concession to
   * legacy behavior, but SDK consumers always get the composable semantics.
   *
   * @internal
   */
  resolveToolFilterOptions(config) {
    const availableTools = toolFilterListToArray(config.availableTools);
    const excludedTools = toolFilterListToArray(config.excludedTools);
    validateToolFilterList("availableTools", availableTools);
    validateToolFilterList("excludedTools", excludedTools);
    if (this.options.mode === "empty") {
      if (availableTools === void 0) {
        throw new Error(
          "CopilotClient is in mode: 'empty' but the session config did not specify 'availableTools'. Empty mode requires every session to explicitly opt into the tools it wants \u2014 e.g. `new ToolSet().addBuiltIn(BuiltInTools.Isolated)`."
        );
      }
    }
    return { availableTools, excludedTools, toolFilterPrecedence: "excluded" };
  }
  /** Mode-specific defaults spread under the caller's config (app values win). */
  configDefaultsForMode() {
    if (this.options.mode === "empty") {
      return {
        enableSessionTelemetry: false,
        mcpOAuthTokenStorage: "in-memory",
        skipEmbeddingRetrieval: true,
        embeddingCacheStorage: "in-memory",
        enableOnDemandInstructionDiscovery: false,
        enableFileHooks: false,
        enableHostGitOperations: false,
        enableSessionStore: false,
        enableSkills: false,
        memory: { enabled: false },
        customAgentsLocalOnly: true
      };
    }
    return {};
  }
  /** Mode-specific default for enableExperimentalMode. */
  experimentalModeForMode(supplied) {
    return this.options.mode === "empty" ? supplied ?? false : supplied;
  }
  /**
   * Returns the systemMessage config to use, adjusted for the current mode.
   * In empty mode we ensure the environment_context section is removed
   * unless the app has already taken control of it. `append` (and
   * unspecified) mode is promoted to `customize` so we can also strip
   * environment_context; the caller's `content` is preserved verbatim
   * because the runtime appends it as additional instructions in both
   * customize and append modes.
   */
  getSystemMessageConfigForMode(supplied) {
    if (this.options.mode !== "empty") return supplied;
    if (!supplied) {
      return {
        mode: "customize",
        sections: { environment_context: { action: "remove" } }
      };
    }
    switch (supplied.mode) {
      case "replace":
        return supplied;
      case "customize":
        if (supplied.sections?.environment_context) return supplied;
        return {
          ...supplied,
          sections: {
            ...supplied.sections,
            environment_context: { action: "remove" }
          }
        };
      case "append":
      case void 0:
        return {
          mode: "customize",
          content: supplied.content,
          sections: { environment_context: { action: "remove" } }
        };
    }
  }
  /**
   * Mode-specific options applied via session.options.update after create/resume.
   *
   * In empty mode, defaults the four overridable feature flags to safe values
   * (caller values from `config` win). `installedPlugins=[]` is unconditional
   * in empty mode — apps that need custom plugins should switch modes.
   */
  async updateSessionOptionsForMode(session, config) {
    const patch = {};
    if (this.options.mode === "empty") {
      patch.skipCustomInstructions = config.skipCustomInstructions ?? true;
      patch.customAgentsLocalOnly = config.customAgentsLocalOnly ?? true;
      patch.coauthorEnabled = config.coauthorEnabled ?? false;
      patch.manageScheduleEnabled = config.manageScheduleEnabled ?? false;
      patch.installedPlugins = [];
    } else {
      if (config.skipCustomInstructions !== void 0)
        patch.skipCustomInstructions = config.skipCustomInstructions;
      if (config.customAgentsLocalOnly !== void 0)
        patch.customAgentsLocalOnly = config.customAgentsLocalOnly;
      if (config.coauthorEnabled !== void 0)
        patch.coauthorEnabled = config.coauthorEnabled;
      if (config.manageScheduleEnabled !== void 0)
        patch.manageScheduleEnabled = config.manageScheduleEnabled;
    }
    if (Object.keys(patch).length === 0) {
      return;
    }
    try {
      await session.rpc.options.update(patch);
    } catch (e) {
      try {
        await session.disconnect();
      } catch {
      }
      throw e;
    }
  }
  async createSession(config) {
    if (!this.connection) {
      await this.start();
    }
    const modeDefaults = this.configDefaultsForMode();
    config = { ...modeDefaults, ...config };
    config.customAgentsLocalOnly ??= modeDefaults.customAgentsLocalOnly;
    config.systemMessage = this.getSystemMessageConfigForMode(config.systemMessage);
    const callerSessionId = config.sessionId;
    const useServerGeneratedId = config.cloud != null && callerSessionId == null;
    const localSessionId = useServerGeneratedId ? void 0 : callerSessionId ?? (0,node_crypto__WEBPACK_IMPORTED_MODULE_1__.randomUUID)();
    const {
      wireProvider: bearerWireProvider,
      wireProviders: bearerWireProviders,
      callbacks: bearerTokenCallbacks
    } = extractBearerTokenProviders(config.provider, config.providers);
    const { wirePayload: wireSystemMessage, transformCallbacks } = extractTransformCallbacks(
      config.systemMessage
    );
    const initializeSession = (sessionId) => {
      const s = new _session_js__WEBPACK_IMPORTED_MODULE_9__/* .CopilotSession */ .N(
        sessionId,
        this.connection,
        void 0,
        this.onGetTraceContext,
        {
          mcpAuthHandler: config.onMcpAuthRequest,
          managedSettingsEnabled: config.enableManagedSettings === true || config.managedSettings !== void 0
        }
      );
      s.registerTools(config.tools);
      s.registerCanvases(config.canvases);
      s.registerCommands(config.commands);
      if (bearerTokenCallbacks.size > 0) {
        s.registerBearerTokenProviders(bearerTokenCallbacks);
      }
      s.registerPermissionHandler(config.onPermissionRequest);
      if (config.onUserInputRequest) {
        s.registerUserInputHandler(config.onUserInputRequest);
      }
      if (config.onElicitationRequest) {
        s.registerElicitationHandler(config.onElicitationRequest);
      }
      if (config.onExitPlanModeRequest) {
        s.registerExitPlanModeHandler(config.onExitPlanModeRequest);
      }
      if (config.onAutoModeSwitchRequest) {
        s.registerAutoModeSwitchHandler(config.onAutoModeSwitchRequest);
      }
      if (config.hooks) {
        s.registerHooks(config.hooks);
      }
      if (transformCallbacks) {
        s.registerTransformCallbacks(transformCallbacks);
      }
      if (config.onEvent) {
        s.on(config.onEvent);
      }
      this.sessions.set(sessionId, s);
      this.setupSessionFs(s, config);
      return s;
    };
    let session;
    let registeredId;
    if (localSessionId !== void 0) {
      session = initializeSession(localSessionId);
      registeredId = localSessionId;
    }
    const toolFilterOptions = this.resolveToolFilterOptions(config);
    try {
      const response = await this.connection.sendRequest("session.create", {
        ...await (0,_telemetry_js__WEBPACK_IMPORTED_MODULE_12__/* .getTraceContext */ .X)(this.onGetTraceContext),
        model: config.model,
        sessionId: localSessionId,
        clientName: config.clientName,
        reasoningEffort: config.reasoningEffort,
        reasoningSummary: config.reasoningSummary,
        isExperimentalMode: this.experimentalModeForMode(config.enableExperimentalMode),
        contextTier: config.contextTier,
        tools: config.tools?.map((tool) => ({
          name: tool.name,
          description: tool.description,
          parameters: toJsonSchema(tool.parameters),
          overridesBuiltInTool: tool.overridesBuiltInTool,
          skipPermission: tool.skipPermission,
          defer: tool.defer,
          metadata: tool.metadata,
          isTerminal: tool.isTerminal
        })),
        toolSearch: config.toolSearch,
        canvases: config.canvases?.map((canvas) => canvas.declaration),
        requestCanvasRenderer: config.requestCanvasRenderer,
        requestExtensions: config.requestExtensions,
        extensionSdkPath: config.extensionSdkPath,
        extensionInfo: config.extensionInfo,
        canvasProvider: config.canvasProvider,
        commands: config.commands?.map((cmd) => ({
          name: cmd.name,
          description: cmd.description
        })),
        systemMessage: wireSystemMessage,
        availableTools: toolFilterOptions.availableTools,
        excludedTools: toolFilterOptions.excludedTools,
        toolFilterPrecedence: toolFilterOptions.toolFilterPrecedence,
        excludedBuiltinAgents: config.excludedBuiltinAgents,
        provider: bearerWireProvider,
        capi: config.capi,
        providers: bearerWireProviders,
        models: config.models,
        enableSessionTelemetry: config.enableSessionTelemetry,
        enableCitations: config.enableCitations,
        enableFileChangeTracking: config.enableFileChangeTracking,
        sessionLimits: config.sessionLimits,
        modelCapabilities: config.modelCapabilities,
        largeOutput: toWireLargeOutput(config.largeOutput),
        requestPermission: !!config.onPermissionRequest,
        requestUserInput: !!config.onUserInputRequest,
        requestElicitation: !!config.onElicitationRequest,
        ...config.enableMcpApps ? { requestMcpApps: true } : {},
        ...config.githubMcpToolConfig != null ? { githubMcpToolConfig: config.githubMcpToolConfig } : {},
        requestExitPlanMode: !!config.onExitPlanModeRequest,
        requestAutoModeSwitch: !!config.onAutoModeSwitchRequest,
        hooks: !!(config.hooks && Object.values(config.hooks).some(Boolean)),
        workingDirectory: config.workingDirectory,
        additionalDirectories: config.additionalDirectories,
        streaming: config.streaming,
        includeSubAgentStreamingEvents: config.includeSubAgentStreamingEvents ?? true,
        ...this.onGitHubTelemetry != null ? { enableGitHubTelemetryForwarding: true } : {},
        mcpServers: toWireMcpServers(config.mcpServers),
        mcpOAuthTokenStorage: config.mcpOAuthTokenStorage,
        envValueMode: "direct",
        customAgents: toWireCustomAgents(config.customAgents),
        customAgentsLocalOnly: config.customAgentsLocalOnly,
        defaultAgent: config.defaultAgent,
        agent: config.agent,
        configDir: config.configDirectory,
        enableConfigDiscovery: config.enableConfigDiscovery,
        skipEmbeddingRetrieval: config.skipEmbeddingRetrieval,
        embeddingCacheStorage: config.embeddingCacheStorage,
        organizationCustomInstructions: config.organizationCustomInstructions,
        enableOnDemandInstructionDiscovery: config.enableOnDemandInstructionDiscovery,
        enableFileHooks: config.enableFileHooks,
        enableHostGitOperations: config.enableHostGitOperations,
        enableSessionStore: config.enableSessionStore,
        enableSkills: config.enableSkills,
        skillDirectories: config.skillDirectories,
        pluginDirectories: config.pluginDirectories,
        instructionDirectories: config.instructionDirectories,
        disabledSkills: config.disabledSkills,
        disabledMcpServers: config.disabledMcpServers,
        infiniteSessions: config.infiniteSessions,
        memory: config.memory,
        gitHubToken: config.gitHubToken,
        remoteSession: config.remoteSession,
        cloud: config.cloud,
        expAssignments: config.expAssignments,
        enableManagedSettings: config.enableManagedSettings,
        managedSettings: config.managedSettings
      });
      const {
        sessionId: returnedSessionId,
        workspacePath,
        capabilities
      } = response;
      if (!returnedSessionId) {
        throw new Error("session.create response did not include a sessionId");
      }
      if (localSessionId !== void 0 && localSessionId !== returnedSessionId) {
        throw new Error(
          `session.create returned sessionId ${returnedSessionId} but the caller requested ${localSessionId}`
        );
      }
      if (session === void 0) {
        session = initializeSession(returnedSessionId);
        registeredId = returnedSessionId;
      }
      if (config.onMcpAuthRequest) {
        await this.connection.sendRequest("session.eventLog.registerInterest", {
          sessionId: returnedSessionId,
          eventType: "mcp.oauth_required"
        });
      }
      session["_workspacePath"] = workspacePath;
      session.setCapabilities(capabilities);
      await this.updateSessionOptionsForMode(session, config);
    } catch (e) {
      if (registeredId !== void 0) {
        this.sessions.delete(registeredId);
      }
      throw e;
    }
    return session;
  }
  /**
   * Resumes an existing conversation session by its ID.
   *
   * This allows you to continue a previous conversation, maintaining all
   * conversation history. The session must have been previously created
   * and not deleted.
   *
   * @param sessionId - The ID of the session to resume
   * @param config - Optional configuration for the resumed session
   * @returns A promise that resolves with the resumed session
   * @throws Error if the session does not exist or the client is not connected
   *
   * @example
   * ```typescript
   * // Resume a previous session
   * const session = await client.resumeSession("session-123", { onPermissionRequest: approveAll });
   *
   * // Resume with new tools
   * const session = await client.resumeSession("session-123", {
   *   onPermissionRequest: approveAll,
   *   tools: [myNewTool]
   * });
   * ```
   */
  async resumeSession(sessionId, config) {
    return this.resumeSessionInternal(sessionId, config);
  }
  /** @internal */
  async resumeSessionForExtension(sessionId, config, factories) {
    return this.resumeSessionInternal(sessionId, config, factories);
  }
  async resumeSessionInternal(sessionId, config, factories) {
    if (!this.connection) {
      await this.start();
    }
    const session = new _session_js__WEBPACK_IMPORTED_MODULE_9__/* .CopilotSession */ .N(
      sessionId,
      this.connection,
      void 0,
      this.onGetTraceContext,
      {
        mcpAuthHandler: config.onMcpAuthRequest,
        managedSettingsEnabled: config.enableManagedSettings === true || config.managedSettings !== void 0
      }
    );
    session.registerTools(config.tools);
    session.registerCanvases(config.canvases);
    session.registerCommands(config.commands);
    session.registerFactories(factories);
    const {
      wireProvider: bearerWireProvider,
      wireProviders: bearerWireProviders,
      callbacks: bearerTokenCallbacks
    } = extractBearerTokenProviders(config.provider, config.providers);
    if (bearerTokenCallbacks.size > 0) {
      session.registerBearerTokenProviders(bearerTokenCallbacks);
    }
    session.registerPermissionHandler(config.onPermissionRequest);
    if (config.onUserInputRequest) {
      session.registerUserInputHandler(config.onUserInputRequest);
    }
    if (config.onElicitationRequest) {
      session.registerElicitationHandler(config.onElicitationRequest);
    }
    if (config.onExitPlanModeRequest) {
      session.registerExitPlanModeHandler(config.onExitPlanModeRequest);
    }
    if (config.onAutoModeSwitchRequest) {
      session.registerAutoModeSwitchHandler(config.onAutoModeSwitchRequest);
    }
    if (config.hooks) {
      session.registerHooks(config.hooks);
    }
    const modeDefaults = this.configDefaultsForMode();
    config = { ...modeDefaults, ...config };
    config.customAgentsLocalOnly ??= modeDefaults.customAgentsLocalOnly;
    config.systemMessage = this.getSystemMessageConfigForMode(config.systemMessage);
    const { wirePayload: wireSystemMessage, transformCallbacks } = extractTransformCallbacks(
      config.systemMessage
    );
    if (transformCallbacks) {
      session.registerTransformCallbacks(transformCallbacks);
    }
    if (config.onEvent) {
      session.on(config.onEvent);
    }
    this.sessions.set(sessionId, session);
    this.setupSessionFs(session, config);
    const toolFilterOptions = this.resolveToolFilterOptions(config);
    try {
      const response = await this.connection.sendRequest("session.resume", {
        ...await (0,_telemetry_js__WEBPACK_IMPORTED_MODULE_12__/* .getTraceContext */ .X)(this.onGetTraceContext),
        sessionId,
        clientName: config.clientName,
        model: config.model,
        reasoningEffort: config.reasoningEffort,
        reasoningSummary: config.reasoningSummary,
        isExperimentalMode: this.experimentalModeForMode(config.enableExperimentalMode),
        contextTier: config.contextTier,
        systemMessage: wireSystemMessage,
        availableTools: toolFilterOptions.availableTools,
        excludedTools: toolFilterOptions.excludedTools,
        toolFilterPrecedence: toolFilterOptions.toolFilterPrecedence,
        enableSessionTelemetry: config.enableSessionTelemetry,
        excludedBuiltinAgents: config.excludedBuiltinAgents,
        enableCitations: config.enableCitations,
        enableFileChangeTracking: config.enableFileChangeTracking,
        sessionLimits: config.sessionLimits,
        tools: config.tools?.map((tool) => ({
          name: tool.name,
          description: tool.description,
          parameters: toJsonSchema(tool.parameters),
          overridesBuiltInTool: tool.overridesBuiltInTool,
          skipPermission: tool.skipPermission,
          defer: tool.defer,
          metadata: tool.metadata,
          isTerminal: tool.isTerminal
        })),
        toolSearch: config.toolSearch,
        canvases: config.canvases?.map((canvas) => canvas.declaration),
        factories: factories?.map((factory) => factory.meta),
        requestCanvasRenderer: config.requestCanvasRenderer,
        requestExtensions: config.requestExtensions,
        extensionSdkPath: config.extensionSdkPath,
        extensionInfo: config.extensionInfo,
        canvasProvider: config.canvasProvider,
        commands: config.commands?.map((cmd) => ({
          name: cmd.name,
          description: cmd.description
        })),
        provider: bearerWireProvider,
        capi: config.capi,
        providers: bearerWireProviders,
        models: config.models,
        modelCapabilities: config.modelCapabilities,
        largeOutput: toWireLargeOutput(config.largeOutput),
        requestPermission: config.onPermissionRequest !== _types_js__WEBPACK_IMPORTED_MODULE_14__/* .defaultJoinSessionPermissionHandler */ .p5,
        requestUserInput: !!config.onUserInputRequest,
        requestElicitation: !!config.onElicitationRequest,
        ...config.enableMcpApps ? { requestMcpApps: true } : {},
        ...config.githubMcpToolConfig != null ? { githubMcpToolConfig: config.githubMcpToolConfig } : {},
        requestExitPlanMode: !!config.onExitPlanModeRequest,
        requestAutoModeSwitch: !!config.onAutoModeSwitchRequest,
        hooks: !!(config.hooks && Object.values(config.hooks).some(Boolean)),
        workingDirectory: config.workingDirectory,
        additionalDirectories: config.additionalDirectories,
        configDir: config.configDirectory,
        enableConfigDiscovery: config.enableConfigDiscovery,
        skipEmbeddingRetrieval: config.skipEmbeddingRetrieval,
        embeddingCacheStorage: config.embeddingCacheStorage,
        organizationCustomInstructions: config.organizationCustomInstructions,
        enableOnDemandInstructionDiscovery: config.enableOnDemandInstructionDiscovery,
        enableFileHooks: config.enableFileHooks,
        enableHostGitOperations: config.enableHostGitOperations,
        enableSessionStore: config.enableSessionStore,
        enableSkills: config.enableSkills,
        streaming: config.streaming,
        includeSubAgentStreamingEvents: config.includeSubAgentStreamingEvents ?? true,
        ...this.onGitHubTelemetry != null ? { enableGitHubTelemetryForwarding: true } : {},
        mcpServers: toWireMcpServers(config.mcpServers),
        mcpOAuthTokenStorage: config.mcpOAuthTokenStorage,
        envValueMode: "direct",
        customAgents: toWireCustomAgents(config.customAgents),
        customAgentsLocalOnly: config.customAgentsLocalOnly,
        defaultAgent: config.defaultAgent,
        agent: config.agent,
        skillDirectories: config.skillDirectories,
        pluginDirectories: config.pluginDirectories,
        instructionDirectories: config.instructionDirectories,
        disabledSkills: config.disabledSkills,
        disabledMcpServers: config.disabledMcpServers,
        infiniteSessions: config.infiniteSessions,
        memory: config.memory,
        disableResume: config.suppressResumeEvent,
        continuePendingWork: config.continuePendingWork,
        gitHubToken: config.gitHubToken,
        remoteSession: config.remoteSession,
        openCanvases: config.openCanvases,
        expAssignments: config.expAssignments,
        enableManagedSettings: config.enableManagedSettings,
        managedSettings: config.managedSettings
      });
      const { workspacePath, capabilities, openCanvases } = response;
      session["_workspacePath"] = workspacePath;
      session.setCapabilities(capabilities);
      session.setOpenCanvases(openCanvases ?? []);
      if (config.onMcpAuthRequest) {
        await this.connection.sendRequest("session.eventLog.registerInterest", {
          sessionId,
          eventType: "mcp.oauth_required"
        });
      }
      await this.updateSessionOptionsForMode(session, config);
    } catch (e) {
      this.sessions.delete(sessionId);
      throw e;
    }
    return session;
  }
  /**
   * Sends a ping request to the server to verify connectivity.
   *
   * @param message - Optional message to include in the ping
   * @returns A promise that resolves with the ping response containing the message and timestamp
   * @throws Error if the client is not connected
   *
   * @example
   * ```typescript
   * const response = await client.ping("health check");
   * console.log(`Server responded at ${new Date(response.timestamp)}`);
   * ```
   */
  async ping(message) {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    const result = await this.connection.sendRequest("ping", { message });
    return result;
  }
  /**
   * Get CLI status including version and protocol information
   */
  async getStatus() {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    const result = await this.connection.sendRequest("status.get", {});
    return result;
  }
  /**
   * Get current authentication status
   */
  async getAuthStatus() {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    const result = await this.connection.sendRequest("auth.getStatus", {});
    return result;
  }
  /**
   * List available models with their metadata.
   *
   * If an `onListModels` handler was provided in the client options,
   * it is called instead of querying the CLI server.
   *
   * Results are cached after the first successful call to avoid rate limiting.
   * The cache is cleared when the client disconnects.
   *
   * @throws Error if not connected (when no custom handler is set)
   */
  async listModels() {
    await this.modelsCacheLock;
    let resolveLock;
    this.modelsCacheLock = new Promise((resolve) => {
      resolveLock = resolve;
    });
    try {
      if (this.modelsCache !== null) {
        return [...this.modelsCache];
      }
      let models;
      if (this.onListModels) {
        models = await this.onListModels();
      } else {
        if (!this.connection) {
          throw new Error("Client not connected");
        }
        const result = await this.connection.sendRequest("models.list", {});
        const response = result;
        models = response.models;
        for (const model of models) {
          const m = model;
          if (!m.capabilities) {
            m.capabilities = {
              supports: {},
              limits: { max_context_window_tokens: 0 }
            };
          } else {
            if (!m.capabilities.supports) m.capabilities.supports = {};
            if (!m.capabilities.limits) {
              m.capabilities.limits = { max_context_window_tokens: 0 };
            } else if (m.capabilities.limits.max_context_window_tokens === void 0) {
              m.capabilities.limits.max_context_window_tokens = 0;
            }
          }
        }
      }
      this.modelsCache = [...models];
      return [...models];
    } finally {
      resolveLock();
    }
  }
  /**
   * Send the `connect` handshake (carrying the optional token) and verify the
   * server's protocol version. Falls back to `ping` against legacy servers
   * that don't implement `connect`.
   */
  async verifyProtocolVersion() {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    const maxVersion = (0,_sdkProtocolVersion_js__WEBPACK_IMPORTED_MODULE_8__/* .getSdkProtocolVersion */ .h)();
    const raceAgainstExit = (p) => this.processExitPromise ? Promise.race([p, this.processExitPromise]) : p;
    let serverVersion;
    try {
      const connectParams = { token: this.effectiveConnectionToken };
      if (this.onGitHubTelemetry != null) {
        connectParams.enableGitHubTelemetryForwarding = true;
      }
      const result = await raceAgainstExit(this.internalRpc.connect(connectParams));
      serverVersion = result.protocolVersion;
    } catch (err) {
      if (err instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.ResponseError && (err.code === vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.ErrorCodes.MethodNotFound || err.message === "Unhandled method connect")) {
        serverVersion = (await raceAgainstExit(this.ping())).protocolVersion;
      } else {
        throw err;
      }
    }
    if (serverVersion === void 0) {
      throw new Error(
        `SDK protocol version mismatch: SDK supports versions ${MIN_PROTOCOL_VERSION}-${maxVersion}, but server does not report a protocol version. Please update your server to ensure compatibility.`
      );
    }
    if (serverVersion < MIN_PROTOCOL_VERSION || serverVersion > maxVersion) {
      throw new Error(
        `SDK protocol version mismatch: SDK supports versions ${MIN_PROTOCOL_VERSION}-${maxVersion}, but server reports version ${serverVersion}. Please update your SDK or server to ensure compatibility.`
      );
    }
    this.negotiatedProtocolVersion = serverVersion;
  }
  /**
   * Gets the ID of the most recently updated session.
   *
   * This is useful for resuming the last conversation when the session ID
   * was not stored.
   *
   * @returns A promise that resolves with the session ID, or undefined if no sessions exist
   * @throws Error if the client is not connected
   *
   * @example
   * ```typescript
   * const lastId = await client.getLastSessionId();
   * if (lastId) {
   *   const session = await client.resumeSession(lastId, { onPermissionRequest: approveAll });
   * }
   * ```
   */
  async getLastSessionId() {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    const response = await this.connection.sendRequest("session.getLastId", {});
    return response.sessionId;
  }
  /**
   * Permanently deletes a session and all its data from disk, including
   * conversation history, planning state, and artifacts.
   *
   * Unlike {@link CopilotSession.disconnect}, which only releases in-memory
   * resources and preserves session data for later resumption, this method
   * is irreversible. The session cannot be resumed after deletion.
   *
   * @param sessionId - The ID of the session to delete
   * @returns A promise that resolves when the session is deleted
   * @throws Error if the session does not exist or deletion fails
   *
   * @example
   * ```typescript
   * await client.deleteSession("session-123");
   * ```
   */
  async deleteSession(sessionId) {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    const response = await this.connection.sendRequest("session.delete", {
      sessionId
    });
    const { success, error } = response;
    if (!success) {
      throw new Error(`Failed to delete session ${sessionId}: ${error || "Unknown error"}`);
    }
    this.sessions.delete(sessionId);
  }
  /**
   * List all available sessions.
   *
   * @param filter - Optional filter to limit returned sessions by context fields
   *
   * @example
   * // List all sessions
   * const sessions = await client.listSessions();
   *
   * @example
   * // List sessions for a specific repository
   * const sessions = await client.listSessions({ repository: "owner/repo" });
   */
  async listSessions(filter) {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    let wireFilter;
    if (filter) {
      const { workingDirectory, ...rest } = filter;
      wireFilter = { ...rest, cwd: workingDirectory };
    }
    const response = await this.connection.sendRequest("session.list", {
      filter: wireFilter
    });
    const { sessions } = response;
    return sessions.map(CopilotClient.toSessionMetadata);
  }
  /**
   * Gets metadata for a specific session by ID.
   *
   * This provides an efficient O(1) lookup of a single session's metadata
   * instead of listing all sessions. Returns undefined if the session is not found.
   *
   * @param sessionId - The ID of the session to look up
   * @returns A promise that resolves with the session metadata, or undefined if not found
   * @throws Error if the client is not connected
   *
   * @example
   * ```typescript
   * const metadata = await client.getSessionMetadata("session-123");
   * if (metadata) {
   *   console.log(`Session started at: ${metadata.startTime}`);
   * }
   * ```
   */
  async getSessionMetadata(sessionId) {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    const response = await this.connection.sendRequest("session.getMetadata", { sessionId });
    const { session } = response;
    if (!session) {
      return void 0;
    }
    return CopilotClient.toSessionMetadata(session);
  }
  static toSessionMetadata(raw) {
    const { context } = raw;
    return {
      sessionId: raw.sessionId,
      startTime: new Date(raw.startTime),
      modifiedTime: new Date(raw.modifiedTime),
      summary: raw.summary,
      isRemote: raw.isRemote,
      context: context ? {
        workingDirectory: context.cwd,
        gitRoot: context.gitRoot,
        repository: context.repository,
        branch: context.branch
      } : void 0
    };
  }
  /**
   * Gets the foreground session ID in TUI+server mode.
   *
   * This returns the ID of the session currently displayed in the TUI.
   * Only available when connecting to a server running in TUI+server mode (--ui-server).
   *
   * @returns A promise that resolves with the foreground session ID, or undefined if none
   * @throws Error if the client is not connected
   *
   * @example
   * ```typescript
   * const sessionId = await client.getForegroundSessionId();
   * if (sessionId) {
   *   console.log(`TUI is displaying session: ${sessionId}`);
   * }
   * ```
   */
  async getForegroundSessionId() {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    const response = await this.connection.sendRequest("session.getForeground", {});
    return response.sessionId;
  }
  /**
   * Sets the foreground session in TUI+server mode.
   *
   * This requests the TUI to switch to displaying the specified session.
   * Only available when connecting to a server running in TUI+server mode (--ui-server).
   *
   * @param sessionId - The ID of the session to display in the TUI
   * @returns A promise that resolves when the session is switched
   * @throws Error if the client is not connected or if the operation fails
   *
   * @example
   * ```typescript
   * // Switch the TUI to display a specific session
   * await client.setForegroundSessionId("session-123");
   * ```
   */
  async setForegroundSessionId(sessionId) {
    if (!this.connection) {
      throw new Error("Client not connected");
    }
    const response = await this.connection.sendRequest("session.setForeground", { sessionId });
    const result = response;
    if (!result.success) {
      throw new Error(result.error || "Failed to set foreground session");
    }
  }
  onLifecycle(eventTypeOrHandler, handler) {
    if (typeof eventTypeOrHandler === "string" && handler) {
      const eventType = eventTypeOrHandler;
      if (!this.typedLifecycleHandlers.has(eventType)) {
        this.typedLifecycleHandlers.set(eventType, /* @__PURE__ */ new Set());
      }
      const storedHandler = handler;
      this.typedLifecycleHandlers.get(eventType).add(storedHandler);
      return () => {
        const handlers = this.typedLifecycleHandlers.get(eventType);
        if (handlers) {
          handlers.delete(storedHandler);
        }
      };
    }
    const wildcardHandler = eventTypeOrHandler;
    this.sessionLifecycleHandlers.add(wildcardHandler);
    return () => {
      this.sessionLifecycleHandlers.delete(wildcardHandler);
    };
  }
  /**
   * Builds the environment for the spawned runtime child process (stdio/TCP): applies
   * the auth token, connection token, `COPILOT_HOME`, keychain setting, and telemetry
   * variables on top of the effective env. Not used by the in-process (FFI) transport,
   * whose worker inherits the host process's ambient environment
   * (see {@link CopilotClient.startInProcessFfi}).
   */
  buildRuntimeEnv() {
    const env = { ...this.resolvedEnv };
    delete env.NODE_DEBUG;
    if (this.options.gitHubToken) {
      env.COPILOT_SDK_AUTH_TOKEN = this.options.gitHubToken;
    }
    if (this.effectiveConnectionToken) {
      env.COPILOT_CONNECTION_TOKEN = this.effectiveConnectionToken;
    }
    if (this.options.baseDirectory) {
      env.COPILOT_HOME = this.options.baseDirectory;
    }
    if (this.options.mode === "empty") {
      env.COPILOT_DISABLE_KEYTAR = "1";
    }
    if (this.options.telemetry) {
      const t = this.options.telemetry;
      env.COPILOT_OTEL_ENABLED = "true";
      if (t.otlpEndpoint !== void 0) env.OTEL_EXPORTER_OTLP_ENDPOINT = t.otlpEndpoint;
      if (t.otlpProtocol !== void 0) env.OTEL_EXPORTER_OTLP_PROTOCOL = t.otlpProtocol;
      if (t.filePath !== void 0) env.COPILOT_OTEL_FILE_EXPORTER_PATH = t.filePath;
      if (t.exporterType !== void 0) env.COPILOT_OTEL_EXPORTER_TYPE = t.exporterType;
      if (t.sourceName !== void 0) env.COPILOT_OTEL_SOURCE_NAME = t.sourceName;
      if (t.captureContent !== void 0)
        env.OTEL_INSTRUMENTATION_GENAI_CAPTURE_MESSAGE_CONTENT = String(t.captureContent);
    }
    return env;
  }
  /**
   * Start the CLI server process
   */
  async startCLIServer() {
    return new Promise((resolve, reject) => {
      this.stderrBuffer = "";
      const args = [...this.connectionExtraArgs, "--headless", "--no-auto-update"];
      if (this.options.logLevel) {
        args.push("--log-level", this.options.logLevel);
      }
      if (this.connectionConfig.kind === "stdio") {
        args.push("--stdio");
      } else if (this.connectionConfig.kind === "tcp") {
        const requestedPort = this.connectionConfig.port ?? 0;
        if (requestedPort > 0) {
          args.push("--port", requestedPort.toString());
        }
      }
      if (this.options.gitHubToken) {
        args.push("--auth-token-env", "COPILOT_SDK_AUTH_TOKEN");
      }
      if (!this.options.useLoggedInUser) {
        args.push("--no-auto-login");
      }
      if (this.options.sessionIdleTimeoutSeconds !== void 0 && this.options.sessionIdleTimeoutSeconds > 0) {
        args.push(
          "--session-idle-timeout",
          this.options.sessionIdleTimeoutSeconds.toString()
        );
      }
      if (this.options.enableRemoteSessions) {
        args.push("--remote");
      }
      const envWithoutNodeDebug = this.buildRuntimeEnv();
      if (!this.resolvedCliPath) {
        throw new Error(
          "Path to Copilot CLI is required. Please supply it via `RuntimeConnection.forStdio({ path })` or `RuntimeConnection.forTcp({ path })`, set the COPILOT_CLI_PATH environment variable, or use `RuntimeConnection.forUri(...)` to connect to an already-running runtime."
        );
      }
      if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_2__.existsSync)(this.resolvedCliPath)) {
        throw new Error(
          `Copilot CLI not found at ${this.resolvedCliPath}. Ensure @github/copilot is installed.`
        );
      }
      const stdioConfig = this.connectionConfig.kind === "stdio" ? ["pipe", "pipe", "pipe"] : ["ignore", "pipe", "pipe"];
      const isJsFile = this.resolvedCliPath.endsWith(".js");
      if (isJsFile) {
        this.cliProcess = (0,node_child_process__WEBPACK_IMPORTED_MODULE_0__.spawn)(getNodeExecPath(), [this.resolvedCliPath, ...args], {
          stdio: stdioConfig,
          cwd: this.options.workingDirectory,
          env: envWithoutNodeDebug,
          windowsHide: true
        });
      } else {
        this.cliProcess = (0,node_child_process__WEBPACK_IMPORTED_MODULE_0__.spawn)(this.resolvedCliPath, args, {
          stdio: stdioConfig,
          cwd: this.options.workingDirectory,
          env: envWithoutNodeDebug,
          windowsHide: true
        });
      }
      let stdout = "";
      let resolved = false;
      if (this.connectionConfig.kind === "stdio") {
        resolved = true;
        resolve();
      } else {
        this.cliProcess.stdout?.on("data", (data) => {
          stdout += data.toString();
          const match = stdout.match(/listening on port (\d+)/i);
          if (match && !resolved) {
            this.runtimePort = parseInt(match[1], 10);
            resolved = true;
            resolve();
          }
        });
      }
      this.cliProcess.stderr?.on("data", (data) => {
        this.stderrBuffer += data.toString();
        const lines = data.toString().split("\n");
        for (const line of lines) {
          if (line.trim()) {
            process.stderr.write(`[CLI subprocess] ${line}
`);
          }
        }
      });
      this.cliProcess.on("error", (error) => {
        if (!resolved) {
          resolved = true;
          const stderrOutput = this.stderrBuffer.trim();
          if (stderrOutput) {
            reject(
              new Error(
                `Failed to start CLI server: ${error.message}
stderr: ${stderrOutput}`
              )
            );
          } else {
            reject(new Error(`Failed to start CLI server: ${error.message}`));
          }
        }
      });
      this.processExitPromise = new Promise((_, rejectProcessExit) => {
        this.cliProcess.on("exit", (code) => {
          setTimeout(() => {
            const stderrOutput = this.stderrBuffer.trim();
            if (stderrOutput) {
              rejectProcessExit(
                new Error(
                  `CLI server exited with code ${code}
stderr: ${stderrOutput}`
                )
              );
            } else {
              rejectProcessExit(
                new Error(`CLI server exited unexpectedly with code ${code}`)
              );
            }
          }, 50);
        });
      });
      this.processExitPromise.catch(() => {
      });
      this.cliProcess.on("exit", (code) => {
        if (!resolved) {
          resolved = true;
          const stderrOutput = this.stderrBuffer.trim();
          if (stderrOutput) {
            reject(
              new Error(
                `CLI server exited with code ${code}
stderr: ${stderrOutput}`
              )
            );
          } else {
            reject(new Error(`CLI server exited with code ${code}`));
          }
        }
      });
      this.cliStartTimeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          reject(new Error("Timeout waiting for CLI server to start"));
        }
      }, 3e4);
    });
  }
  /**
   * Connect to the CLI server (via socket or stdio)
   */
  async connectToServer() {
    switch (this.connectionConfig.kind) {
      case "parent-process":
        return this.connectToParentProcessViaStdio();
      case "stdio":
        return this.connectToChildProcessViaStdio();
      case "inprocess":
        return this.connectViaFfi();
      case "tcp":
      case "uri":
        return this.connectViaTcp();
    }
  }
  /** Starts the in-process FFI runtime with SDK-managed typed options. */
  async startInProcessFfi() {
    const entrypoint = this.resolveCliPathForFfi();
    const { FfiRuntimeHost } = await Promise.resolve(/* import() */).then(() => (__webpack_require__(3228)));
    const environment = {};
    if (this.options.gitHubToken) {
      environment.COPILOT_SDK_AUTH_TOKEN = this.options.gitHubToken;
    }
    if (this.options.baseDirectory) {
      environment.COPILOT_HOME = this.options.baseDirectory;
    }
    if (this.options.mode === "empty") {
      environment.COPILOT_DISABLE_KEYTAR = "1";
    }
    const args = [];
    if (this.options.logLevel) {
      args.push("--log-level", this.options.logLevel);
    }
    if (this.options.gitHubToken) {
      args.push("--auth-token-env", "COPILOT_SDK_AUTH_TOKEN");
    }
    if (!this.options.useLoggedInUser) {
      args.push("--no-auto-login");
    }
    if (this.options.sessionIdleTimeoutSeconds > 0) {
      args.push("--session-idle-timeout", this.options.sessionIdleTimeoutSeconds.toString());
    }
    if (this.options.enableRemoteSessions) {
      args.push("--remote");
    }
    const host = FfiRuntimeHost.create(
      entrypoint,
      CopilotClient.getNapiPrebuildsFolder(entrypoint),
      environment,
      args
    );
    this.ffiHost = host;
    await host.start();
  }
  /**
   * Connect to the in-process FFI runtime host over its receive/send streams,
   * reusing the same `vscode-jsonrpc` framing as the stdio transport.
   */
  async connectViaFfi() {
    if (!this.ffiHost) {
      throw new Error("In-process FFI runtime host not started");
    }
    this.messageWriter = new TeardownResilientStreamMessageWriter(this.ffiHost.sendStream);
    this.connection = (0,vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.createMessageConnection)(
      new vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.StreamMessageReader(this.ffiHost.receiveStream),
      this.messageWriter
    );
    this.attachConnectionHandlers();
    this.connection.listen();
  }
  /**
   * Resolves the CLI entrypoint used for in-process FFI hosting: `COPILOT_CLI_PATH`
   * when set, otherwise the bundled platform-package entrypoint.
   */
  resolveCliPathForFfi() {
    return this.resolvedEnv.COPILOT_CLI_PATH ?? getBundledCliPath();
  }
  /**
   * Returns the napi prebuilds folder name for the current host — the
   * `<node-platform>-<arch>` convention (e.g. `win32-x64`, `darwin-arm64`,
   * `linux-x64`, `linuxmusl-x64`) under which the runtime ships
   * `prebuilds/<folder>/runtime.node`.
   */
  static getNapiPrebuildsFolder(entrypoint) {
    const arch = process.arch;
    if (arch !== "x64" && arch !== "arm64") {
      throw new Error(`Unsupported architecture '${arch}' for in-process FFI hosting.`);
    }
    let platform = process.platform;
    if (platform === "linux" && CopilotClient.isMusl(entrypoint)) {
      platform = "linuxmusl";
    }
    return `${platform}-${arch}`;
  }
  static isMusl(entrypoint) {
    if (entrypoint.includes(`copilot-linuxmusl-${process.arch}`)) {
      return true;
    }
    if (entrypoint.includes(`copilot-linux-${process.arch}`)) {
      return false;
    }
    const report = process.report?.getReport();
    const header = report && "header" in report ? report.header : void 0;
    return header !== void 0 && header.glibcVersionRuntime === void 0;
  }
  /**
   * Connect to child via stdio pipes
   */
  async connectToChildProcessViaStdio() {
    if (!this.cliProcess) {
      throw new Error("CLI process not started");
    }
    this.cliProcess.stdin?.on("error", (err) => {
      if (this.forceStopping) {
        return;
      }
      this.state = "error";
      const reason = err instanceof Error ? err.stack ?? err.message : String(err);
      this.logDebug(`stdin pipe error: ${reason}`);
      try {
        this.connection?.dispose();
      } catch {
      }
    });
    this.messageWriter = new TeardownResilientStreamMessageWriter(this.cliProcess.stdin);
    this.connection = (0,vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.createMessageConnection)(
      new vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.StreamMessageReader(this.cliProcess.stdout),
      this.messageWriter
    );
    this.attachConnectionHandlers();
    this.connection.listen();
  }
  /**
   * Connect to parent via stdio pipes
   */
  async connectToParentProcessViaStdio() {
    if (this.cliProcess) {
      throw new Error("CLI child process was unexpectedly started in parent process mode");
    }
    this.messageWriter = new TeardownResilientStreamMessageWriter(process.stdout);
    this.connection = (0,vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.createMessageConnection)(
      new vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.StreamMessageReader(process.stdin),
      this.messageWriter
    );
    this.attachConnectionHandlers();
    this.connection.listen();
  }
  /**
   * Connect to the CLI server via TCP socket
   */
  async connectViaTcp() {
    if (!this.runtimePort) {
      throw new Error("Server port not available");
    }
    return new Promise((resolve, reject) => {
      this.socket = new node_net__WEBPACK_IMPORTED_MODULE_3__.Socket();
      const connectionTimeout = setTimeout(() => {
        this.socket?.destroy();
        reject(new Error("Timeout connecting to CLI server"));
      }, 1e4);
      this.socket.connect(this.runtimePort, this.actualHost, () => {
        clearTimeout(connectionTimeout);
        this.messageWriter = new TeardownResilientStreamMessageWriter(this.socket);
        this.connection = (0,vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.createMessageConnection)(
          new vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_6__.StreamMessageReader(this.socket),
          this.messageWriter
        );
        this.attachConnectionHandlers();
        this.connection.listen();
        resolve();
      });
      this.socket.on("error", (error) => {
        clearTimeout(connectionTimeout);
        reject(new Error(`Failed to connect to CLI server: ${error.message}`));
      });
    });
  }
  attachConnectionHandlers() {
    if (!this.connection) {
      return;
    }
    this.connection.onNotification("session.event", (notification) => {
      this.handleSessionEventNotification(notification);
    });
    this.connection.onNotification("session.lifecycle", (notification) => {
      this.handleSessionLifecycleNotification(notification);
    });
    this.connection.onRequest(
      "userInput.request",
      async (params) => await this.handleUserInputRequest(params)
    );
    this.connection.onRequest(
      "exitPlanMode.request",
      async (params) => await this.handleExitPlanModeRequest(params)
    );
    this.connection.onRequest(
      "autoModeSwitch.request",
      async (params) => await this.handleAutoModeSwitchRequest(params)
    );
    this.connection.onRequest(
      "systemMessage.transform",
      async (params) => await this.handleSystemMessageTransform(params)
    );
    const sessions = this.sessions;
    (0,_generated_rpc_js__WEBPACK_IMPORTED_MODULE_7__/* .registerClientSessionApiHandlers */ .wW)(this.connection, (sessionId) => {
      const session = sessions.get(sessionId);
      if (!session) throw new Error(`No session found for sessionId: ${sessionId}`);
      return session.clientSessionApis;
    });
    (0,_generated_rpc_js__WEBPACK_IMPORTED_MODULE_7__/* .registerClientGlobalApiHandlers */ .Lz)(this.connection, this.clientGlobalHandlers);
    this.connection.onRequest(
      "hooks.invoke",
      async (params) => {
        return await this.handleHooksInvoke(params);
      }
    );
    this.connection.onClose(() => {
      this.state = "disconnected";
    });
    this.connection.onError((_error) => {
      this.state = "disconnected";
    });
  }
  handleSessionEventNotification(notification) {
    if (typeof notification !== "object" || !notification || !("sessionId" in notification) || typeof notification.sessionId !== "string" || !("event" in notification)) {
      return;
    }
    const session = this.sessions.get(notification.sessionId);
    const event = notification.event;
    if (session) {
      session._dispatchEvent(event);
    }
  }
  handleSessionLifecycleNotification(notification) {
    if (typeof notification !== "object" || !notification || !("type" in notification) || typeof notification.type !== "string" || !("sessionId" in notification) || typeof notification.sessionId !== "string") {
      return;
    }
    const raw = notification;
    let metadata;
    if (raw.metadata && raw.metadata.startTime && raw.metadata.modifiedTime) {
      metadata = {
        startTime: new Date(raw.metadata.startTime),
        modifiedTime: new Date(raw.metadata.modifiedTime),
        summary: raw.metadata.summary
      };
    }
    const event = {
      type: raw.type,
      sessionId: raw.sessionId,
      metadata
    };
    const typedHandlers = this.typedLifecycleHandlers.get(event.type);
    if (typedHandlers) {
      for (const handler of typedHandlers) {
        try {
          handler(event);
        } catch {
        }
      }
    }
    for (const handler of this.sessionLifecycleHandlers) {
      try {
        handler(event);
      } catch {
      }
    }
  }
  async handleUserInputRequest(params) {
    if (!params || typeof params.sessionId !== "string" || typeof params.question !== "string") {
      throw new Error("Invalid user input request payload");
    }
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${params.sessionId}`);
    }
    const result = await session._handleUserInputRequest({
      question: params.question,
      choices: params.choices,
      allowFreeform: params.allowFreeform
    });
    return result;
  }
  async handleExitPlanModeRequest(params) {
    if (!params || typeof params.sessionId !== "string" || typeof params.summary !== "string" || !Array.isArray(params.actions) || typeof params.recommendedAction !== "string") {
      throw new Error("Invalid exit plan mode request payload");
    }
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${params.sessionId}`);
    }
    return await session._handleExitPlanModeRequest({
      summary: params.summary,
      planContent: params.planContent,
      actions: params.actions,
      recommendedAction: params.recommendedAction
    });
  }
  async handleAutoModeSwitchRequest(params) {
    if (!params || typeof params.sessionId !== "string") {
      throw new Error("Invalid auto mode switch request payload");
    }
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${params.sessionId}`);
    }
    const response = await session._handleAutoModeSwitchRequest({
      errorCode: params.errorCode,
      retryAfterSeconds: params.retryAfterSeconds
    });
    return { response };
  }
  async handleHooksInvoke(params) {
    if (!params || typeof params.sessionId !== "string" || typeof params.hookType !== "string") {
      throw new Error("Invalid hooks invoke payload");
    }
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${params.sessionId}`);
    }
    const output = await session._handleHooksInvoke(params.hookType, params.input);
    return { output };
  }
  async handleSystemMessageTransform(params) {
    if (!params || typeof params.sessionId !== "string" || !params.sections || typeof params.sections !== "object") {
      throw new Error("Invalid systemMessage.transform payload");
    }
    const session = this.sessions.get(params.sessionId);
    if (!session) {
      throw new Error(`Session not found: ${params.sessionId}`);
    }
    return await session._handleSystemMessageTransform(params.sections);
  }
}



/***/ },

/***/ 8256
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HW: () => (/* binding */ createCopilotRequestAdapter)
/* harmony export */ });
/* unused harmony exports CopilotRequestHandler, CopilotWebSocketCloseStatus, CopilotWebSocketForwarder, CopilotWebSocketHandler */
const sharedTextDecoder = new TextDecoder("utf-8", { fatal: false });
const sharedTextEncoder = new TextEncoder();
const kBridge = /* @__PURE__ */ Symbol("copilotWebSocketResponseBridge");
const kCompletion = /* @__PURE__ */ Symbol("copilotWebSocketCompletion");
const kOpen = /* @__PURE__ */ Symbol("copilotWebSocketOpen");
const kSuppressCloseOnDispose = /* @__PURE__ */ Symbol("copilotWebSocketSuppressCloseOnDispose");
const kHandle = /* @__PURE__ */ Symbol("copilotRequestHandle");
class CopilotWebSocketCloseStatus {
  constructor(description, errorCode, error) {
    this.description = description;
    this.errorCode = errorCode;
    this.error = error;
  }
  description;
  errorCode;
  error;
  static normalClosure = new CopilotWebSocketCloseStatus();
}
class CopilotWebSocketHandler {
  #response;
  #completion;
  #resolveCompletion;
  #closed = false;
  [kSuppressCloseOnDispose] = false;
  context;
  constructor(context) {
    this.context = context;
    const bridge = context[kBridge];
    if (!bridge) {
      throw new Error("WebSocket response bridge is not attached");
    }
    this.#response = bridge;
    this.#completion = new Promise((resolve) => {
      this.#resolveCompletion = resolve;
    });
  }
  async sendResponseMessage(data) {
    await this.#response.write(data);
  }
  async close(status = CopilotWebSocketCloseStatus.normalClosure) {
    if (this.#closed) {
      return;
    }
    this.#closed = true;
    if (status.error) {
      await this.#response.error({
        message: status.description ?? status.error.message,
        code: status.errorCode
      });
    } else {
      await this.#response.end();
    }
    this.#resolveCompletion(status);
  }
  async [Symbol.asyncDispose]() {
    if (!this[kSuppressCloseOnDispose] && !this.#closed) {
      await this.close(CopilotWebSocketCloseStatus.normalClosure);
    }
  }
  /** @internal */
  get [kCompletion]() {
    return this.#completion;
  }
  /** @internal */
  async [kOpen]() {
  }
}
class CopilotWebSocketForwarder extends CopilotWebSocketHandler {
  #upstream = null;
  constructor(context) {
    super(context);
  }
  sendRequestMessage(data) {
    if (this.#upstream?.readyState !== WebSocket.OPEN) {
      return;
    }
    this.#upstream.send(data);
  }
  /** @internal */
  async [kOpen]() {
    if (this.#upstream) {
      return;
    }
    const upstream = new WebSocket(this.context.url);
    upstream.binaryType = "arraybuffer";
    this.#upstream = upstream;
    upstream.addEventListener("message", (event) => {
      void this.sendResponseMessage(normalizeWsData(event.data)).catch(
        async (err) => {
          await this.close(
            new CopilotWebSocketCloseStatus(
              err instanceof Error ? err.message : String(err),
              void 0,
              err instanceof Error ? err : new Error(String(err))
            )
          );
        }
      );
    });
    upstream.addEventListener("close", () => {
      void this.close(CopilotWebSocketCloseStatus.normalClosure);
    });
    upstream.addEventListener("error", () => {
      void this.close(
        new CopilotWebSocketCloseStatus(
          "WebSocket error",
          void 0,
          new Error("WebSocket error")
        )
      );
    });
    await new Promise((resolve, reject) => {
      if (upstream.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }
      upstream.addEventListener("open", () => resolve(), { once: true });
      upstream.addEventListener("error", () => reject(new Error("WebSocket error")), {
        once: true
      });
    });
  }
  async close(status = CopilotWebSocketCloseStatus.normalClosure) {
    try {
      if (this.#upstream?.readyState === WebSocket.OPEN || this.#upstream?.readyState === WebSocket.CONNECTING) {
        this.#upstream?.close();
      }
    } catch {
    }
    await super.close(status);
  }
  async [Symbol.asyncDispose]() {
    try {
      await super[Symbol.asyncDispose]();
    } finally {
      try {
        this.#upstream?.close();
      } catch {
      }
    }
  }
}
class CopilotRequestHandler {
  sendRequest(request, ctx) {
    return fetch(request, { signal: ctx.signal });
  }
  openWebSocket(ctx) {
    return Promise.resolve(new CopilotWebSocketForwarder(ctx));
  }
  /** @internal */
  async [kHandle](exchange) {
    const bridge = new CopilotWebSocketResponseBridge(exchange);
    const ctx = {
      requestId: exchange.requestId,
      sessionId: exchange.sessionId,
      agentId: exchange.agentId,
      parentAgentId: exchange.parentAgentId,
      interactionType: exchange.interactionType,
      transport: exchange.transport,
      url: exchange.url,
      headers: exchange.headers,
      signal: exchange.signal,
      [kBridge]: bridge
    };
    if (exchange.transport === "websocket") {
      await this.#handleWebSocket(exchange, ctx);
    } else {
      await this.#handleHttp(exchange, ctx);
    }
  }
  async #handleHttp(exchange, ctx) {
    const request = await buildFetchRequest(exchange);
    const response = await this.sendRequest(request, ctx);
    await streamResponse(response, exchange);
  }
  async #handleWebSocket(exchange, ctx) {
    const handler = await this.openWebSocket(ctx);
    try {
      await handler[kOpen]();
      await ctx[kBridge].start();
      let cancelled;
      const clientSettled = (async () => {
        for await (const chunk of exchange.requestBody) {
          await handler.sendRequestMessage(decodeFrame(chunk));
        }
        return "client-complete";
      })().catch((err) => {
        cancelled = err;
        return "client-error";
      });
      const first = await Promise.race([
        clientSettled,
        handler[kCompletion].then(() => "server-done")
      ]);
      if (first === "client-error") {
        handler[kSuppressCloseOnDispose] = true;
        throw cancelled instanceof Error ? cancelled : new Error(String(cancelled));
      }
      if (first === "client-complete") {
        await handler.close(CopilotWebSocketCloseStatus.normalClosure);
        await handler[kCompletion];
        return;
      }
      const status = await handler[kCompletion];
      if (status.error) {
        throw status.error;
      }
    } finally {
      await handler[Symbol.asyncDispose]();
    }
  }
}
function createCopilotRequestAdapter(handler, getServerRpc) {
  const pending = /* @__PURE__ */ new Map();
  function getOrCreate(requestId) {
    let exchange = pending.get(requestId);
    if (!exchange) {
      exchange = new CopilotRequestExchange(requestId, getServerRpc);
      pending.set(requestId, exchange);
    }
    return exchange;
  }
  async function run(exchange) {
    try {
      await handler[kHandle](exchange);
      if (!exchange.finished) {
        await finalize(
          exchange,
          502,
          "Copilot request handler returned without finalising the response (call responseBody.end() or .error())."
        );
      }
    } catch (err) {
      if (exchange.cancelled || exchange.signal.aborted) {
        await finalize(exchange, 499, "Request cancelled by runtime", "cancelled");
        return;
      }
      const message = err instanceof Error ? err.message : String(err);
      await finalize(exchange, 502, message);
    } finally {
      pending.delete(exchange.requestId);
    }
  }
  return {
    async httpRequestStart(params) {
      const exchange = getOrCreate(params.requestId);
      exchange.setContext(params);
      void run(exchange);
      return {};
    },
    async httpRequestChunk(params) {
      routeChunk(getOrCreate(params.requestId), params);
      return {};
    }
  };
}
async function finalize(exchange, status, message, code) {
  if (exchange.finished) {
    return;
  }
  try {
    if (!exchange.started) {
      await exchange.startResponse({ status, headers: {} });
    }
    await exchange.errorResponse({ message, code });
  } catch {
  }
}
function routeChunk(exchange, params) {
  if (params.cancel) {
    exchange.pushCancel(params.cancelReason);
    return;
  }
  if (params.data && params.data.length > 0) {
    exchange.pushChunk(decodeChunkData(params.data, !!params.binary));
  }
  if (params.end) {
    exchange.pushEnd();
  }
}
class CopilotRequestExchange {
  requestId;
  sessionId;
  agentId;
  parentAgentId;
  interactionType;
  method = "GET";
  url = "";
  headers = {};
  transport = "http";
  #getServerRpc;
  #abort = new AbortController();
  #buffer = [];
  #waker = null;
  #drained = false;
  #started = false;
  #finished = false;
  #cancelled = false;
  constructor(requestId, getServerRpc) {
    this.requestId = requestId;
    this.#getServerRpc = getServerRpc;
  }
  /** Fill in the request context once the matching start frame arrives. */
  setContext(params) {
    this.sessionId = params.sessionId;
    this.agentId = params.agentId;
    this.parentAgentId = params.parentAgentId;
    this.interactionType = params.interactionType;
    this.method = params.method;
    this.url = params.url;
    this.headers = params.headers;
    this.transport = params.transport ?? "http";
  }
  get signal() {
    return this.#abort.signal;
  }
  get started() {
    return this.#started;
  }
  get finished() {
    return this.#finished;
  }
  get cancelled() {
    return this.#cancelled;
  }
  // --- Request body feed (driven by the adapter as chunk frames arrive) ---
  pushChunk(chunk) {
    this.#push({ chunk });
  }
  pushEnd() {
    this.#push({ end: true });
  }
  pushCancel(reason) {
    this.#cancelled = true;
    this.#abort.abort();
    this.#push({ cancel: { reason } });
  }
  #push(item) {
    this.#buffer.push(item);
    const w = this.#waker;
    this.#waker = null;
    w?.();
  }
  /**
   * Request body bytes, yielded as they arrive. A cancel frame surfaces as a
   * thrown error so the handler's upstream call is torn down.
   */
  get requestBody() {
    return {
      [Symbol.asyncIterator]: () => ({
        next: async () => {
          if (this.#drained) {
            return { value: void 0, done: true };
          }
          while (this.#buffer.length === 0) {
            await new Promise((resolve) => {
              this.#waker = resolve;
            });
          }
          const item = this.#buffer.shift();
          if (item.cancel) {
            this.#drained = true;
            throw new Error(
              item.cancel.reason ? `Request cancelled by runtime: ${item.cancel.reason}` : "Request cancelled by runtime"
            );
          }
          if (item.end) {
            this.#drained = true;
            return { value: void 0, done: true };
          }
          return { value: item.chunk ?? new Uint8Array(), done: false };
        }
      })
    };
  }
  // --- Response emit (driven by the handler). Strict state machine: ---
  // startResponse once -> 0..N writeResponse -> exactly one of
  // endResponse / errorResponse.
  async startResponse(init) {
    if (this.#started) {
      throw new Error("Copilot request response start() called twice.");
    }
    if (this.#finished) {
      throw new Error("Copilot request response already finished.");
    }
    this.#started = true;
    await this.#rpc().llmInference.httpResponseStart({
      requestId: this.requestId,
      status: init.status,
      statusText: init.statusText,
      headers: init.headers ?? {}
    });
  }
  async writeResponse(data) {
    if (this.#cancelled) {
      throw new Error("Copilot request was cancelled by the runtime.");
    }
    if (!this.#started) {
      throw new Error("Copilot request response write() called before start().");
    }
    if (this.#finished) {
      throw new Error("Copilot request response write() called after end()/error().");
    }
    const isString = typeof data === "string";
    await this.#rpc().llmInference.httpResponseChunk({
      requestId: this.requestId,
      data: isString ? data : Buffer.from(data).toString("base64"),
      binary: !isString,
      end: false
    });
  }
  async endResponse() {
    if (this.#finished) {
      return;
    }
    this.#finished = true;
    await this.#rpc().llmInference.httpResponseChunk({
      requestId: this.requestId,
      data: "",
      end: true
    });
  }
  async errorResponse(error) {
    if (this.#finished) {
      return;
    }
    this.#finished = true;
    await this.#rpc().llmInference.httpResponseChunk({
      requestId: this.requestId,
      data: "",
      end: true,
      error: { message: error.message, code: error.code }
    });
  }
  #rpc() {
    const r = this.#getServerRpc();
    if (!r) {
      throw new Error("Copilot request response used after RPC connection closed.");
    }
    return r;
  }
}
const FORBIDDEN_REQUEST_HEADERS = /* @__PURE__ */ (/* unused pure expression or super */ null && (new Set([
  "host",
  "connection",
  "content-length",
  "transfer-encoding",
  "keep-alive",
  "upgrade",
  "proxy-connection",
  "te",
  "trailer"
])));
async function buildFetchRequest(exchange) {
  const headers = new Headers();
  for (const [name, values] of Object.entries(exchange.headers)) {
    if (!values) {
      continue;
    }
    if (FORBIDDEN_REQUEST_HEADERS.has(name.toLowerCase())) {
      continue;
    }
    for (const value of values) {
      headers.append(name, value);
    }
  }
  const method = exchange.method.toUpperCase();
  const hasBody = method !== "GET" && method !== "HEAD";
  let body;
  if (hasBody) {
    const buffered = await drainAsync(exchange.requestBody);
    if (buffered.length > 0) {
      body = buffered;
    }
  } else {
    await drainAsync(exchange.requestBody);
  }
  return new Request(exchange.url, { method, headers, body });
}
async function drainAsync(stream) {
  const parts = [];
  let total = 0;
  for await (const chunk of stream) {
    parts.push(chunk);
    total += chunk.byteLength;
  }
  if (parts.length === 0) {
    return new Uint8Array(0);
  }
  if (parts.length === 1) {
    return parts[0];
  }
  const out = new Uint8Array(total);
  let off = 0;
  for (const part of parts) {
    out.set(part, off);
    off += part.byteLength;
  }
  return out;
}
async function streamResponse(response, exchange) {
  await exchange.startResponse({
    status: response.status,
    statusText: response.statusText || void 0,
    headers: headersToMultiMap(response.headers)
  });
  const body = response.body;
  if (!body) {
    await exchange.endResponse();
    return;
  }
  const reader = body.getReader();
  try {
    for (; ; ) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }
      if (value && value.byteLength > 0) {
        await exchange.writeResponse(value);
      }
    }
    await exchange.endResponse();
  } finally {
    reader.releaseLock();
  }
}
function headersToMultiMap(headers) {
  const out = {};
  headers.forEach((value, name) => {
    if (name.toLowerCase() === "set-cookie") {
      return;
    }
    const list = out[name] ?? (out[name] = []);
    list.push(value);
  });
  const setCookies = headers.getSetCookie();
  if (setCookies.length > 0) {
    out["set-cookie"] = setCookies;
  }
  return out;
}
function decodeChunkData(data, binary) {
  if (binary) {
    return new Uint8Array(Buffer.from(data, "base64"));
  }
  return sharedTextEncoder.encode(data);
}
function decodeFrame(chunk) {
  return sharedTextDecoder.decode(chunk);
}
function normalizeWsData(data) {
  if (typeof data === "string") {
    return data;
  }
  if (data instanceof Uint8Array) {
    return data;
  }
  if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  }
  return new Uint8Array();
}
class CopilotWebSocketResponseBridge {
  #exchange;
  #started = false;
  #completed = false;
  #serial = Promise.resolve();
  constructor(exchange) {
    this.#exchange = exchange;
  }
  /** Emit the 101 upgrade head now, acknowledging the WebSocket connect. */
  start() {
    return this.#run(false, () => Promise.resolve());
  }
  write(data) {
    return this.#run(false, () => this.#exchange.writeResponse(data));
  }
  end() {
    return this.#run(true, () => this.#exchange.endResponse());
  }
  error(error) {
    return this.#run(true, () => this.#exchange.errorResponse(error));
  }
  #run(terminal, action) {
    const task = this.#serial.then(async () => {
      if (this.#completed) {
        return;
      }
      if (!this.#started) {
        this.#started = true;
        await this.#exchange.startResponse({ status: 101, headers: {} });
      }
      if (terminal) {
        this.#completed = true;
      }
      await action();
    });
    this.#serial = task.catch(() => {
    });
    return task;
  }
}



/***/ },

/***/ 2293
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SO: () => (/* binding */ FactoryResumeError),
/* harmony export */   Ui: () => (/* binding */ isFactoryRunTerminal),
/* harmony export */   kO: () => (/* binding */ getFactoryDefinition)
/* harmony export */ });
/* unused harmony export defineFactory */
const FACTORY_TERMINAL_STATUSES = /* @__PURE__ */ new Set([
  "completed",
  "halted",
  "cancelled",
  "error"
]);
function isFactoryRunTerminal(status) {
  return FACTORY_TERMINAL_STATUSES.has(status);
}
const FACTORY_AGENT_OPTION_KEYS = [
  "label",
  "schema",
  "model",
  "reasoningEffort",
  "contextTier",
  "agent"
];
class FactoryResumeError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.name = "FactoryResumeError";
  }
  code;
}
const factoryHandles = /* @__PURE__ */ new WeakMap();
const MAX_FACTORY_TIMEOUT_SECONDS = 2147483647e-3;
const NANO_AIU_PER_AIU = 1e9;
function deepFreeze(value) {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const nested of Object.values(value)) {
      deepFreeze(nested);
    }
  }
  return value;
}
function validateLimits(meta) {
  const limits = meta.limits;
  if (!limits) {
    return;
  }
  for (const field of ["maxConcurrentSubagents", "maxTotalSubagents"]) {
    const value = limits[field];
    if (value !== void 0 && (!Number.isInteger(value) || value <= 0)) {
      throw new Error(`Factory limit "${field}" must be a positive integer`);
    }
  }
  if (limits.timeoutSeconds !== void 0 && (!Number.isFinite(limits.timeoutSeconds) || limits.timeoutSeconds <= 0)) {
    throw new Error(
      'Factory limit "timeoutSeconds" must be a positive, finite number of seconds'
    );
  }
  if (limits.timeoutSeconds !== void 0 && limits.timeoutSeconds > MAX_FACTORY_TIMEOUT_SECONDS) {
    throw new Error(
      `Factory limit "timeoutSeconds" must not exceed ${MAX_FACTORY_TIMEOUT_SECONDS} seconds`
    );
  }
  if (limits.maxAiCredits !== void 0) {
    const maxNanoAiu = Math.round(limits.maxAiCredits * NANO_AIU_PER_AIU);
    if (!Number.isFinite(limits.maxAiCredits) || limits.maxAiCredits <= 0 || !Number.isSafeInteger(maxNanoAiu) || maxNanoAiu < 1) {
      throw new Error(
        'Factory limit "maxAiCredits" must be a positive, finite number that rounds to a safe positive integer nano-AIU ceiling'
      );
    }
  }
}
function validatePhases(meta) {
  const titles = /* @__PURE__ */ new Set();
  for (const phase of meta.phases) {
    if (phase.title.trim().length === 0) {
      throw new Error("Factory phase titles must not be empty");
    }
    if (titles.has(phase.title)) {
      throw new Error(`Factory phase title "${phase.title}" is declared more than once`);
    }
    titles.add(phase.title);
  }
}
function defineFactory(definition) {
  const meta = deepFreeze(structuredClone(definition.meta));
  validateLimits(meta);
  validatePhases(meta);
  const stored = {
    meta,
    run: definition.run
  };
  const handle = Object.freeze({ meta });
  factoryHandles.set(handle, stored);
  return handle;
}
function getFactoryDefinition(handle) {
  const definition = factoryHandles.get(handle);
  if (!definition) {
    throw new Error("Invalid factory handle");
  }
  return definition;
}


/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "eF", 0, /* binding */ FACTORY_AGENT_OPTION_KEYS
/* harmony export */ ]);


/***/ },

/***/ 3228
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FfiRuntimeHost: () => (/* binding */ FfiRuntimeHost)
/* harmony export */ });
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9627);
Object(function webpackMissingModule() { const e = new Error("Cannot find module 'koffi'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5663);
/* harmony import */ var node_stream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9068);




const SYMBOL_PREFIX = "copilot_runtime_";
const KEEP_ALIVE_INTERVAL_MS = 1 << 30;
let loadedLibraryPath;
let loadedLibrary;
function loadLibrary(libraryPath) {
  if (loadedLibrary) {
    if (loadedLibraryPath !== libraryPath) {
      throw new Error(
        `An in-process FFI runtime library is already loaded from '${loadedLibraryPath}'; loading a different library from '${libraryPath}' in the same process is not supported.`
      );
    }
    return loadedLibrary;
  }
  const lib = Object(function webpackMissingModule() { const e = new Error("Cannot find module 'koffi'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(libraryPath);
  const outboundCallbackType = Object(function webpackMissingModule() { const e = new Error("Cannot find module 'koffi'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(
    Object(function webpackMissingModule() { const e = new Error("Cannot find module 'koffi'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(
      `void ${SYMBOL_PREFIX}outbound(void *userData, uint8 *bytesPtr, size_t bytesLen)`
    )
  );
  loadedLibrary = {
    hostStart: lib.func(`${SYMBOL_PREFIX}host_start`, "uint32", [
      "uint8*",
      "size_t",
      "uint8*",
      "size_t"
    ]),
    hostShutdown: lib.func(`${SYMBOL_PREFIX}host_shutdown`, "bool", ["uint32"]),
    connectionOpen: lib.func(`${SYMBOL_PREFIX}connection_open`, "uint32", [
      "uint32",
      outboundCallbackType,
      "void*",
      "uint8*",
      "size_t",
      "uint8*",
      "size_t",
      "uint8*",
      "size_t"
    ]),
    connectionWrite: lib.func(`${SYMBOL_PREFIX}connection_write`, "bool", [
      "uint32",
      "uint8*",
      "size_t"
    ]),
    connectionClose: lib.func(`${SYMBOL_PREFIX}connection_close`, "bool", ["uint32"]),
    outboundCallbackType
  };
  loadedLibraryPath = libraryPath;
  return loadedLibrary;
}
function buildArgvJson(cliEntrypoint, args) {
  const argv = cliEntrypoint.toLowerCase().endsWith(".js") ? ["node", cliEntrypoint, "--embedded-host", "--no-auto-update"] : [cliEntrypoint, "--embedded-host", "--no-auto-update"];
  argv.push(...args);
  return Buffer.from(JSON.stringify(argv), "utf8");
}
function buildEnvJson(environment) {
  if (!environment) {
    return null;
  }
  const obj = {};
  for (const [key, value] of Object.entries(environment)) {
    if (value !== void 0) {
      obj[key] = value;
    }
  }
  if (Object.keys(obj).length === 0) {
    return null;
  }
  return Buffer.from(JSON.stringify(obj), "utf8");
}
class FfiRuntimeHost {
  constructor(libraryPath, cliEntrypoint, environment, args) {
    this.libraryPath = libraryPath;
    this.cliEntrypoint = cliEntrypoint;
    this.environment = environment;
    this.args = args;
    this.lib = loadLibrary(libraryPath);
    this.receiveStream = new node_stream__WEBPACK_IMPORTED_MODULE_3__.PassThrough();
    this.sendStream = new node_stream__WEBPACK_IMPORTED_MODULE_3__.Writable({
      // connection_write enqueues the frame into the runtime's inbound channel and
      // returns immediately, so a synchronous FFI call is sufficient here.
      write: (chunk, _encoding, callback) => {
        try {
          this.writeFrame(chunk);
          callback();
        } catch (error) {
          callback(error);
        }
      }
    });
  }
  libraryPath;
  cliEntrypoint;
  environment;
  args;
  lib;
  serverId = 0;
  connectionId = 0;
  disposed = false;
  outboundCallback;
  keepAliveTimer;
  /** The stream JSON-RPC reads server→client frames from. */
  receiveStream;
  /** The stream JSON-RPC writes client→server frames to. */
  sendStream;
  /**
   * Resolves the cdylib next to the given CLI entrypoint and prepares the FFI host.
   * The cdylib is resolved as `prebuilds/<prebuildsFolder>/runtime.node` relative to
   * the entrypoint directory (the napi-rs `<node-platform>-<arch>` layout, e.g.
   * `linux-x64`). Throws if it cannot be found.
   */
  static create(cliEntrypoint, prebuildsFolder, environment, args) {
    const fullEntrypoint = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.resolve)(cliEntrypoint);
    const distDir = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.dirname)(fullEntrypoint);
    const libraryPath = (0,node_path__WEBPACK_IMPORTED_MODULE_2__.join)(distDir, "prebuilds", prebuildsFolder, "runtime.node");
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_0__.existsSync)(libraryPath)) {
      throw new Error(`FFI runtime library not found. Looked for '${libraryPath}'.`);
    }
    return new FfiRuntimeHost(libraryPath, fullEntrypoint, environment, args);
  }
  /**
   * Starts the in-process runtime: spawns the CLI worker via the native host,
   * waits for readiness, and opens the FFI JSON-RPC connection.
   */
  async start() {
    const argvJson = buildArgvJson(this.cliEntrypoint, this.args);
    const envJson = buildEnvJson(this.environment);
    this.serverId = await new Promise((resolvePromise, rejectPromise) => {
      this.lib.hostStart.async(
        argvJson,
        argvJson.length,
        envJson,
        envJson ? envJson.length : 0,
        (error, result) => {
          if (error) {
            rejectPromise(error);
          } else {
            resolvePromise(result);
          }
        }
      );
    });
    if (!this.serverId) {
      throw new Error(
        `copilot_runtime_host_start failed (library '${this.libraryPath}', entrypoint '${this.cliEntrypoint}').`
      );
    }
    this.outboundCallback = Object(function webpackMissingModule() { const e = new Error("Cannot find module 'koffi'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(
      (_userData, bytesPtr, bytesLen) => this.feedInbound(bytesPtr, bytesLen),
      this.lib.outboundCallbackType
    );
    this.connectionId = this.lib.connectionOpen(
      this.serverId,
      this.outboundCallback,
      null,
      null,
      0,
      null,
      0,
      null,
      0
    );
    if (!this.connectionId) {
      this.unregisterCallback();
      this.lib.hostShutdown(this.serverId);
      this.serverId = 0;
      throw new Error("copilot_runtime_connection_open failed.");
    }
    this.keepAliveTimer = setInterval(() => {
    }, KEEP_ALIVE_INTERVAL_MS);
  }
  writeFrame(frame) {
    if (this.disposed || !this.connectionId) {
      throw new Error("The in-process runtime connection is closed.");
    }
    const ok = this.lib.connectionWrite(this.connectionId, frame, frame.length);
    if (!ok) {
      throw new Error("Failed to write a frame to the in-process runtime connection.");
    }
  }
  /**
   * Native outbound (server→client) callback. koffi delivers it on the JS event loop
   * via a threadsafe function, so the frame is decoded and written straight to
   * {@link receiveStream}. The native pointer is only valid for this call, so the
   * bytes are copied out before returning.
   */
  feedInbound(bytesPtr, bytesLen) {
    try {
      if (this.disposed || this.receiveStream.writableEnded) {
        return;
      }
      const length = Number(bytesLen);
      if (!bytesPtr || length <= 0) {
        return;
      }
      const bytes = Object(function webpackMissingModule() { const e = new Error("Cannot find module 'koffi'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(
        bytesPtr,
        Object(function webpackMissingModule() { const e = new Error("Cannot find module 'koffi'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())("uint8", length, "Typed")
      );
      this.receiveStream.write(Buffer.from(bytes));
    } catch (error) {
      console.error(
        `In-process FFI inbound callback failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`
      );
    }
  }
  unregisterCallback() {
    if (this.outboundCallback === void 0) {
      return;
    }
    const callback = this.outboundCallback;
    this.outboundCallback = void 0;
    try {
      Object(function webpackMissingModule() { const e = new Error("Cannot find module 'koffi'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())(callback);
    } catch {
    }
  }
  /** Closes the FFI connection, shuts down the native host, and releases resources. */
  dispose() {
    if (this.disposed) {
      return;
    }
    this.disposed = true;
    if (this.keepAliveTimer !== void 0) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = void 0;
    }
    try {
      if (this.connectionId) {
        this.lib.connectionClose(this.connectionId);
        this.connectionId = 0;
      }
    } catch {
    }
    try {
      if (this.serverId) {
        this.lib.hostShutdown(this.serverId);
        this.serverId = 0;
      }
    } catch {
    }
    this.receiveStream.end();
    this.unregisterCallback();
  }
}



/***/ },

/***/ 1254
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Lz: () => (/* binding */ registerClientGlobalApiHandlers),
/* harmony export */   Wj: () => (/* binding */ createSessionRpc),
/* harmony export */   dO: () => (/* binding */ createServerRpc),
/* harmony export */   wW: () => (/* binding */ registerClientSessionApiHandlers),
/* harmony export */   yB: () => (/* binding */ createInternalServerRpc)
/* harmony export */ });
/* unused harmony export createInternalSessionRpc */
function createServerRpc(connection) {
  return {
    /**
     * Checks server responsiveness and returns protocol information.
     *
     * @param params Optional message to echo back to the caller.
     *
     * @returns Server liveness response, including the echoed message, current server timestamp, and protocol version.
     *
     * @experimental
     */
    ping: async (params) => connection.sendRequest("ping", params),
    /** @experimental */
    models: {
      /**
       * Lists Copilot models available to the authenticated user.
       *
       * @param params Optional GitHub token used to list models for a specific user instead of the global auth context.
       *
       * @returns List of Copilot models available to the resolved user, including capabilities and billing metadata.
       */
      list: async (params) => connection.sendRequest("models.list", params),
      /**
       * Returns the running runtime's complete catalog of well-known built-in model IDs without authentication or network access.
       *
       * @returns The running runtime's complete catalog of well-known built-in model IDs, including supported models and additional IDs with built-in metadata.
       */
      getBuiltInCatalog: async () => connection.sendRequest("models.getBuiltInCatalog", {})
    },
    /** @experimental */
    tools: {
      /**
       * Lists built-in tools available for a model.
       *
       * @param params Optional model identifier whose tool overrides should be applied to the listing.
       *
       * @returns Built-in tools available for the requested model, with their parameters and instructions.
       */
      list: async (params) => connection.sendRequest("tools.list", params)
    },
    /** @experimental */
    account: {
      /**
       * Gets Copilot quota usage for the authenticated user or supplied GitHub token.
       *
       * @param params Optional GitHub token used to look up quota for a specific user instead of the global auth context.
       *
       * @returns Quota usage snapshots for the resolved user, keyed by quota type.
       */
      getQuota: async (params) => connection.sendRequest("account.getQuota", params),
      /**
       * Gets the currently active authentication credentials from the global auth manager.
       *
       * @returns Current authentication state
       */
      getCurrentAuth: async () => connection.sendRequest("account.getCurrentAuth", {}),
      /**
       * Gets all authenticated users available for account switching.
       *
       * @returns List of all authenticated users
       */
      getAllUsers: async () => connection.sendRequest("account.getAllUsers", {}),
      /**
       * Stores authentication credentials after successful login (e.g., device code flow).
       *
       * @param params Credentials to store after successful authentication
       *
       * @returns Result of a successful login; throws on failure
       */
      login: async (params) => connection.sendRequest("account.login", params),
      /**
       * Removes user authentication from keychain and persisted state.
       *
       * @param params User to log out
       *
       * @returns Logout result indicating if more users remain
       */
      logout: async (params) => connection.sendRequest("account.logout", params)
    },
    /** @experimental */
    secrets: {
      /**
       * Registers secret values for redaction in session logs and exports. The SDK calls this to inject dynamically generated secret values (e.g., OIDC tokens).
       *
       * @param params Secret values to add to the redaction filter.
       *
       * @returns Confirmation that the secret values were registered.
       */
      addFilterValues: async (params) => connection.sendRequest("secrets.addFilterValues", params)
    },
    /** @experimental */
    mcp: {
      /** @experimental */
      config: {
        /**
         * Lists MCP servers from user configuration.
         *
         * @returns User-configured MCP servers, keyed by server name.
         */
        list: async () => connection.sendRequest("mcp.config.list", {}),
        /**
         * Adds an MCP server to user configuration.
         *
         * @param params MCP server name and configuration to add to user configuration.
         */
        add: async (params) => connection.sendRequest("mcp.config.add", params),
        /**
         * Updates an MCP server in user configuration.
         *
         * @param params MCP server name and replacement configuration to write to user configuration.
         */
        update: async (params) => connection.sendRequest("mcp.config.update", params),
        /**
         * Removes an MCP server from user configuration.
         *
         * @param params MCP server name to remove from user configuration.
         */
        remove: async (params) => connection.sendRequest("mcp.config.remove", params),
        /**
         * Enables MCP servers in user configuration for new sessions.
         *
         * @param params MCP server names to enable for new sessions.
         */
        enable: async (params) => connection.sendRequest("mcp.config.enable", params),
        /**
         * Disables MCP servers in user configuration for new sessions.
         *
         * @param params MCP server names to disable for new sessions.
         */
        disable: async (params) => connection.sendRequest("mcp.config.disable", params),
        /**
         * Drops this runtime process's in-memory MCP server-definition cache so the next MCP config read observes disk.
         */
        reload: async () => connection.sendRequest("mcp.config.reload", {})
      },
      /**
       * Discovers MCP servers from user, workspace, plugin, and builtin sources.
       *
       * @param params Optional working directory used as context for MCP server discovery.
       *
       * @returns MCP servers discovered from user, workspace, plugin, and built-in sources.
       */
      discover: async (params) => connection.sendRequest("mcp.discover", params)
    },
    /** @experimental */
    extensions: {
      /**
       * Discovers user and enabled installed-plugin extensions from persisted Copilot home state, including enablement preferences. Launch-scoped additional plugins are not included.
       *
       * @returns Extensions discovered from persisted Copilot home state and their effective loading mode. Launch-scoped additional plugins are not included.
       */
      discover: async () => connection.sendRequest("extensions.discover", {}),
      /**
       * Persistently enables extension IDs for future sessions. Active sessions are unchanged; use session.extensions.enable to update them.
       *
       * @param params Source-qualified extension identifiers to persistently enable for future sessions.
       */
      enable: async (params) => connection.sendRequest("extensions.enable", params),
      /**
       * Persistently disables extension IDs for future sessions. Active sessions are unchanged; use session.extensions.disable to update them.
       *
       * @param params Source-qualified extension identifiers to persistently disable for future sessions.
       */
      disable: async (params) => connection.sendRequest("extensions.disable", params)
    },
    /**
     * Registers the calling SDK client as the per-entrypoint extension launch provider. Call before creating any sessions. When omitted, the runtime temporarily falls back to its built-in Node launcher for backward compatibility.
     *
     * @experimental
     */
    registerExtensionLaunchProvider: async () => connection.sendRequest("registerExtensionLaunchProvider", {}),
    /** @experimental */
    plugins: {
      /**
       * Lists plugins installed in user/global state.
       *
       * @returns Plugins installed in user/global state.
       */
      list: async () => connection.sendRequest("plugins.list", {}),
      /**
       * Installs a plugin from a marketplace, GitHub repo, URL, or local path.
       *
       * @param params Plugin source and optional working directory for relative-path resolution.
       *
       * @returns Result of installing a plugin.
       */
      install: async (params) => connection.sendRequest("plugins.install", params),
      /**
       * Uninstalls an installed plugin.
       *
       * @param params Name (or spec) of the plugin to uninstall.
       */
      uninstall: async (params) => connection.sendRequest("plugins.uninstall", params),
      /**
       * Updates an installed plugin to its latest published version.
       *
       * @param params Name (or spec) of the plugin to update.
       *
       * @returns Result of updating a single plugin.
       */
      update: async (params) => connection.sendRequest("plugins.update", params),
      /**
       * Updates every installed plugin to its latest published version.
       *
       * @returns Result of updating all installed plugins.
       */
      updateAll: async () => connection.sendRequest("plugins.updateAll", {}),
      /**
       * Enables installed plugins for new sessions.
       *
       * @param params Plugin names (or specs) to enable.
       */
      enable: async (params) => connection.sendRequest("plugins.enable", params),
      /**
       * Disables installed plugins for new sessions.
       *
       * @param params Plugin names (or specs) to disable.
       */
      disable: async (params) => connection.sendRequest("plugins.disable", params),
      /** @experimental */
      marketplaces: {
        /**
         * Lists all registered marketplaces (defaults + user-added).
         *
         * @returns All registered marketplaces, including built-in defaults.
         */
        list: async () => connection.sendRequest("plugins.marketplaces.list", {}),
        /**
         * Registers a new marketplace from a source (owner/repo, URL, or local path).
         *
         * @param params Marketplace source and optional working directory for relative-path resolution.
         *
         * @returns Result of registering a new marketplace.
         */
        add: async (params) => connection.sendRequest("plugins.marketplaces.add", params),
        /**
         * Removes a previously-registered marketplace. When the marketplace has dependent plugins and `force` is not set, the marketplace is left intact and the result lists the dependents so the caller can decide whether to retry with `force=true`.
         *
         * @param params Name of the marketplace to remove and an optional force flag.
         *
         * @returns Outcome of the remove attempt, including dependent-plugin info when applicable.
         */
        remove: async (params) => connection.sendRequest("plugins.marketplaces.remove", params),
        /**
         * Lists plugins advertised by a registered marketplace.
         *
         * @param params Name of the marketplace whose plugin catalog to fetch.
         *
         * @returns Plugins advertised by the marketplace.
         */
        browse: async (params) => connection.sendRequest("plugins.marketplaces.browse", params),
        /**
         * Re-fetches one or all registered marketplace catalogs.
         *
         * @param params Optional marketplace name; omit to refresh all.
         *
         * @returns Result of refreshing one or more marketplace catalogs.
         */
        refresh: async (params) => connection.sendRequest("plugins.marketplaces.refresh", params)
      }
    },
    /** @experimental */
    skills: {
      /** @experimental */
      config: {
        /**
         * Replaces the global list of disabled skills.
         *
         * @param params Skill names to mark as disabled in global configuration, replacing any previous list.
         */
        setDisabledSkills: async (params) => connection.sendRequest("skills.config.setDisabledSkills", params)
      },
      /**
       * Discovers skills across global and project sources.
       *
       * @param params Optional project paths and additional skill directories to include in discovery.
       *
       * @returns Skills discovered across global and project sources.
       */
      discover: async (params) => connection.sendRequest("skills.discover", params),
      /**
       * Returns the canonical directories where a client may create skills that the runtime will recognize, including ones that do not exist yet. Project directories become active once created.
       *
       * @param params Optional project paths to enumerate.
       *
       * @returns Canonical locations where skills can be created so the runtime will recognize them.
       */
      getDiscoveryPaths: async (params) => connection.sendRequest("skills.getDiscoveryPaths", params)
    },
    /** @experimental */
    agents: {
      /**
       * Discovers custom agents across user, project, plugin, and remote sources.
       *
       * @param params Optional project paths to include in agent discovery.
       *
       * @returns Agents discovered across user, project, plugin, and remote sources.
       */
      discover: async (params) => connection.sendRequest("agents.discover", params),
      /**
       * Returns the canonical directories where a client may create custom agents that the runtime will recognize, including ones that do not exist yet. Project directories become active once created.
       *
       * @param params Optional project paths to include when enumerating agent discovery directories.
       *
       * @returns Canonical locations where custom agents can be created so the runtime will recognize them.
       */
      getDiscoveryPaths: async (params) => connection.sendRequest("agents.getDiscoveryPaths", params)
    },
    /** @experimental */
    instructions: {
      /**
       * Discovers instruction sources across user, repository, and plugin sources.
       *
       * @param params Optional project paths to include in instruction discovery.
       *
       * @returns Instruction sources discovered across user, repository, and plugin sources.
       */
      discover: async (params) => connection.sendRequest("instructions.discover", params),
      /**
       * Returns the canonical files and directories where a client may create custom instructions that the runtime will recognize, including ones that do not exist yet. Repository targets become active once created.
       *
       * @param params Optional project paths to include when enumerating instruction discovery targets.
       *
       * @returns Canonical files and directories where custom instructions can be created so the runtime will recognize them.
       */
      getDiscoveryPaths: async (params) => connection.sendRequest("instructions.getDiscoveryPaths", params)
    },
    /** @experimental */
    commands: {
      /**
       * Lists the well-known built-in slash commands that work as the first message in a new session (e.g. /plan, /env), without requiring an active session. Commands that depend on session state, authentication, or a synced session are omitted.
       *
       * @returns Slash commands available in the session, after applying any include/exclude filters.
       */
      list: async () => connection.sendRequest("commands.list", {})
    },
    /** @experimental */
    user: {
      /** @experimental */
      settings: {
        /**
         * Drops this runtime process's in-memory user settings cache so the next settings read observes disk.
         */
        reload: async () => connection.sendRequest("user.settings.reload", {}),
        /**
         * Lists every known user setting (settings.json overlaid with the legacy config.json, config.json wins), each with its effective value, its default, and whether it is at the default — so settings the user has never set still appear with their default value. Does not include repository- or enterprise-managed overrides that the runtime layers on top at session time.
         *
         * @returns Per-key metadata for every known user setting (settings.json overlaid with the legacy config.json, config.json wins), including settings left at their default. Excludes repository- and enterprise-managed overrides.
         */
        get: async () => connection.sendRequest("user.settings.get", {}),
        /**
         * Writes one or more user settings to settings.json, replacing each provided top-level key. A key whose value is null is removed. Returns the keys whose new value is shadowed by a legacy config.json entry (config.json wins on read), which the runtime leaves in place — such writes do not take effect until the legacy value is removed.
         *
         * @param params Partial user settings to write to settings.json. Each top-level key is written individually, replacing the existing value; a key whose value is null is removed.
         *
         * @returns Outcome of writing user settings.
         */
        set: async (params) => connection.sendRequest("user.settings.set", params)
      }
    },
    /** @experimental */
    managedSettings: {
      /**
       * Discovers device-managed settings from production MDM and managed-file sources, validates them against the runtime-owned managed-settings schema, and returns the canonical JSON without requiring a session.
       *
       * @returns Validated device-managed settings discovered before a session exists.
       */
      read: async () => connection.sendRequest("managedSettings.read", {})
    },
    /** @experimental */
    runtime: {
      /**
       * Gracefully shuts down an SDK-owned runtime. The response is sent only after cleanup completes; callers may then terminate the owned runtime process.
       */
      shutdown: async () => connection.sendRequest("runtime.shutdown", {})
    },
    /** @experimental */
    sessionFs: {
      /**
       * Registers an SDK client as the session filesystem provider.
       *
       * @param params Initial working directory, session-state path layout, and path conventions used to register the calling SDK client as the session filesystem provider.
       *
       * @returns Indicates whether the calling client was registered as the session filesystem provider.
       */
      setProvider: async (params) => connection.sendRequest("sessionFs.setProvider", params)
    },
    /** @experimental */
    llmInference: {
      /**
       * Registers an SDK client as the LLM inference callback provider.
       *
       * @returns Indicates whether the calling client was registered as the LLM inference provider.
       */
      setProvider: async () => connection.sendRequest("llmInference.setProvider", {}),
      /**
       * Delivers the response head (status + headers) for an in-flight request, correlated by the requestId the runtime supplied in httpRequestStart. Must be called exactly once per request before any httpResponseChunk frames.
       *
       * @param params Response head.
       *
       * @returns Whether the start frame was accepted.
       */
      httpResponseStart: async (params) => connection.sendRequest("llmInference.httpResponseStart", params),
      /**
       * Delivers a body byte range (or a terminal transport error) for an in-flight response, correlated by requestId. Set `end` true on the last chunk. When `error` is set the response terminates with a transport-level failure and the runtime raises an APIConnectionError.
       *
       * @param params A response body chunk or terminal error.
       *
       * @returns Whether the chunk was accepted.
       */
      httpResponseChunk: async (params) => connection.sendRequest("llmInference.httpResponseChunk", params)
    },
    /** @experimental */
    sessions: {
      /**
       * Creates or resumes a local session and returns the opened session ID.
       *
       * @param params Open a session by creating, resuming, attaching, connecting to a remote, or handing off.
       *
       * @returns Result of opening a session.
       */
      open: async (params) => connection.sendRequest("sessions.open", params),
      /**
       * Creates a new session by forking persisted history from an existing session.
       *
       * @param params Source session identifier to fork from, optional event-ID boundary, and optional friendly name for the new session.
       *
       * @returns Identifier and optional friendly name assigned to the newly forked session.
       */
      fork: async (params) => connection.sendRequest("sessions.fork", params),
      /**
       * Connects to an existing remote session and exposes it as an SDK session.
       *
       * @param params Remote session connection parameters.
       *
       * @returns Remote session connection result.
       */
      connect: async (params) => connection.sendRequest("sessions.connect", params),
      /**
       * Lists sessions, optionally filtered by source and working-directory context. Returned entries are discriminated by `isRemote`: local entries carry only the lightweight `LocalSessionMetadataValue` shape; remote entries carry the full `RemoteSessionMetadataValue` shape (repository, PR number, taskType, etc.).
       *
       * @param params Optional source filter, metadata-load limit, and context filter applied to the returned sessions.
       *
       * @returns Sessions matching the filter, ordered most-recently-modified first.
       */
      list: async (params) => connection.sendRequest("sessions.list", params),
      /**
       * Finds the local session bound to a GitHub task ID, if any.
       *
       * @param params GitHub task ID to look up.
       *
       * @returns ID of the local session bound to the given GitHub task, or omitted when none.
       */
      findByTaskId: async (params) => connection.sendRequest("sessions.findByTaskId", params),
      /**
       * Resolves a UUID prefix to a unique session ID, if exactly one session matches.
       *
       * @param params UUID prefix to resolve to a unique session ID.
       *
       * @returns Session ID matching the prefix, omitted when no unique match exists.
       */
      findByPrefix: async (params) => connection.sendRequest("sessions.findByPrefix", params),
      /**
       * Returns the most-relevant prior session for a given working-directory context.
       *
       * @param params Optional working-directory context used to score session relevance.
       *
       * @returns Most-relevant session ID for the supplied context, or omitted when no sessions exist.
       */
      getLastForContext: async (params) => connection.sendRequest("sessions.getLastForContext", params),
      /**
       * Returns the on-disk byte size of each session's workspace directory.
       *
       * @returns Map of sessionId -> on-disk size in bytes for each session's workspace directory.
       */
      getSizes: async () => connection.sendRequest("sessions.getSizes", {}),
      /**
       * Returns the subset of the supplied session IDs that are currently held by another running process.
       *
       * @param params Session IDs to test for live in-use locks.
       *
       * @returns Session IDs from the input set that are currently in use by another process.
       */
      checkInUse: async (params) => connection.sendRequest("sessions.checkInUse", params),
      /**
       * Closes a session: emits shutdown, flushes pending events, releases the in-use lock, and disposes the active session.
       *
       * @param params Session ID to close.
       *
       * @returns Closes a session: emits shutdown, flushes pending events to disk, releases the in-use lock, disposes the active session. Idempotent: succeeds even if the session is not currently active.
       */
      close: async (params) => connection.sendRequest("sessions.close", params),
      /**
       * Closes, deactivates, and deletes a set of sessions, returning the bytes freed per session.
       *
       * @param params Session IDs to close, deactivate, and delete from disk.
       *
       * @returns Map of sessionId -> bytes freed by removing the session's workspace directory.
       */
      bulkDelete: async (params) => connection.sendRequest("sessions.bulkDelete", params),
      /**
       * Deletes sessions older than the given threshold, with optional dry-run and exclusion list.
       *
       * @param params Age threshold and optional flags controlling which old sessions are pruned (or simulated when dryRun is true).
       *
       * @returns Outcome of the prune operation: deleted IDs, dry-run candidates, skipped IDs, total bytes freed, and the dry-run flag.
       */
      pruneOld: async (params) => connection.sendRequest("sessions.pruneOld", params),
      /**
       * Flushes a session's pending events to disk.
       *
       * @param params Session ID whose pending events should be flushed to disk.
       *
       * @returns Flush a session's pending events to disk. No-op when no writer exists for the session (e.g., already closed).
       */
      save: async (params) => connection.sendRequest("sessions.save", params),
      /**
       * Releases the in-use lock held by this process for a session.
       *
       * @param params Session ID whose in-use lock should be released.
       *
       * @returns Release the in-use lock held by this process for the given session. No-op when this process does not currently hold a lock for the session.
       */
      releaseLock: async (params) => connection.sendRequest("sessions.releaseLock", params),
      /**
       * Backfills missing summary and context fields on the supplied session metadata records.
       *
       * @param params Session metadata records to enrich with summary and context information.
       *
       * @returns The enriched metadata records, with summary and context fields backfilled where available. Sessions confirmed empty and unnamed are omitted.
       */
      enrichMetadata: async (params) => connection.sendRequest("sessions.enrichMetadata", params),
      /**
       * Reloads user, plugin, and (optionally) repo hooks on the active session.
       *
       * @param params Active session ID and an optional flag for deferring repo-level hooks until folder trust.
       *
       * @returns Reload all hooks (user, plugin, optionally repo) and apply them to the active session. Call after installing or removing plugins so their hooks take effect immediately. No-op when no active session matches the given sessionId.
       */
      reloadPluginHooks: async (params) => connection.sendRequest("sessions.reloadPluginHooks", params),
      /**
       * Loads previously-deferred repo-level hooks on the active session, returning queued startup prompts.
       *
       * @param params Active session ID whose deferred repo-level hooks should be loaded.
       *
       * @returns Queued repo-level startup prompts and the total hook command count after loading.
       */
      loadDeferredRepoHooks: async (params) => connection.sendRequest("sessions.loadDeferredRepoHooks", params),
      /**
       * Replaces the manager-wide additional plugins registered with the session manager.
       *
       * @param params Manager-wide additional plugins to register; replaces any previously-configured set.
       *
       * @returns Replace the manager-wide additional plugins. New session creations and subsequent hook reloads see the new set; already-running sessions keep their existing hook installation until the next reload.
       */
      setAdditionalPlugins: async (params) => connection.sendRequest("sessions.setAdditionalPlugins", params),
      /**
       * Attaches the runtime-managed remote-control singleton to a session, awaiting initial setup. If remote control is already attached to a different session, the singleton is transferred (preserving the underlying Mission Control connection). Returns the final status.
       *
       * @param params Parameters for attaching the remote-control singleton to a session.
       *
       * @returns Wrapper for the singleton's current status.
       */
      startRemoteControl: async (params) => connection.sendRequest("sessions.startRemoteControl", params),
      /**
       * Atomically rebinds the remote-control singleton to a different session, preserving the underlying Mission Control connection. When `expectedFromSessionId` is provided and does not match the singleton's current `attachedSessionId`, the transfer is rejected with `transferred: false` and the current status is returned unchanged.
       *
       * @param params Parameters for atomically rebinding the remote-control singleton.
       *
       * @returns Outcome of a transferRemoteControl call.
       */
      transferRemoteControl: async (params) => connection.sendRequest("sessions.transferRemoteControl", params),
      /**
       * Patches the steering state of the active remote-control singleton. When remote control is off, this is a no-op and the off status is returned. Today only `enabled: true` is actionable on the underlying exporter; passing `false` is reserved for future use.
       *
       * @param params Patch for the singleton's steering state.
       *
       * @returns Wrapper for the singleton's current status.
       */
      setRemoteControlSteering: async (params) => connection.sendRequest("sessions.setRemoteControlSteering", params),
      /**
       * Stops the remote-control singleton. When `expectedSessionId` is provided and does not match the singleton's current `attachedSessionId`, the stop is rejected with `stopped: false` and the current status is returned unchanged (unless `force` is set, in which case the singleton is unconditionally torn down).
       *
       * @param params Parameters for stopping the remote-control singleton.
       *
       * @returns Outcome of a stopRemoteControl call.
       */
      stopRemoteControl: async (params) => connection.sendRequest("sessions.stopRemoteControl", params),
      /**
       * Returns the current state of the remote-control singleton, including the attached session id and frontend URL when active.
       *
       * @returns Wrapper for the singleton's current status.
       */
      getRemoteControlStatus: async () => connection.sendRequest("sessions.getRemoteControlStatus", {})
    },
    /** @experimental */
    agentRegistry: {
      /**
       * Spawns a managed-server child with the supplied configuration and returns a discriminated-union result. The caller (typically the CLI controller) is responsible for attaching to the spawned child and sending any follow-up prompt. When the controller-local spawn gate is closed the server returns JSON-RPC MethodNotFound.
       *
       * @param params Inputs to spawn a managed-server child via the controller's spawn delegate.
       *
       * @returns Outcome of an agentRegistry.spawn call.
       */
      spawn: async (params) => connection.sendRequest("agentRegistry.spawn", params)
    }
  };
}
function createInternalServerRpc(connection) {
  return {
    /**
     * Performs the SDK server connection handshake and validates the optional connection token. Marked internal because this is JSON-RPC transport plumbing invoked automatically by an SDK client's own `connect()` wrapper, not a user-facing method. Stays internal as long as the SDK client owns the handshake; would only become public if the SDK ever exposed the raw schema surface to consumers without a connection wrapper.
     *
     * @param params Parameters for the `server.connect` handshake: an optional connection token and optional connection-level opt-ins (e.g. GitHub telemetry forwarding).
     *
     * @returns Handshake result reporting the server's protocol version and package version on success.
     *
     * @experimental
     */
    connect: async (params) => connection.sendRequest("connect", params),
    /** @experimental */
    sessions: {
      /**
       * Reads lightweight persisted metadata for one local session without opening it.
       *
       * @param params Session ID whose persisted metadata should be read.
       *
       * @returns Persisted local session metadata when the session exists.
       */
      getMetadata: async (params) => connection.sendRequest("sessions.getMetadata", params),
      /**
       * Lists recent local session IDs that contain user-visible history, omitting housekeeping-only sessions.
       *
       * @param params Limit for non-empty local session IDs.
       *
       * @returns Recent local session IDs that contain user-visible history.
       */
      listNonEmptySessionIds: async (params) => connection.sendRequest("sessions.listNonEmptySessionIds", params),
      /**
       * Computes the absolute path to a session's persisted events.jsonl file. Internal: filesystem paths are only meaningful in-process (CLI and runtime share a filesystem). Currently used by the CLI's contribution-graph feature to read historical events directly. Remote SDK consumers must not depend on this; a proper event-query API would replace it if the contribution graph ever needed to work over the wire.
       *
       * @param params Session ID whose event-log file path to compute.
       *
       * @returns Absolute path to the session's events.jsonl file on disk.
       */
      getEventFilePath: async (params) => connection.sendRequest("sessions.getEventFilePath", params),
      /**
       * Returns a session's persisted remote-steerable flag, if any has been recorded. Internal: this is CLI-specific book-keeping used by `--continue` / `--resume` to inherit the prior session's remote-steerable preference. SDK consumers that want similar behavior should manage their own persistence around start/stop calls rather than relying on this runtime-side flag.
       *
       * @param params Session ID to look up the persisted remote-steerable flag for.
       *
       * @returns The session's persisted remote-steerable flag, or omitted when no value has been persisted.
       */
      getPersistedRemoteSteerable: async (params) => connection.sendRequest("sessions.getPersistedRemoteSteerable", params),
      /**
       * Deletes one local session from disk after running the same lifecycle hooks as the session manager.
       *
       * @param params Session ID to delete from disk.
       */
      delete: async (params) => connection.sendRequest("sessions.delete", params),
      /**
       * Gets the dynamic-context board entry count associated with a session, when available. Internal: this exists solely so CLI telemetry events (`rem_spawn_gate`, `rem_consolidation_complete`) can pair START / END board counts around the detached rem-agent spawn. "Dynamic context board" is a runtime-internal concept that is not part of the public SDK contract; the long-term plan is to relocate the telemetry emission into the runtime so this method can be deleted entirely.
       *
       * @param params Session ID whose board entry count should be returned.
       *
       * @returns Dynamic-context board entry count, when available.
       */
      getBoardEntryCount: async (params) => connection.sendRequest("sessions.getBoardEntryCount", params),
      /**
       * Registers extension-provided tools on the given session, gated by an optional `enabled` callback. Returns an opaque unsubscribe function the caller must invoke to deregister the tools when the extension is torn down. Marked internal because `loader`, `enabled`, and the returned `unsubscribe` are in-process handles that cannot cross the JSON-RPC boundary. Disappears once extension discovery / launch / tool registration are owned by the runtime: SDK consumers will pass pure config (search paths, disabled ids) via `SessionOptions` and the runtime will resolve, launch, register, and tear down extensions itself.
       *
       * @param params Params to attach an extension loader's tools to a session.
       *
       * @returns Handle for releasing the extension tool registration.
       */
      registerExtensionToolsOnSession: async (params) => connection.sendRequest("sessions.registerExtensionToolsOnSession", params),
      /**
       * Attaches (or detaches) an in-process ExtensionController delegate for the given session, used by shared-API surfaces that need to query or modify the session's extension state. Pass `controller: undefined` to detach. Marked internal because the controller is an in-process object that cannot cross the JSON-RPC boundary. Disappears alongside `registerExtensionToolsOnSession`: once the runtime owns extension management, the public surface exposes list/enable/disable/reload as dedicated RPCs served by the runtime.
       *
       * @param params Params to attach or detach an in-process ExtensionController delegate.
       */
      configureSessionExtensions: async (params) => connection.sendRequest("sessions.configureSessionExtensions", params)
    }
  };
}
function createSessionRpc(connection, sessionId) {
  return {
    /**
     * Suspends the session while preserving persisted state for later resume.
     *
     * @experimental
     */
    suspend: async () => connection.sendRequest("session.suspend", { sessionId }),
    /**
     * Sends a user message to the session and returns its message ID.
     *
     * @param params Parameters for sending a user message to the session
     *
     * @returns Result of sending a user message
     *
     * @experimental
     */
    send: async (params) => connection.sendRequest("session.send", { sessionId, ...params }),
    /**
     * Sends zero or more user messages to the session in a single turn and returns their message IDs. All provided messages are appended to the conversation in order, then exactly one agent turn runs over the resulting history. When the list is empty, one turn runs over the existing history with no new user message. Remote-backed (Mission Control) sessions do not support this method and will return an error.
     *
     * @param params Parameters for sending zero or more user messages to the session in a single turn. Remote-backed (Mission Control) sessions do not support this method and will return an error.
     *
     * @returns Result of sending zero or more user messages
     *
     * @experimental
     */
    sendMessages: async (params) => connection.sendRequest("session.sendMessages", { sessionId, ...params }),
    /**
     * Aborts the current agent turn.
     *
     * @param params Parameters for aborting the current turn
     *
     * @returns Result of aborting the current turn
     *
     * @experimental
     */
    abort: async (params) => connection.sendRequest("session.abort", { sessionId, ...params }),
    /**
     * Interrupts the current main agent turn while leaving running background work (subagents, sidekicks, and promoted attached shells) alive. No-op when the main loop is not processing.
     *
     * @param params Parameters for interrupting the main agent turn.
     *
     * @returns Result of interrupting the main agent turn.
     *
     * @experimental
     */
    interruptMainTurn: async (params) => connection.sendRequest("session.interruptMainTurn", { sessionId, ...params }),
    /**
     * Cancels every running background agent (task-registry subagents plus sidekick agents) without interrupting the main agent loop. Promoted attached shells are left running.
     *
     * @returns The number of running background agents (task-registry agents) that were cancelled.
     *
     * @experimental
     */
    cancelAllBackgroundAgents: async () => connection.sendRequest("session.cancelAllBackgroundAgents", { sessionId }),
    /**
     * Shuts down the session and persists its final state. Awaits any deferred sessionEnd hooks before resolving so user-supplied hook scripts complete before the runtime tears down.
     *
     * @param params Parameters for shutting down the session
     *
     * @experimental
     */
    shutdown: async (params) => connection.sendRequest("session.shutdown", { sessionId, ...params }),
    /** @experimental */
    gitHubAuth: {
      /**
       * Gets authentication status and account metadata for the session.
       *
       * @returns Authentication status and account metadata for the session.
       */
      getStatus: async () => connection.sendRequest("session.gitHubAuth.getStatus", { sessionId }),
      /**
       * Updates the session's auth credentials used for outbound model and API requests.
       *
       * @param params New auth credentials to install on the session. Omit to leave credentials unchanged.
       *
       * @returns Indicates whether the credential update succeeded.
       */
      setCredentials: async (params) => connection.sendRequest("session.gitHubAuth.setCredentials", { sessionId, ...params })
    },
    /** @experimental */
    debug: {
      /**
       * Collects a redacted session debug log bundle into a local archive or staging directory. The runtime includes session-owned logs by default and accepts caller-provided diagnostic entries so host applications can add their own files without changing this API shape.
       *
       * @param params Options for collecting a redacted session debug bundle.
       *
       * @returns Result of collecting a redacted debug bundle.
       */
      collectLogs: async (params) => connection.sendRequest("session.debug.collectLogs", { sessionId, ...params })
    },
    /** @experimental */
    canvas: {
      /**
       * Lists canvases declared for the session.
       *
       * @returns Declared canvases available in this session.
       */
      list: async () => connection.sendRequest("session.canvas.list", { sessionId }),
      /**
       * Lists currently open canvas instances for the live session.
       *
       * @returns Live open-canvas snapshot.
       */
      listOpen: async () => connection.sendRequest("session.canvas.listOpen", { sessionId }),
      /**
       * Opens or focuses a canvas instance.
       *
       * @param params Canvas open parameters.
       *
       * @returns Open canvas instance snapshot.
       */
      open: async (params) => connection.sendRequest("session.canvas.open", { sessionId, ...params }),
      /**
       * Closes an open canvas instance.
       *
       * @param params Canvas close parameters.
       */
      close: async (params) => connection.sendRequest("session.canvas.close", { sessionId, ...params }),
      /** @experimental */
      action: {
        /**
         * Invokes an action on an open canvas instance.
         *
         * @param params Canvas action invocation parameters.
         *
         * @returns Canvas action invocation result.
         */
        invoke: async (params) => connection.sendRequest("session.canvas.action.invoke", { sessionId, ...params })
      }
    },
    /** @experimental */
    factory: {
      /**
       * Runs a registered factory by name at the top level.
       *
       * @param params Parameters for invoking a registered factory.
       *
       * @returns Complete current or terminal factory run envelope.
       */
      run: async (params) => connection.sendRequest("session.factory.run", { sessionId, ...params }),
      /**
       * Resumes a factory run using its persisted name, arguments, journal, and accounting.
       *
       * @param params Parameters for resuming a factory run from its persisted identity.
       *
       * @returns Resolved persisted factory identity and resumed run envelope.
       */
      resume: async (params) => connection.sendRequest("session.factory.resume", { sessionId, ...params }),
      /**
       * Gets the current or settled envelope for a factory run.
       *
       * @param params Parameters for retrieving a factory run.
       *
       * @returns Complete current or terminal factory run envelope.
       */
      getRun: async (params) => connection.sendRequest("session.factory.getRun", { sessionId, ...params }),
      /**
       * Lists durable factory runs for this session in creation order.
       *
       * @param params Parameters for paging factory runs.
       *
       * @returns A page of factory runs in durable creation order.
       */
      listRuns: async (params) => connection.sendRequest("session.factory.listRuns", { sessionId, ...params }),
      /**
       * Gets durable and live observability detail for one factory run.
       *
       * @param params Parameters for retrieving a factory run.
       *
       * @returns Full factory run observability detail.
       */
      getRunDetail: async (params) => connection.sendRequest("session.factory.getRunDetail", { sessionId, ...params }),
      /**
       * Pages durable progress for one factory run.
       *
       * @param params Parameters for paging factory progress.
       *
       * @returns A bidirectional page of factory progress.
       */
      getRunProgress: async (params) => connection.sendRequest("session.factory.getRunProgress", { sessionId, ...params }),
      /**
       * Requests cancellation of a factory run and returns its run envelope.
       *
       * @param params Parameters for cancelling a factory run.
       *
       * @returns Complete current or terminal factory run envelope.
       */
      cancel: async (params) => connection.sendRequest("session.factory.cancel", { sessionId, ...params }),
      /**
       * Records a batch of ordered factory progress lines.
       *
       * @param params Parameters for recording factory progress.
       *
       * @returns Acknowledgement that a factory request was accepted.
       */
      log: async (params) => connection.sendRequest("session.factory.log", { sessionId, ...params }),
      /**
       * Runs one factory-scoped subagent and returns its result.
       *
       * @param params Parameters for one factory-scoped subagent call.
       *
       * @returns Result of one factory-scoped subagent call.
       */
      agent: async (params) => connection.sendRequest("session.factory.agent", { sessionId, ...params }),
      /** @experimental */
      journal: {
        /**
         * Reads a memoized factory journal entry.
         *
         * @param params Parameters for reading a factory journal entry.
         *
         * @returns Result of reading a factory journal entry.
         */
        get: async (params) => connection.sendRequest("session.factory.journal.get", { sessionId, ...params }),
        /**
         * Stores a memoized factory journal entry.
         *
         * @param params Parameters for storing a factory journal entry.
         *
         * @returns Acknowledgement that a factory request was accepted.
         */
        put: async (params) => connection.sendRequest("session.factory.journal.put", { sessionId, ...params })
      }
    },
    /** @experimental */
    model: {
      /**
       * Gets the currently selected model for the session.
       *
       * @returns The currently selected model, reasoning effort, and context tier for the session. The context tier reflects `Session.getContextTier()`, restored from the session journal on resume.
       */
      getCurrent: async () => connection.sendRequest("session.model.getCurrent", { sessionId }),
      /**
       * Switches the session to a model and optional reasoning configuration.
       *
       * @param params Target model identifier and optional reasoning effort, summary, capability overrides, and context tier.
       *
       * @returns The model identifier active on the session after the switch.
       */
      switchTo: async (params) => connection.sendRequest("session.model.switchTo", { sessionId, ...params }),
      /**
       * Updates the session's reasoning effort without changing the selected model.
       *
       * @param params Reasoning effort level to apply to the currently selected model.
       *
       * @returns Update the session's reasoning effort without changing the selected model. Use `switchTo` instead when you also need to change the model. The runtime stores the effort on the session and applies it to subsequent turns.
       */
      setReasoningEffort: async (params) => connection.sendRequest("session.model.setReasoningEffort", { sessionId, ...params }),
      /**
       * Lists models available to this session using its own auth and integration context. Connected hosts (CLI TUI, GitHub App) should call this through the session client so remote sessions return the remote CLI's available models rather than the caller's.
       *
       * @param params Optional listing options.
       *
       * @returns The list of models available to this session.
       */
      list: async (params) => connection.sendRequest("session.model.list", { sessionId, ...params })
    },
    /** @experimental */
    mode: {
      /**
       * Gets the current agent interaction mode.
       *
       * @returns The session mode the agent is operating in
       */
      get: async () => connection.sendRequest("session.mode.get", { sessionId }),
      /**
       * Sets the current agent interaction mode.
       *
       * @param params Agent interaction mode to apply to the session.
       */
      set: async (params) => connection.sendRequest("session.mode.set", { sessionId, ...params })
    },
    /** @experimental */
    name: {
      /**
       * Gets the session's friendly name.
       *
       * @returns The session's friendly name, or null when not yet set.
       */
      get: async () => connection.sendRequest("session.name.get", { sessionId }),
      /**
       * Sets the session's friendly name.
       *
       * @param params New friendly name to apply to the session.
       */
      set: async (params) => connection.sendRequest("session.name.set", { sessionId, ...params }),
      /**
       * Persists an auto-generated session summary as the session's name when no user-set name exists.
       *
       * @param params Auto-generated session summary to apply as the session's name when no user-set name exists.
       *
       * @returns Indicates whether the auto-generated summary was applied as the session's name.
       */
      setAuto: async (params) => connection.sendRequest("session.name.setAuto", { sessionId, ...params })
    },
    /** @experimental */
    plan: {
      /**
       * Reads the session plan file from the workspace.
       *
       * @returns Existence, contents, and resolved path of the session plan file.
       */
      read: async () => connection.sendRequest("session.plan.read", { sessionId }),
      /**
       * Writes new content to the session plan file.
       *
       * @param params Replacement contents to write to the session plan file.
       */
      update: async (params) => connection.sendRequest("session.plan.update", { sessionId, ...params }),
      /**
       * Deletes the session plan file from the workspace.
       */
      delete: async () => connection.sendRequest("session.plan.delete", { sessionId }),
      /**
       * Reads todo rows from the session SQL database for plan rendering.
       *
       * @returns Todo rows read from the session SQL database. Empty when no session database is available.
       */
      readSqlTodos: async () => connection.sendRequest("session.plan.readSqlTodos", { sessionId }),
      /**
       * Reads todo rows AND dependency edges from the session SQL database for structured progress UI. Same defensive behavior as readSqlTodos — returns empty arrays when the database, tables, or columns aren't available. Clients should call this on session start and after every `session.todos_changed` event to refresh structured-UI rendering.
       *
       * @returns Todo rows + dependency edges read from the session SQL database.
       */
      readSqlTodosWithDependencies: async () => connection.sendRequest("session.plan.readSqlTodosWithDependencies", { sessionId })
    },
    /** @experimental */
    workspaces: {
      /**
       * Gets current workspace metadata for the session.
       *
       * @returns Current workspace metadata for the session, including its absolute filesystem path when available.
       */
      getWorkspace: async () => connection.sendRequest("session.workspaces.getWorkspace", { sessionId }),
      /**
       * Updates workspace metadata for a local session and returns the refreshed workspace.
       *
       * @param params Workspace metadata fields to update.
       *
       * @returns Current workspace metadata for the session, including its absolute filesystem path when available.
       */
      updateMetadata: async (params) => connection.sendRequest("session.workspaces.updateMetadata", { sessionId, ...params }),
      /**
       * Ensures a local session workspace exists and returns it.
       *
       * @param params Optional session context used when creating a local workspace.
       *
       * @returns Current workspace metadata for the session, including its absolute filesystem path when available.
       */
      ensure: async (params) => connection.sendRequest("session.workspaces.ensure", { sessionId, ...params }),
      /**
       * Lists files stored in the session workspace files directory.
       *
       * @returns Relative paths of files stored in the session workspace files directory.
       */
      listFiles: async () => connection.sendRequest("session.workspaces.listFiles", { sessionId }),
      /**
       * Reads a file from the session workspace files directory.
       *
       * @param params Relative path of the workspace file to read.
       *
       * @returns Contents of the requested workspace file as a UTF-8 string.
       */
      readFile: async (params) => connection.sendRequest("session.workspaces.readFile", { sessionId, ...params }),
      /**
       * Creates or overwrites a file in the session workspace files directory.
       *
       * @param params Relative path and UTF-8 content for the workspace file to create or overwrite.
       */
      createFile: async (params) => connection.sendRequest("session.workspaces.createFile", { sessionId, ...params }),
      /**
       * Lists workspace checkpoints in chronological order.
       *
       * @returns Workspace checkpoints in chronological order; empty when the workspace is not enabled.
       */
      listCheckpoints: async () => connection.sendRequest("session.workspaces.listCheckpoints", { sessionId }),
      /**
       * Reads the content of a workspace checkpoint by number.
       *
       * @param params Checkpoint number to read.
       *
       * @returns Checkpoint content as a UTF-8 string, or null when the checkpoint or workspace is missing.
       */
      readCheckpoint: async (params) => connection.sendRequest("session.workspaces.readCheckpoint", { sessionId, ...params }),
      /**
       * Adds a compaction summary checkpoint to the local session workspace.
       *
       * @param params Compaction summary checkpoint to persist.
       *
       * @returns Persisted summary metadata and refreshed workspace metadata.
       */
      addSummary: async (params) => connection.sendRequest("session.workspaces.addSummary", { sessionId, ...params }),
      /**
       * Truncates local workspace compaction summaries after a rollback.
       *
       * @param params Rollback point for local workspace summaries.
       *
       * @returns Current workspace metadata for the session, including its absolute filesystem path when available.
       */
      truncateSummaries: async (params) => connection.sendRequest("session.workspaces.truncateSummaries", { sessionId, ...params }),
      /**
       * Reads the autopilot objective state file from the local session workspace.
       *
       * @returns Autopilot objective file content, or null when missing.
       */
      readAutopilotObjective: async () => connection.sendRequest("session.workspaces.readAutopilotObjective", { sessionId }),
      /**
       * Writes the autopilot objective state file in the local session workspace.
       *
       * @param params Autopilot objective file content to persist.
       *
       * @returns Result of writing the autopilot objective file.
       */
      writeAutopilotObjective: async (params) => connection.sendRequest("session.workspaces.writeAutopilotObjective", { sessionId, ...params }),
      /**
       * Deletes the autopilot objective state file from the local session workspace.
       *
       * @returns Result of deleting the autopilot objective file.
       */
      deleteAutopilotObjective: async () => connection.sendRequest("session.workspaces.deleteAutopilotObjective", { sessionId }),
      /**
       * Checks whether the local session workspace has an autopilot objective state file.
       *
       * @returns Whether the autopilot objective file exists.
       */
      autopilotObjectiveExists: async () => connection.sendRequest("session.workspaces.autopilotObjectiveExists", { sessionId }),
      /**
       * Saves pasted content as a UTF-8 file in the session workspace.
       *
       * @param params Pasted content to save as a UTF-8 file in the session workspace.
       *
       * @returns Descriptor for the saved paste file, or null when the workspace is unavailable.
       */
      saveLargePaste: async (params) => connection.sendRequest("session.workspaces.saveLargePaste", { sessionId, ...params }),
      /**
       * Computes a diff for the session workspace. Never rejects for a busy session: a `session`-mode diff that cannot read the session's file-change captures falls back to an unstaged git diff with `isFallback: true` and reports why in `unavailableReason`.
       *
       * @param params Parameters for computing a workspace diff.
       *
       * @returns Workspace diff result for the requested mode.
       */
      diff: async (params) => connection.sendRequest("session.workspaces.diff", { sessionId, ...params })
    },
    /** @experimental */
    completions: {
      /**
       * Gets the characters that should trigger host-driven completions for the session. Empty disables host-driven completions (e.g. local sessions, or a relay host that does not advertise them).
       *
       * @returns Characters that, when typed in the composer, should trigger a `completions.request`. Empty when the session has no host-driven completions (e.g. local sessions, or a relay host that does not advertise `completionTriggerCharacters`).
       */
      getTriggerCharacters: async () => connection.sendRequest("session.completions.getTriggerCharacters", { sessionId }),
      /**
       * Requests host-driven completion items for the current composer input. Returns an empty list when the host has no items or does not support completions.
       *
       * @param params Request host-driven completions for the current composer input.
       *
       * @returns Host-driven completion items for the current composer input. Empty when the host returns no items or does not support completions.
       */
      request: async (params) => connection.sendRequest("session.completions.request", { sessionId, ...params })
    },
    /** @experimental */
    instructions: {
      /**
       * Gets instruction sources loaded for the session.
       *
       * @returns Instruction sources loaded for the session, in merge order.
       */
      getSources: async () => connection.sendRequest("session.instructions.getSources", { sessionId })
    },
    /** @experimental */
    fleet: {
      /**
       * Starts fleet mode by submitting the fleet orchestration prompt to the session.
       *
       * @param params Optional user prompt to combine with the fleet orchestration instructions.
       *
       * @returns Indicates whether fleet mode was successfully activated.
       */
      start: async (params) => connection.sendRequest("session.fleet.start", { sessionId, ...params })
    },
    /** @experimental */
    agent: {
      /**
       * Lists agents available to the session. Defaults to custom agents only; pass includeBuiltInAgents to include the effective built-in agents.
       *
       * @param params Controls whether built-in agents and authored prompt text are included.
       *
       * @returns Agents available to the session.
       */
      list: async (params) => connection.sendRequest("session.agent.list", { sessionId, ...params }),
      /**
       * Sets an in-memory authored prompt override for an available agent. For built-in agents, this replaces only the static base prompt while preserving runtime-owned dynamic prompt composition and behavior. The special `general-purpose` agent is not overrideable. Overrides are not persisted; resumed and forked sessions start without them, so the host must re-apply them.
       *
       * @param params An in-memory authored prompt override for an available agent.
       */
      setPrompt: async (params) => connection.sendRequest("session.agent.setPrompt", { sessionId, ...params }),
      /**
       * Gets the currently selected custom agent for the session.
       *
       * @returns The currently selected custom agent, or null when using the default agent.
       */
      getCurrent: async () => connection.sendRequest("session.agent.getCurrent", { sessionId }),
      /**
       * Selects a custom agent for subsequent turns in the session.
       *
       * @param params Name of the custom agent to select for subsequent turns.
       *
       * @returns The newly selected custom agent.
       */
      select: async (params) => connection.sendRequest("session.agent.select", { sessionId, ...params }),
      /**
       * Clears the selected custom agent and returns the session to the default agent.
       */
      deselect: async () => connection.sendRequest("session.agent.deselect", { sessionId }),
      /**
       * Reloads custom agent definitions and returns the refreshed list.
       *
       * @returns Custom agents available to the session after reloading definitions from disk.
       */
      reload: async () => connection.sendRequest("session.agent.reload", { sessionId })
    },
    /** @experimental */
    tasks: {
      /**
       * Starts a background agent task in the session.
       *
       * @param params Agent type, prompt, name, and optional description and model override for the new task.
       *
       * @returns Identifier assigned to the newly started background agent task.
       */
      startAgent: async (params) => connection.sendRequest("session.tasks.startAgent", { sessionId, ...params }),
      /**
       * Lists background tasks tracked by the session.
       *
       * @returns Background tasks currently tracked by the session.
       */
      list: async () => connection.sendRequest("session.tasks.list", { sessionId }),
      /**
       * Refreshes metadata for any detached background shells the runtime knows about.
       *
       * @returns Refresh metadata for any detached background shells the runtime knows about. Use after a long pause to pick up exit/output state for shells running outside the agent loop.
       */
      refresh: async () => connection.sendRequest("session.tasks.refresh", { sessionId }),
      /**
       * Waits for all in-flight background tasks and any follow-up turns to settle.
       *
       * @returns Wait until all in-flight background tasks (agents + shells) and any follow-up turns scheduled by their completions have settled. Returns when the runtime is fully drained or after an internal timeout (default 10 minutes; configurable via COPILOT_TASK_WAIT_TIMEOUT_SECONDS).
       */
      waitForPending: async () => connection.sendRequest("session.tasks.waitForPending", { sessionId }),
      /**
       * Returns progress information for a background task by ID.
       *
       * @param params Identifier of the background task to fetch progress for.
       *
       * @returns Progress information for the task, or null when no task with that ID is tracked.
       */
      getProgress: async (params) => connection.sendRequest("session.tasks.getProgress", { sessionId, ...params }),
      /**
       * Returns the first sync-waiting task that can currently be promoted to background mode.
       *
       * @returns The first sync-waiting task that can currently be promoted to background mode.
       */
      getCurrentPromotable: async () => connection.sendRequest("session.tasks.getCurrentPromotable", { sessionId }),
      /**
       * Promotes an eligible synchronously-waited task so it continues running in the background.
       *
       * @param params Identifier of the task to promote to background mode.
       *
       * @returns Indicates whether the task was successfully promoted to background mode.
       */
      promoteToBackground: async (params) => connection.sendRequest("session.tasks.promoteToBackground", { sessionId, ...params }),
      /**
       * Atomically promotes the first promotable sync-waiting task to background mode and returns it.
       *
       * @returns The promoted task as it now exists in background mode, omitted if no promotable task was waiting.
       */
      promoteCurrentToBackground: async () => connection.sendRequest("session.tasks.promoteCurrentToBackground", { sessionId }),
      /**
       * Cancels a background task.
       *
       * @param params Identifier of the background task to cancel.
       *
       * @returns Indicates whether the background task was successfully cancelled.
       */
      cancel: async (params) => connection.sendRequest("session.tasks.cancel", { sessionId, ...params }),
      /**
       * Removes a completed or cancelled background task from tracking.
       *
       * @param params Identifier of the completed or cancelled task to remove from tracking.
       *
       * @returns Indicates whether the task was removed. False when the task does not exist or is still running/idle.
       */
      remove: async (params) => connection.sendRequest("session.tasks.remove", { sessionId, ...params }),
      /**
       * Sends a message to a background agent task.
       *
       * @param params Identifier of the target agent task, message content, and optional sender agent ID.
       *
       * @returns Indicates whether the message was delivered, with an error message when delivery failed.
       */
      sendMessage: async (params) => connection.sendRequest("session.tasks.sendMessage", { sessionId, ...params })
    },
    /** @experimental */
    skills: {
      /**
       * Lists skills available to the session.
       *
       * @returns Skills available to the session, with their enabled state.
       */
      list: async () => connection.sendRequest("session.skills.list", { sessionId }),
      /**
       * Returns the skills that have been invoked during this session.
       *
       * @returns Skills invoked during this session, ordered by invocation time (most recent last).
       */
      getInvoked: async () => connection.sendRequest("session.skills.getInvoked", { sessionId }),
      /**
       * Enables a skill for the session.
       *
       * @param params Name of the skill to enable for the session.
       */
      enable: async (params) => connection.sendRequest("session.skills.enable", { sessionId, ...params }),
      /**
       * Disables a skill for the session.
       *
       * @param params Name of the skill to disable for the session.
       */
      disable: async (params) => connection.sendRequest("session.skills.disable", { sessionId, ...params }),
      /**
       * Reloads skill definitions for the session.
       *
       * @returns Diagnostics from reloading skill definitions, with warnings and errors as separate lists.
       */
      reload: async () => connection.sendRequest("session.skills.reload", { sessionId }),
      /**
       * Ensures the session's skill definitions have been loaded from disk.
       */
      ensureLoaded: async () => connection.sendRequest("session.skills.ensureLoaded", { sessionId })
    },
    /** @experimental */
    mcp: {
      /**
       * Lists MCP servers configured for the session, their connection status, and host-level state. The host-level state (disabled/filtered servers, failed/needs-auth/pending connections, mcp3p policy, full config) is empty/zero when no MCP host has been initialized for the session.
       *
       * @returns MCP servers configured for the session, with their connection status and host-level state.
       */
      list: async () => connection.sendRequest("session.mcp.list", { sessionId }),
      /**
       * Lists the tools exposed by a connected MCP server on this session's host. This performs a live `tools/list` request. Tool UI metadata is returned independently of whether MCP Apps rendering is enabled for the session.
       *
       * @param params Server name whose tool list should be returned.
       *
       * @returns Tools exposed by the connected MCP server. Throws when the server is not connected.
       */
      listTools: async (params) => connection.sendRequest("session.mcp.listTools", { sessionId, ...params }),
      /**
       * Enables an MCP server for the session.
       *
       * @param params Name of the MCP server to enable for the session.
       */
      enable: async (params) => connection.sendRequest("session.mcp.enable", { sessionId, ...params }),
      /**
       * Disables an MCP server for the session.
       *
       * @param params Name of the MCP server to disable for the session.
       */
      disable: async (params) => connection.sendRequest("session.mcp.disable", { sessionId, ...params }),
      /**
       * Reloads MCP server connections for the session.
       */
      reload: async () => connection.sendRequest("session.mcp.reload", { sessionId }),
      /**
       * Runs an MCP sampling inference on behalf of an MCP server.
       *
       * @param params Identifiers and raw MCP CreateMessageRequest params used to run a sampling inference.
       *
       * @returns Outcome of an MCP sampling execution: success result, failure error, or cancellation.
       */
      executeSampling: async (params) => connection.sendRequest("session.mcp.executeSampling", { sessionId, ...params }),
      /**
       * Cancels an in-flight MCP sampling execution by request ID.
       *
       * @param params The requestId previously passed to executeSampling that should be cancelled.
       *
       * @returns Indicates whether an in-flight sampling execution with the given requestId was found and cancelled.
       */
      cancelSamplingExecution: async (params) => connection.sendRequest("session.mcp.cancelSamplingExecution", { sessionId, ...params }),
      /**
       * Sets how environment-variable values supplied to MCP servers are resolved (direct or indirect).
       *
       * @param params Mode controlling how MCP server env values are resolved (`direct` or `indirect`).
       *
       * @returns Env-value mode recorded on the session after the update.
       */
      setEnvValueMode: async (params) => connection.sendRequest("session.mcp.setEnvValueMode", { sessionId, ...params }),
      /**
       * Removes the auto-managed `github` MCP server when present.
       *
       * @returns Indicates whether the auto-managed `github` MCP server was removed (false when nothing to remove).
       */
      removeGitHub: async () => connection.sendRequest("session.mcp.removeGitHub", { sessionId }),
      /**
       * Starts an individual MCP server on the live session. Omit `config` for a config-free start-by-name of an already-configured server (reuses the server's already-registered configuration); supply `config` to start from a caller-supplied configuration. Session-scoped and ephemeral: the server is added to this session's running set only and is reaped when the session ends. Does NOT modify persistent user configuration (`mcp.config.*`), so it does not affect future sessions. The server surfaces through `session.mcp.list` and the `session.mcp_servers_loaded` / `session.mcp_server_status_changed` events like any other server.
       *
       * @param params Server name and optional configuration for an individual MCP server start. Omit `config` for a config-free start-by-name of an already-configured server.
       */
      startServer: async (params) => connection.sendRequest("session.mcp.startServer", { sessionId, ...params }),
      /**
       * Restarts an individual MCP server on the live session (stops then starts). Omit `config` for a config-free restart-by-name of an already-configured server; supply `config` to restart with a replacement configuration. Session-scoped and ephemeral: does NOT modify persistent user configuration (`mcp.config.*`).
       *
       * @param params Server name and optional replacement configuration for an individual MCP server restart. Omit `config` for a config-free restart-by-name of an already-configured server.
       */
      restartServer: async (params) => connection.sendRequest("session.mcp.restartServer", { sessionId, ...params }),
      /**
       * Stops an individual MCP server on the session's host.
       *
       * @param params Server name for an individual MCP server stop.
       */
      stopServer: async (params) => connection.sendRequest("session.mcp.stopServer", { sessionId, ...params }),
      /**
       * Checks whether a named MCP server is currently running on the session's host.
       *
       * @param params Server name to check running status for.
       *
       * @returns Whether the named MCP server is running.
       */
      isServerRunning: async (params) => connection.sendRequest("session.mcp.isServerRunning", { sessionId, ...params }),
      /** @experimental */
      oauth: {
        /**
         * Resolves a pending MCP OAuth request with a host-provided token or cancellation. The pending request is emitted as mcp.oauth_required with the data necessary to authorize the request.
         *
         * @param params Pending MCP OAuth request ID and host-provided token or cancellation response.
         *
         * @returns Indicates whether the pending MCP OAuth response was accepted.
         */
        handlePendingRequest: async (params) => connection.sendRequest("session.mcp.oauth.handlePendingRequest", { sessionId, ...params }),
        /**
         * Notifies the session that MCP OAuth authentication succeeded and updated credentials were persisted, so cached tool definitions can be refreshed.
         *
         * @param params Identifies the MCP server whose persisted OAuth credentials were updated.
         */
        authenticationStateChanged: async (params) => connection.sendRequest("session.mcp.oauth.authenticationStateChanged", { sessionId, ...params }),
        /**
         * Starts OAuth authentication for a remote MCP server.
         *
         * @param params Remote MCP server name and optional overrides controlling reauthentication, OAuth client display name, callback success-page copy, and static OAuth client selection.
         *
         * @returns OAuth authorization URL the caller should open, or empty when cached tokens already authenticated the server.
         */
        login: async (params) => connection.sendRequest("session.mcp.oauth.login", { sessionId, ...params }),
        /**
         * Responds to a pending MCP OAuth authorization request by its request id.
         *
         * @param params Pending MCP OAuth request id to respond to.
         *
         * @returns Indicates whether the pending MCP OAuth response was accepted.
         */
        respond: async (params) => connection.sendRequest("session.mcp.oauth.respond", { sessionId, ...params })
      },
      /** @experimental */
      headers: {
        /**
         * Responds to a pending MCP dynamic headers refresh request. Hosts that subscribe to `mcp.headers_refresh_required` use this to provide short-lived per-server headers or to indicate that no dynamic headers are available for this refresh.
         *
         * @param params MCP headers refresh request id and the host response.
         *
         * @returns Indicates whether the pending MCP headers refresh response was accepted.
         */
        handlePendingHeadersRefreshRequest: async (params) => connection.sendRequest("session.mcp.headers.handlePendingHeadersRefreshRequest", { sessionId, ...params })
      },
      /** @experimental */
      apps: {
        /**
         * Fetch an MCP resource (typically a `ui://` MCP App bundle, per SEP-1865) from a connected server. Requires the `mcp-apps` session capability.
         *
         * @param params MCP server and resource URI to fetch.
         *
         * @returns Resource contents returned by the MCP server.
         */
        readResource: async (params) => connection.sendRequest("session.mcp.apps.readResource", { sessionId, ...params }),
        /**
         * List tools that an MCP App view is allowed to call (SEP-1865 visibility filter). Returns tools whose `_meta.ui.visibility` is unset (default `["model","app"]`) or includes `"app"`.
         *
         * @param params MCP server to list app-callable tools for.
         *
         * @returns App-callable tools from the named MCP server.
         */
        listTools: async (params) => connection.sendRequest("session.mcp.apps.listTools", { sessionId, ...params }),
        /**
         * Call an MCP tool from an MCP App view (SEP-1865). Enforces the visibility check that prevents an app iframe from invoking model-only tools. Returns the standard MCP `CallToolResult`.
         *
         * @param params MCP server, tool name, and arguments to invoke from an MCP App view.
         *
         * @returns Standard MCP CallToolResult
         */
        callTool: async (params) => connection.sendRequest("session.mcp.apps.callTool", { sessionId, ...params }),
        /**
         * Replace the host context returned to MCP App guests on `ui/initialize`. Hosts use this to advertise theme, locale, or other metadata to the guest UI.
         *
         * @param params Host context to advertise to MCP App guests.
         */
        setHostContext: async (params) => connection.sendRequest("session.mcp.apps.setHostContext", { sessionId, ...params }),
        /**
         * Read the current host context advertised to MCP App guests.
         *
         * @returns Current host context advertised to MCP App guests.
         */
        getHostContext: async () => connection.sendRequest("session.mcp.apps.getHostContext", { sessionId }),
        /**
         * Diagnose MCP Apps wiring for a specific MCP server. Reports the session capability, feature-flag state, advertised extension, and how many tools have `_meta.ui` populated.
         *
         * @param params MCP server to diagnose MCP Apps wiring for.
         *
         * @returns Diagnostic snapshot of MCP Apps wiring for the named server.
         */
        diagnose: async (params) => connection.sendRequest("session.mcp.apps.diagnose", { sessionId, ...params })
      },
      /** @experimental */
      resources: {
        /**
         * Fetch an MCP resource from a connected server by URI (proxies MCP `resources/read`).
         *
         * @param params MCP server and resource URI to fetch.
         *
         * @returns Resource contents returned by the MCP server.
         */
        read: async (params) => connection.sendRequest("session.mcp.resources.read", { sessionId, ...params }),
        /**
         * Enumerate one page of resources a connected MCP server exposes (proxies MCP `resources/list`). Pass `cursor` to continue from a prior result's `nextCursor`.
         *
         * @param params MCP server whose resources to enumerate.
         *
         * @returns One page of resources advertised by the named MCP server.
         */
        list: async (params) => connection.sendRequest("session.mcp.resources.list", { sessionId, ...params }),
        /**
         * Enumerate one page of resource templates a connected MCP server exposes (proxies MCP `resources/templates/list`). Pass `cursor` to continue from a prior result's `nextCursor`.
         *
         * @param params MCP server whose resource templates to enumerate.
         *
         * @returns One page of resource templates advertised by the named MCP server.
         */
        listTemplates: async (params) => connection.sendRequest("session.mcp.resources.listTemplates", { sessionId, ...params })
      }
    },
    /** @experimental */
    plugins: {
      /**
       * Lists plugins installed for the session.
       *
       * @returns Plugins installed for the session, with their enabled state and version metadata.
       */
      list: async () => connection.sendRequest("session.plugins.list", { sessionId }),
      /**
       * Reloads the session's plugin set, refreshing MCP servers, custom agents, hooks, and skills cache so SDK-driven changes via `server.plugins.*` take effect immediately.
       *
       * @param params Optional flags controlling which side effects the reload performs.
       */
      reload: async (params) => connection.sendRequest("session.plugins.reload", { sessionId, ...params })
    },
    /** @experimental */
    provider: {
      /**
       * Returns the provider endpoint and credentials the session is currently configured to talk to, so the caller can make inference calls directly against the same backend the session uses.
       *
       * @param params Optional model identifier to scope the endpoint snapshot to.
       *
       * @returns A snapshot of the provider endpoint the session is currently configured to talk to.
       */
      getEndpoint: async (params) => connection.sendRequest("session.provider.getEndpoint", { sessionId, ...params }),
      /**
       * Adds BYOK providers and/or models to the session's registry at runtime, extending the additive registry built from the session's `providers`/`models` options. Both fields are optional, so a call may add providers only, models only, or both. Within a single call providers are registered before models, so a model may reference a provider added in the same call; across calls a model may reference any provider already registered (from session creation or a prior add). A model whose referenced provider is not registered by the end of the call is rejected. Newly added models become selectable via `model.list` / `model.switchTo` and are inherited by sub-agents spawned afterwards.
       *
       * @param params BYOK providers and/or models to add to the session's registry at runtime. Both fields are optional; provide providers, models, or both.
       *
       * @returns The selectable model entries synthesized for the models added by this call.
       */
      add: async (params) => connection.sendRequest("session.provider.add", { sessionId, ...params })
    },
    /** @experimental */
    options: {
      /**
       * Patches the genuinely-mutable subset of session options.
       *
       * @param params Patch of mutable session options to apply to the running session.
       *
       * @returns Indicates whether the session options patch was applied successfully.
       */
      update: async (params) => connection.sendRequest("session.options.update", { sessionId, ...params })
    },
    /** @experimental */
    lsp: {
      /**
       * Loads the merged LSP configuration set for the session's working directory.
       *
       * @param params Parameters for (re)loading the merged LSP configuration set.
       */
      initialize: async (params) => connection.sendRequest("session.lsp.initialize", { sessionId, ...params })
    },
    /** @experimental */
    extensions: {
      /**
       * Lists extensions discovered for the session and their current status.
       *
       * @returns Extensions discovered for the session, with their current status.
       */
      list: async () => connection.sendRequest("session.extensions.list", { sessionId }),
      /**
       * Enables an extension for the session.
       *
       * @param params Source-qualified extension identifier to enable for the session.
       */
      enable: async (params) => connection.sendRequest("session.extensions.enable", { sessionId, ...params }),
      /**
       * Disables an extension for the session.
       *
       * @param params Source-qualified extension identifier to disable for the session.
       */
      disable: async (params) => connection.sendRequest("session.extensions.disable", { sessionId, ...params }),
      /**
       * Reloads extension definitions and processes for the session.
       */
      reload: async () => connection.sendRequest("session.extensions.reload", { sessionId }),
      /**
       * Push attachments into the next user-message turn from an extension. The host should surface them as composer pills and forward them via the next session.send call. Callable only by extension-owned connections.
       *
       * @param params Parameters for session.extensions.sendAttachmentsToMessage.
       */
      sendAttachmentsToMessage: async (params) => connection.sendRequest("session.extensions.sendAttachmentsToMessage", { sessionId, ...params })
    },
    /** @experimental */
    tools: {
      /**
       * Provides the result for a pending external tool call.
       *
       * @param params Pending external tool call request ID, with the tool result or an error describing why it failed.
       *
       * @returns Indicates whether the external tool call result was handled successfully.
       */
      handlePendingToolCall: async (params) => connection.sendRequest("session.tools.handlePendingToolCall", { sessionId, ...params }),
      /**
       * Resolves, builds, and validates the runtime tool list for the session.
       *
       * @returns Resolve, build, and validate the runtime tool list for this session. Subagent sessions and consumer flows that need an initialized tool set before `send` invoke this. Default base-class implementation is a no-op for sessions that don't support tool validation.
       */
      initializeAndValidate: async () => connection.sendRequest("session.tools.initializeAndValidate", { sessionId }),
      /**
       * Returns lightweight metadata for the session's currently initialized tools.
       *
       * @returns Current lightweight tool metadata snapshot for the session.
       */
      getCurrentMetadata: async () => connection.sendRequest("session.tools.getCurrentMetadata", { sessionId }),
      /**
       * Updates the current session's live subagent settings after user settings change. The persisted user settings remain the source of truth for future sessions.
       *
       * @param params Subagent settings to apply to the current session
       *
       * @returns Empty result after applying subagent settings
       */
      updateSubagentSettings: async (params) => connection.sendRequest("session.tools.updateSubagentSettings", { sessionId, ...params })
    },
    /** @experimental */
    commands: {
      /**
       * Lists slash commands available in the session.
       *
       * @param params Optional filters controlling which command sources to include in the listing.
       *
       * @returns Slash commands available in the session, after applying any include/exclude filters.
       */
      list: async (params) => connection.sendRequest("session.commands.list", { sessionId, ...params }),
      /**
       * Invokes a slash command in the session.
       *
       * @param params Slash command name and optional raw input string to invoke.
       *
       * @returns Result of invoking the slash command (text output, prompt to send to the agent, completion, or subcommand selection).
       */
      invoke: async (params) => connection.sendRequest("session.commands.invoke", { sessionId, ...params }),
      /**
       * Reports completion of a pending client-handled slash command.
       *
       * @param params Pending command request ID and an optional error if the client handler failed.
       *
       * @returns Indicates whether the pending client-handled command was completed successfully.
       */
      handlePendingCommand: async (params) => connection.sendRequest("session.commands.handlePendingCommand", { sessionId, ...params }),
      /**
       * Executes a slash command synchronously and returns any error.
       *
       * @param params Slash command name and argument string to execute synchronously.
       *
       * @returns Error message produced while executing the command, if any.
       */
      execute: async (params) => connection.sendRequest("session.commands.execute", { sessionId, ...params }),
      /**
       * Enqueues a slash command for FIFO processing on the local session.
       *
       * @param params Slash-prefixed command string to enqueue for FIFO processing.
       *
       * @returns Indicates whether the command was accepted into the local execution queue.
       */
      enqueue: async (params) => connection.sendRequest("session.commands.enqueue", { sessionId, ...params }),
      /**
       * Reports whether the host actually executed a queued command and whether to continue processing.
       *
       * @param params Queued-command request ID and the result indicating whether the host executed it (and whether to stop processing further queued commands).
       *
       * @returns Indicates whether the queued-command response was matched to a pending request.
       */
      respondToQueuedCommand: async (params) => connection.sendRequest("session.commands.respondToQueuedCommand", { sessionId, ...params })
    },
    /** @experimental */
    telemetry: {
      /**
       * Gets the telemetry engagement ID currently associated with the session, when available.
       *
       * @returns Telemetry engagement ID for the session, when available.
       */
      getEngagementId: async () => connection.sendRequest("session.telemetry.getEngagementId", { sessionId }),
      /**
       * Sets feature override key/value pairs to attach to subsequent telemetry events for the session.
       *
       * @param params Feature override key/value pairs to attach to subsequent telemetry events from this session.
       */
      setFeatureOverrides: async (params) => connection.sendRequest("session.telemetry.setFeatureOverrides", { sessionId, ...params })
    },
    /** @experimental */
    ui: {
      /**
       * Runs a transient no-tools model query against the current conversation context.
       *
       * @param params Transient question to answer without adding it to conversation history.
       *
       * @returns Transient answer generated from current conversation context.
       */
      ephemeralQuery: async (params) => connection.sendRequest("session.ui.ephemeralQuery", { sessionId, ...params }),
      /**
       * Requests structured input from a UI-capable client.
       *
       * @param params Prompt message and JSON schema describing the form fields to elicit from the user.
       *
       * @returns The elicitation response (accept with form values, decline, or cancel)
       */
      elicitation: async (params) => connection.sendRequest("session.ui.elicitation", { sessionId, ...params }),
      /**
       * Provides the user response for a pending elicitation request.
       *
       * @param params Pending elicitation request ID and the user's response (accept/decline/cancel + form values).
       *
       * @returns Indicates whether the elicitation response was accepted; false if it was already resolved by another client.
       */
      handlePendingElicitation: async (params) => connection.sendRequest("session.ui.handlePendingElicitation", { sessionId, ...params }),
      /**
       * Resolves a pending `user_input.requested` event with the user's response.
       *
       * @param params Request ID of a pending `user_input.requested` event and the user's response.
       *
       * @returns Indicates whether the pending UI request was resolved by this call.
       */
      handlePendingUserInput: async (params) => connection.sendRequest("session.ui.handlePendingUserInput", { sessionId, ...params }),
      /**
       * Resolves a pending `sampling.requested` event with a sampling result, or rejects it.
       *
       * @param params Request ID of a pending `sampling.requested` event and an optional sampling result payload (omit to reject).
       *
       * @returns Indicates whether the pending UI request was resolved by this call.
       */
      handlePendingSampling: async (params) => connection.sendRequest("session.ui.handlePendingSampling", { sessionId, ...params }),
      /**
       * Resolves a pending `auto_mode_switch.requested` event with the user's accept/decline decision.
       *
       * @param params Request ID of a pending `auto_mode_switch.requested` event and the user's response.
       *
       * @returns Indicates whether the pending UI request was resolved by this call.
       */
      handlePendingAutoModeSwitch: async (params) => connection.sendRequest("session.ui.handlePendingAutoModeSwitch", { sessionId, ...params }),
      /**
       * Resolves a pending `session_limits_exhausted.requested` event with the user's selected limit action.
       *
       * @param params Request ID of a pending `session_limits_exhausted.requested` event and the user's selected limit action.
       *
       * @returns Indicates whether the pending UI request was resolved by this call.
       */
      handlePendingSessionLimitsExhausted: async (params) => connection.sendRequest("session.ui.handlePendingSessionLimitsExhausted", { sessionId, ...params }),
      /**
       * Resolves a pending `exit_plan_mode.requested` event with the user's response.
       *
       * @param params Request ID of a pending `exit_plan_mode.requested` event and the user's response.
       *
       * @returns Indicates whether the pending UI request was resolved by this call.
       */
      handlePendingExitPlanMode: async (params) => connection.sendRequest("session.ui.handlePendingExitPlanMode", { sessionId, ...params }),
      /**
       * Registers an in-process handler for auto-mode-switch requests so the server bridge skips dispatch.
       *
       * @returns Register an in-process handler for `auto_mode_switch.requested` events. The caller still attaches the actual listener via the standard event-subscription mechanism; this registration solely tells the server bridge to skip its own dispatch (so a remote client doesn't race the in-process handler for the same requestId).
       */
      registerDirectAutoModeSwitchHandler: async () => connection.sendRequest("session.ui.registerDirectAutoModeSwitchHandler", { sessionId }),
      /**
       * Unregisters a previously-registered in-process auto-mode-switch handler by its opaque handle.
       *
       * @param params Opaque handle previously returned by `registerDirectAutoModeSwitchHandler` to release.
       *
       * @returns Indicates whether the handle was active and the registration count was decremented.
       */
      unregisterDirectAutoModeSwitchHandler: async (params) => connection.sendRequest("session.ui.unregisterDirectAutoModeSwitchHandler", { sessionId, ...params })
    },
    /** @experimental */
    permissions: {
      /**
       * Replaces selected permission policy fields (rules, paths, URLs, exclusions, allow-all flags) on the session.
       *
       * @param params Patch of permission policy fields to apply (omit a field to leave it unchanged).
       *
       * @returns Indicates whether the operation succeeded.
       */
      configure: async (params) => connection.sendRequest("session.permissions.configure", { sessionId, ...params }),
      /**
       * Provides a decision for a pending tool permission request.
       *
       * @param params Pending permission request ID and the decision to apply (approve/reject and scope).
       *
       * @returns Indicates whether the permission decision was applied; false when the request was already resolved.
       */
      handlePendingPermissionRequest: async (params) => connection.sendRequest("session.permissions.handlePendingPermissionRequest", { sessionId, ...params }),
      /**
       * Reconstructs the set of pending tool permission requests from the session's event history.
       *
       * @returns List of pending permission requests reconstructed from event history.
       */
      pendingRequests: async () => connection.sendRequest("session.permissions.pendingRequests", { sessionId }),
      /**
       * Enables or disables automatic approval of tool permission requests for the session.
       *
       * @param params Allow-all toggle for tool permission requests, with an optional telemetry source.
       *
       * @returns Indicates whether the operation succeeded.
       */
      setApproveAll: async (params) => connection.sendRequest("session.permissions.setApproveAll", { sessionId, ...params }),
      /**
       * Sets the allow-all permission mode for the session. Used by attach-mode clients (e.g. LocalRpcSession's `/allow-all` forwarder) to flip the target session's permission state. The `on` mode swaps in unrestricted path and URL managers and emits `session.permissions_changed` on transition; the `auto` mode keeps normal prompt paths active while attaching LLM safety recommendations. The result returns the authoritative post-mutation state so callers can update their local mirrors without racing the `session.permissions_changed` notification on the same wire.
       *
       * @param params Allow-all mode to apply for the session.
       *
       * @returns Indicates whether the operation succeeded and reports the post-mutation state.
       */
      setAllowAll: async (params) => connection.sendRequest("session.permissions.setAllowAll", { sessionId, ...params }),
      /**
       * Returns the current allow-all permission mode for the session.
       *
       * @returns Current allow-all permission mode.
       */
      getAllowAll: async () => connection.sendRequest("session.permissions.getAllowAll", { sessionId }),
      /**
       * Adds or removes session-scoped or location-scoped permission rules.
       *
       * @param params Scope and add/remove instructions for modifying session- or location-scoped permission rules.
       *
       * @returns Indicates whether the operation succeeded.
       */
      modifyRules: async (params) => connection.sendRequest("session.permissions.modifyRules", { sessionId, ...params }),
      /**
       * Sets whether the client wants permission prompts bridged into session events.
       *
       * @param params Toggles whether permission prompts should be bridged into session events for this client.
       *
       * @returns Indicates whether the operation succeeded.
       */
      setRequired: async (params) => connection.sendRequest("session.permissions.setRequired", { sessionId, ...params }),
      /**
       * Clears session-scoped tool permission approvals.
       *
       * @param params Clears session-scoped tool permission approvals, and optionally the location-scoped ones.
       *
       * @returns Indicates whether the operation succeeded.
       */
      resetSessionApprovals: async (params) => connection.sendRequest("session.permissions.resetSessionApprovals", { sessionId, ...params }),
      /**
       * Notifies the runtime that a permission prompt UI has been shown to the user.
       *
       * @param params Notification payload describing the permission prompt that the client just rendered.
       *
       * @returns Indicates whether the operation succeeded.
       */
      notifyPromptShown: async (params) => connection.sendRequest("session.permissions.notifyPromptShown", { sessionId, ...params }),
      /** @experimental */
      paths: {
        /**
         * Returns the session's allowed directories and primary working directory.
         *
         * @returns Snapshot of the session's allow-listed directories and primary working directory.
         */
        list: async () => connection.sendRequest("session.permissions.paths.list", { sessionId }),
        /**
         * Adds a directory to the session's allow-list.
         *
         * @param params Directory path to add to the session's allowed directories.
         *
         * @returns Indicates whether the operation succeeded.
         */
        add: async (params) => connection.sendRequest("session.permissions.paths.add", { sessionId, ...params }),
        /**
         * Updates the session's primary working directory used by the permission policy.
         *
         * @param params Directory path to set as the session's new primary working directory.
         *
         * @returns Indicates whether the operation succeeded.
         */
        updatePrimary: async (params) => connection.sendRequest("session.permissions.paths.updatePrimary", { sessionId, ...params }),
        /**
         * Reports whether a path falls within any of the session's allowed directories.
         *
         * @param params Path to evaluate against the session's allowed directories.
         *
         * @returns Indicates whether the supplied path is within the session's allowed directories.
         */
        isPathWithinAllowedDirectories: async (params) => connection.sendRequest("session.permissions.paths.isPathWithinAllowedDirectories", { sessionId, ...params }),
        /**
         * Reports whether a path falls within the session's workspace (primary) directory.
         *
         * @param params Path to evaluate against the session's workspace (primary) directory.
         *
         * @returns Indicates whether the supplied path is within the session's workspace directory.
         */
        isPathWithinWorkspace: async (params) => connection.sendRequest("session.permissions.paths.isPathWithinWorkspace", { sessionId, ...params })
      },
      /** @experimental */
      locations: {
        /**
         * Resolves the permission location key and type for a working directory.
         *
         * @param params Working directory to resolve into a location-permissions key.
         *
         * @returns Resolved location-permissions key and type.
         */
        resolve: async (params) => connection.sendRequest("session.permissions.locations.resolve", { sessionId, ...params }),
        /**
         * Applies persisted location-scoped tool approvals and allowed directories for a working directory to this session's permission service.
         *
         * @param params Working directory to load persisted location permissions for.
         *
         * @returns Summary of persisted location permissions applied to the session.
         */
        apply: async (params) => connection.sendRequest("session.permissions.locations.apply", { sessionId, ...params }),
        /**
         * Persists a tool approval for a permission location and applies its rules to this session's live permission service.
         *
         * @param params Location-scoped tool approval to persist.
         *
         * @returns Indicates whether the operation succeeded.
         */
        addToolApproval: async (params) => connection.sendRequest("session.permissions.locations.addToolApproval", { sessionId, ...params })
      },
      /** @experimental */
      folderTrust: {
        /**
         * Reports whether a folder is trusted according to the user's folder trust state.
         *
         * @param params Folder path to check for trust.
         *
         * @returns Folder trust check result.
         */
        isTrusted: async (params) => connection.sendRequest("session.permissions.folderTrust.isTrusted", { sessionId, ...params }),
        /**
         * Adds a folder to the user's trusted folders list.
         *
         * @param params Folder path to add to trusted folders.
         *
         * @returns Indicates whether the operation succeeded.
         */
        addTrusted: async (params) => connection.sendRequest("session.permissions.folderTrust.addTrusted", { sessionId, ...params })
      },
      /** @experimental */
      urls: {
        /**
         * Toggles the runtime's URL-permission policy between unrestricted and restricted modes.
         *
         * @param params Whether the URL-permission policy should run in unrestricted mode.
         *
         * @returns Indicates whether the operation succeeded.
         */
        setUnrestrictedMode: async (params) => connection.sendRequest("session.permissions.urls.setUnrestrictedMode", { sessionId, ...params })
      }
    },
    /**
     * Emits a user-visible session log event.
     *
     * @param params Message text, optional severity level, persistence flag, optional follow-up URL, and optional tip.
     *
     * @returns Identifier of the session event that was emitted for the log message.
     *
     * @experimental
     */
    log: async (params) => connection.sendRequest("session.log", { sessionId, ...params }),
    /** @experimental */
    metadata: {
      /**
       * Returns a snapshot of the session's identifying metadata, mode, agent, and remote info.
       *
       * @returns Point-in-time snapshot of slow-changing session identifier and state fields
       */
      snapshot: async () => connection.sendRequest("session.metadata.snapshot", { sessionId }),
      /**
       * Reports whether the local session is currently processing user/agent messages.
       *
       * @returns Indicates whether the local session is currently processing a turn or background continuation.
       */
      isProcessing: async () => connection.sendRequest("session.metadata.isProcessing", { sessionId }),
      /**
       * Returns a snapshot of activity flags for the session.
       *
       * @returns Current activity flags for the session.
       */
      activity: async () => connection.sendRequest("session.metadata.activity", { sessionId }),
      /**
       * Returns the token breakdown for the session's current context window for a given model.
       *
       * @param params Model identifier and token limits used to compute the context-info breakdown.
       *
       * @returns Token breakdown for the session's current context window, or null if uninitialized.
       */
      contextInfo: async (params) => connection.sendRequest("session.metadata.contextInfo", { sessionId, ...params }),
      /**
       * Returns the experimental per-source attribution breakdown of the session's current context window as a flat list of entries (skills, subagents, MCP servers, built-in tools, plugin rollups, system/tool-definition costs, with nesting via parentId), plus the successful compaction count. The heaviest individual messages are available separately via `metadata.getContextHeaviestMessages`. Returns null until the session has initialized its system prompt and tool metadata.
       *
       * @returns Per-source attribution breakdown for the session's current context window, or null if uninitialized.
       */
      getContextAttribution: async () => connection.sendRequest("session.metadata.getContextAttribution", { sessionId }),
      /**
       * Returns the largest individual messages currently in the session's context window, most-expensive first. Companion to `metadata.getContextAttribution`. Returns an empty list until the session has initialized.
       *
       * @param params Parameters for the heaviest-messages query.
       *
       * @returns The heaviest individual messages in the session's context window, most-expensive first.
       */
      getContextHeaviestMessages: async (params) => connection.sendRequest("session.metadata.getContextHeaviestMessages", { sessionId, ...params }),
      /**
       * Records a working-directory/git context change and emits a `session.context_changed` event. For a local session, a report whose `cwd` diverges from the session's current working directory is ignored (the call still succeeds but records nothing and emits no event): a local session's working directory is authoritative and is moved via `metadata.setWorkingDirectory` (or an SDK `session.resume` that supplies a `workingDirectory`), not by this method.
       *
       * @param params Updated working-directory/git context to record on the session.
       *
       * @returns Notify the session that its working directory context has changed. Emits a `session.context_changed` event so consumers (telemetry, OTel tracker, ACP, the timeline UI) can react. Use this when the host has detected a cwd/branch/repo change outside the session's normal lifecycle (e.g., after a shell command in interactive mode). For a local session, a report whose `cwd` diverges from the session's current working directory is ignored (the call still succeeds but records nothing and emits no event); move a local session's working directory via `metadata.setWorkingDirectory` instead.
       */
      recordContextChange: async (params) => connection.sendRequest("session.metadata.recordContextChange", { sessionId, ...params }),
      /**
       * Updates the session's working directory. For local sessions the target is validated first (an absolute path that exists on disk) and the permission primary directory is re-based; a rejected validation fails the call before any session state changes.
       *
       * @param params Absolute path to set as the session's new working directory. For local sessions the path must be absolute and exist on disk: it is validated before any session state changes, and a failing validation rejects the call with nothing mutated, persisted, or emitted. Remote sessions record the path as-is.
       *
       * @returns Update the session's working directory. Used by the host when the user explicitly changes cwd (e.g., the `/cd` slash command). The host is responsible for any related side-effects (file index, etc.); it does NOT change the process working directory (a session's cwd is per-session, not process-global). For local sessions the runtime validates the target first (an absolute path that exists on disk) and re-bases the permission primary directory; a rejected validation fails the call before anything is mutated, persisted, or emitted. Location-scoped permission rules are then re-keyed to the new directory (best-effort). Remote sessions only record the path.
       */
      setWorkingDirectory: async (params) => connection.sendRequest("session.metadata.setWorkingDirectory", { sessionId, ...params }),
      /**
       * Re-tokenizes the session's existing messages against a model and returns aggregate token totals.
       *
       * @param params Model identifier to use when re-tokenizing the session's existing messages.
       *
       * @returns Re-tokenize the session's existing messages against `modelId` and return the token totals. Useful for hosts that want an initial estimate of context usage on session resume, before the next agent turn fires `session.context_info_changed` events. Returns zeros for an empty session.
       */
      recomputeContextTokens: async (params) => connection.sendRequest("session.metadata.recomputeContextTokens", { sessionId, ...params })
    },
    /** @experimental */
    contentExclusion: {
      /**
       * Checks local file system absolute paths within the session working directory against its content-exclusion policy. Results preserve input order. Unsupported paths/filesystems and unavailable policy evaluation return available false, and callers must treat every requested path as excluded.
       *
       * @param params Local file system absolute paths within the session working directory to check against its content-exclusion policy.
       *
       * @returns Batch content-exclusion result. Callers must fail closed when policy evaluation is unavailable.
       */
      checkPaths: async (params) => connection.sendRequest("session.contentExclusion.checkPaths", { sessionId, ...params })
    },
    /** @experimental */
    shell: {
      /**
       * Starts a shell command and streams output through session notifications. The command runs as the leader of its own process group (POSIX) or in a dedicated job object (Windows), so a forced termination — via "shell.kill", the request timeout, or session disposal — signals that whole group/job rather than only the direct child. Two gaps are worth planning for: a command that exits on its own does not trigger that teardown, and on POSIX a descendant that moves itself into a new session or process group (for example via "setsid") leaves the signalled group, so either can leave a background process running.
       *
       * @param params Shell command to run, with optional working directory and timeout in milliseconds.
       *
       * @returns Identifier of the spawned process, used to correlate streamed output and exit notifications.
       */
      exec: async (params) => connection.sendRequest("session.shell.exec", { sessionId, ...params }),
      /**
       * Sends a signal to a shell process previously started via "shell.exec". The signal targets the command's whole process group (POSIX) or job object (Windows), so descendants still in that group are signalled too, not just the direct child. On POSIX a descendant that moved itself into a new session or process group (for example via "setsid") is no longer in the signalled group and survives.
       *
       * @param params Identifier of a process previously returned by "shell.exec" and the signal to send.
       *
       * @returns Indicates whether the signal was delivered; false if the process was unknown or already exited.
       */
      kill: async (params) => connection.sendRequest("session.shell.kill", { sessionId, ...params }),
      /**
       * Executes a user-requested shell command through the session runtime.
       *
       * @param params User-requested shell command and cancellation handle.
       *
       * @returns Result of a user-requested shell command.
       */
      executeUserRequested: async (params) => connection.sendRequest("session.shell.executeUserRequested", { sessionId, ...params }),
      /**
       * Cancels a user-requested shell command by request ID.
       *
       * @param params User-requested shell execution cancellation handle.
       *
       * @returns Cancellation result for a user-requested shell command.
       */
      cancelUserRequested: async (params) => connection.sendRequest("session.shell.cancelUserRequested", { sessionId, ...params })
    },
    /** @experimental */
    history: {
      /**
       * Compacts the session history to reduce context usage.
       *
       * @param params Optional compaction parameters.
       *
       * @returns Compaction outcome with the number of tokens and messages removed, summary text, and the resulting context window breakdown.
       */
      compact: async (params) => connection.sendRequest("session.history.compact", { sessionId, ...params }),
      /**
       * Truncates persisted session history to a specific event.
       *
       * @param params Identifier of the event to truncate to; this event and all later events are removed.
       *
       * @returns Number of events that were removed by the truncation.
       */
      truncate: async (params) => connection.sendRequest("session.history.truncate", { sessionId, ...params }),
      /**
       * Lists the user turns that the session can rewind to. Never rejects for a busy session: rewind reads need the session's file-change captures to be settled, so a session that still holds active work answers with `unavailableReason: "session-busy"` and no points, which the caller can retry.
       *
       * @returns Rewind points and file-change-tracking availability for the session.
       */
      listRewindPoints: async () => connection.sendRequest("session.history.listRewindPoints", { sessionId }),
      /**
       * Previews the files that a conversation-and-files rewind would restore.
       *
       * @param params Event boundary to preview for conversation-and-files rewind.
       *
       * @returns Files and aggregate changes for a prospective rewind.
       */
      previewRewind: async (params) => connection.sendRequest("session.history.previewRewind", { sessionId, ...params }),
      /**
       * Rewinds the session conversation, optionally restoring files changed by the discarded turns. Not crash-atomic: file restore and conversation truncation are separate stores, applied in that order, so a process crash between them can leave the workspace rewound while the conversation still contains the discarded turns. There is no recovery journal; re-running the same rewind is the recovery path for a crash before truncation lands, since file restore is idempotent (already-restored files are reported as skipped) and truncation is re-derived from the still-retained boundary event. After truncation lands that boundary no longer exists, so the same request is rejected; the only stage that can still be outstanding is snapshot pruning, whose failure leaves orphan snapshots the capture store tolerates. The reverse inconsistency cannot occur, because truncation is never applied before file restore succeeds.
       *
       * @param params Boundary and mode for rewinding session history.
       *
       * @returns Structured outcome of a rewind request.
       */
      rewind: async (params) => connection.sendRequest("session.history.rewind", { sessionId, ...params }),
      /**
       * Cancels any in-progress background compaction on a local session.
       *
       * @returns Indicates whether an in-progress background compaction was cancelled.
       */
      cancelBackgroundCompaction: async () => connection.sendRequest("session.history.cancelBackgroundCompaction", { sessionId }),
      /**
       * Aborts any in-progress manual compaction on a local session.
       *
       * @returns Indicates whether an in-progress manual compaction was aborted.
       */
      abortManualCompaction: async () => connection.sendRequest("session.history.abortManualCompaction", { sessionId }),
      /**
       * Produces a markdown summary of the session's conversation context for hand-off scenarios.
       *
       * @returns Markdown summary of the conversation context (empty when not available).
       */
      summarizeForHandoff: async () => connection.sendRequest("session.history.summarizeForHandoff", { sessionId }),
      /**
       * Clears the session's conversation history, keeping only system and developer messages, and seeds the fresh context window with a first user message. Must be called from inside a tool handler: the clear has to drop the results of the tool calls its wipe orphans, and it rejects when no tool call is in flight.
       *
       * @param params Parameters for clearing the conversation and seeding the window that replaces it.
       *
       * @returns What a successful clear removed. A clear that could not be applied rejects instead of reporting a count.
       */
      clearContext: async (params) => connection.sendRequest("session.history.clearContext", { sessionId, ...params })
    },
    /** @experimental */
    queue: {
      /**
       * Returns the local session's pending user-facing queued items and steering messages.
       *
       * @returns Snapshot of the session's pending queued items and immediate-steering messages.
       */
      pendingItems: async () => connection.sendRequest("session.queue.pendingItems", { sessionId }),
      /**
       * Moves an addressable queued item to a public visible position.
       *
       * @param params Parameters for moving a queued item by stable id.
       *
       * @returns Result of moving a queued item.
       */
      moveItem: async (params) => connection.sendRequest("session.queue.moveItem", { sessionId, ...params }),
      /**
       * Inserts a new queued message at a public visible position.
       *
       * @param params Parameters for inserting a queued message at a public visible position.
       *
       * @returns Result of inserting a queued message.
       */
      insertAt: async (params) => connection.sendRequest("session.queue.insertAt", { sessionId, ...params }),
      /**
       * Removes an addressable queued item by its stable id.
       *
       * @param params Parameters for removing a queued item by stable id.
       *
       * @returns Result of removing a queued item.
       */
      removeAt: async (params) => connection.sendRequest("session.queue.removeAt", { sessionId, ...params }),
      /**
       * Updates the text of an addressable single-message queue item.
       *
       * @param params Parameters for editing a single queued message.
       *
       * @returns Result of editing a queued message.
       */
      updateText: async (params) => connection.sendRequest("session.queue.updateText", { sessionId, ...params }),
      /**
       * Duplicates an addressable queued item immediately after its source.
       *
       * @param params Parameters for duplicating a queued item.
       *
       * @returns Result of duplicating a queued item.
       */
      duplicateAt: async (params) => connection.sendRequest("session.queue.duplicateAt", { sessionId, ...params }),
      /**
       * Acquires or releases the queued-lane drain pause.
       *
       * @param params Parameters for acquiring or releasing the queued-lane drain pause. Acquisition is exclusive and non-idempotent: `paused: true` against an already-paused session fails with `queue_already_paused`. The pause is never released automatically — it is not tied to the caller's lifetime, so a client that exits without sending `paused: false` leaves the lane frozen. Release is unowned: `paused: false` clears the pause for any caller, including one that never acquired it.
       */
      setDrainPaused: async (params) => connection.sendRequest("session.queue.setDrainPaused", { sessionId, ...params }),
      /**
       * Moves an addressable queued message into the live turn's steering lane.
       *
       * @param params Parameters for steering a queued message into a live turn.
       *
       * @returns Result of trying to steer a queued message into a live turn.
       */
      sendNow: async (params) => connection.sendRequest("session.queue.sendNow", { sessionId, ...params }),
      /**
       * Removes the most recently queued user-facing item (LIFO).
       *
       * @returns Indicates whether a user-facing pending item was removed.
       */
      removeMostRecent: async () => connection.sendRequest("session.queue.removeMostRecent", { sessionId }),
      /**
       * Clears all pending queued items on the local session.
       */
      clear: async () => connection.sendRequest("session.queue.clear", { sessionId })
    },
    /** @experimental */
    eventLog: {
      /**
       * Reads a batch of session events from a cursor, optionally waiting for new events. Supports tail-first reads via `direction: backward`.
       *
       * @param params Cursor, batch size, and optional long-poll/filter parameters for reading session events.
       *
       * @returns Batch of session events returned by a read, with cursor and continuation metadata.
       */
      read: async (params) => connection.sendRequest("session.eventLog.read", { sessionId, ...params }),
      /**
       * Returns a snapshot of the current tail cursor without consuming events.
       *
       * @returns Snapshot of the current tail cursor without returning any events. Use this when a consumer wants to subscribe to live events going forward without first paginating through the entire persisted history (which would happen if `read` were called without a cursor on a long-lived session).
       */
      tail: async () => connection.sendRequest("session.eventLog.tail", { sessionId }),
      /**
       * Registers consumer interest in an event type for runtime gating purposes.
       *
       * @param params Event type to register consumer interest for, used by runtime gating logic.
       *
       * @returns Opaque handle representing an event-type interest registration.
       */
      registerInterest: async (params) => connection.sendRequest("session.eventLog.registerInterest", { sessionId, ...params }),
      /**
       * Releases a consumer's previously-registered interest in an event type.
       *
       * @param params Opaque handle previously returned by `registerInterest` to release.
       *
       * @returns Indicates whether the operation succeeded.
       */
      releaseInterest: async (params) => connection.sendRequest("session.eventLog.releaseInterest", { sessionId, ...params })
    },
    /** @experimental */
    usage: {
      /**
       * Gets accumulated usage metrics for the session.
       *
       * @returns Accumulated session usage metrics, including premium request cost, token counts, model breakdown, and code-change totals.
       */
      getMetrics: async () => connection.sendRequest("session.usage.getMetrics", { sessionId })
    },
    /** @experimental */
    limitPrediction: {
      /**
       * Predicts an AI-credit session limit for the session's resolved model. Returns an unavailable result instead of falling back when the current model is unresolved auto.
       *
       * @param params Parameters for predicting an AI-credit session limit. Omitting `modelId` uses the session's currently selected model.
       *
       * @returns Prediction result. Available results include prediction details; unavailable results include an explicit reason.
       */
      predict: async (params) => connection.sendRequest("session.limitPrediction.predict", { sessionId, ...params })
    },
    /** @experimental */
    remote: {
      /**
       * Enables remote session export or steering.
       *
       * @param params Optional remote session mode ("off", "export", or "on"); defaults to enabling both export and remote steering.
       *
       * @returns GitHub URL for the session and a flag indicating whether remote steering is enabled.
       */
      enable: async (params) => connection.sendRequest("session.remote.enable", { sessionId, ...params }),
      /**
       * Disables remote session export and steering.
       */
      disable: async () => connection.sendRequest("session.remote.disable", { sessionId }),
      /**
       * Persists a remote-steerability change emitted by the host as a session event.
       *
       * @param params New remote-steerability state to persist as a `session.remote_steerable_changed` event.
       *
       * @returns Persist a steerability change as a `session.remote_steerable_changed` event. Used by the host (CLI / SDK consumer) when it has just finished enabling or disabling steering on a remote exporter that the runtime does not directly own.
       */
      notifySteerableChanged: async (params) => connection.sendRequest("session.remote.notifySteerableChanged", { sessionId, ...params })
    },
    /** @experimental */
    visibility: {
      /**
       * Returns the session's current Mission Control sharing status and shareable GitHub URL. Reflects whether the synced session is visible to repository readers ("repo") or restricted to its creator and collaborators ("unshared").
       *
       * @returns Current sharing status and shareable GitHub URL for a session.
       */
      get: async () => connection.sendRequest("session.visibility.get", { sessionId }),
      /**
       * Sets the session's Mission Control sharing status, controlling whether the synced session is visible to repository readers. Returns the effective status and shareable GitHub URL after the change.
       *
       * @param params Desired sharing status for the session.
       *
       * @returns Effective sharing status and shareable GitHub URL after updating session visibility.
       */
      set: async (params) => connection.sendRequest("session.visibility.set", { sessionId, ...params })
    },
    /** @experimental */
    schedule: {
      /**
       * Lists the session's currently active scheduled prompts.
       *
       * @returns Snapshot of the currently active recurring prompts for this session.
       */
      list: async () => connection.sendRequest("session.schedule.list", { sessionId }),
      /**
       * Removes a scheduled prompt by id.
       *
       * @param params Identifier of the scheduled prompt to remove.
       *
       * @returns Remove a scheduled prompt by id. The result entry is omitted if the id was unknown.
       */
      stop: async (params) => connection.sendRequest("session.schedule.stop", { sessionId, ...params })
    }
  };
}
function createInternalSessionRpc(connection, sessionId) {
  return {
    /**
     * Queues or sends an internal system notification to the session according to its passive policy.
     *
     * @param params Internal request for sending a system notification.
     *
     * @experimental
     */
    sendSystemNotification: async (params) => connection.sendRequest("session.sendSystemNotification", { sessionId, ...params }),
    /** @experimental */
    mcp: {
      /**
       * Reloads MCP server connections for the session with an explicit host-provided configuration.
       *
       * @param params Opaque MCP reload configuration.
       *
       * @returns MCP server startup filtering result.
       */
      reloadWithConfig: async (params) => connection.sendRequest("session.mcp.reloadWithConfig", { sessionId, ...params }),
      /**
       * Configures the built-in GitHub MCP server for the session's current auth context.
       *
       * @param params Opaque auth info used to configure GitHub MCP.
       *
       * @returns Result of configuring GitHub MCP.
       */
      configureGitHub: async (params) => connection.sendRequest("session.mcp.configureGitHub", { sessionId, ...params }),
      /**
       * Registers a pre-connected external MCP client (e.g. IDE) on the session's host. The caller retains lifecycle ownership of the client and transport. Marked internal because the `client` and `transport` arguments are in-process MCP SDK instances that cannot be serialized across the JSON-RPC boundary; once the CLI moves on top of the SDK, external clients will be expressed as transport configs the runtime can construct itself.
       *
       * @param params Registration parameters for an external MCP client.
       */
      registerExternalClient: async (params) => connection.sendRequest("session.mcp.registerExternalClient", { sessionId, ...params }),
      /**
       * Unregisters a previously registered external MCP client by server name. Marked internal as the paired companion of `registerExternalClient`: only in-process callers that registered a client this way can meaningfully unregister it. Disappears alongside `registerExternalClient`: once external clients are described to the runtime as config rather than handed in as instances, lifecycle (including deregistration) is owned entirely by the runtime.
       *
       * @param params Server name identifying the external client to remove.
       */
      unregisterExternalClient: async (params) => connection.sendRequest("session.mcp.unregisterExternalClient", { sessionId, ...params })
    },
    /** @experimental */
    settings: {
      /**
       * Returns a redacted snapshot of session runtime settings, with secrets and raw feature flags excluded. Internal: the runtime settings shape is a runtime-internal surface and is deliberately kept out of the public SDK, because consumers should not depend on the runtime's internal settings layout. It remains callable in-process and is expected to be reworked as the runtime internals are consolidated.
       *
       * @returns Redacted, serializable view of session runtime settings for SDK boundary consumers. Secrets and raw feature flags are intentionally excluded.
       */
      snapshot: async () => connection.sendRequest("session.settings.snapshot", { sessionId }),
      /**
       * Evaluates a named Rust-owned settings predicate without exposing raw feature flags. Internal: the raw feature-flag names and composition are runtime-internal, so this predicate-evaluation helper is kept out of the public SDK surface and is callable in-process only.
       *
       * @param params Named Rust-owned settings predicate to evaluate for this session.
       *
       * @returns Result of evaluating a Rust-owned settings predicate.
       */
      evaluatePredicate: async (params) => connection.sendRequest("session.settings.evaluatePredicate", { sessionId, ...params })
    },
    /** @experimental */
    queue: {
      /**
       * Returns the internal native queue snapshot for in-process session orchestration.
       *
       * @returns Internal snapshot of native queue state for local session orchestration.
       */
      snapshot: async () => connection.sendRequest("session.queue.snapshot", { sessionId }),
      /**
       * Reports whether the local session has native queued work pending.
       *
       * @returns Whether the native queue has pending work.
       */
      hasPending: async () => connection.sendRequest("session.queue.hasPending", { sessionId }),
      /**
       * Begins a native deferred-idle drain when background work has quiesced.
       *
       * @param params Inputs for starting a deferred-idle drain.
       *
       * @returns Whether a deferred-idle drain should run.
       */
      beginDeferredIdleDrain: async (params) => connection.sendRequest("session.queue.beginDeferredIdleDrain", { sessionId, ...params }),
      /**
       * Finishes a native deferred-idle drain and reports whether to drain queue work or emit idle.
       *
       * @param params Inputs for completing a deferred-idle drain.
       *
       * @returns Action selected by the native deferred-idle drain.
       */
      finishDeferredIdleDrain: async (params) => connection.sendRequest("session.queue.finishDeferredIdleDrain", { sessionId, ...params }),
      /**
       * Marks session.idle as deferred by native background work state.
       *
       * @param params Inputs for marking session.idle deferred in native state.
       */
      deferSessionIdle: async (params) => connection.sendRequest("session.queue.deferSessionIdle", { sessionId, ...params }),
      /**
       * Consumes queued native system notifications matching an internal filter.
       *
       * @param params Internal filter for consuming queued system notifications.
       *
       * @returns Indicates whether a user-facing pending item was removed.
       */
      consumeSystemNotifications: async (params) => connection.sendRequest("session.queue.consumeSystemNotifications", { sessionId, ...params }),
      /**
       * Enqueues the internal resume-pending wake item when orphan handling needs a follow-up turn.
       *
       * @returns Result of enqueueing the resume-pending wake item.
       */
      enqueueResumePending: async () => connection.sendRequest("session.queue.enqueueResumePending", { sessionId }),
      /**
       * Drains the native local-session work queue for in-process session orchestration.
       */
      process: async () => connection.sendRequest("session.queue.process", { sessionId })
    },
    /** @experimental */
    schedule: {
      /**
       * Hydrates the native schedule registry from persisted session events.
       */
      hydrate: async () => connection.sendRequest("session.schedule.hydrate", { sessionId }),
      /**
       * Reports whether the session has an active self-paced scheduled prompt.
       *
       * @returns Whether the session currently has an active self-paced schedule.
       */
      hasSelfPaced: async () => connection.sendRequest("session.schedule.hasSelfPaced", { sessionId }),
      /**
       * Registers a relative-interval scheduled prompt.
       *
       * @param params Register a relative-interval scheduled prompt.
       *
       * @returns Result of registering or re-arming a scheduled prompt.
       */
      add: async (params) => connection.sendRequest("session.schedule.add", { sessionId, ...params }),
      /**
       * Registers a recurring cron scheduled prompt.
       *
       * @param params Register a cron scheduled prompt.
       *
       * @returns Result of registering or re-arming a scheduled prompt.
       */
      addCron: async (params) => connection.sendRequest("session.schedule.addCron", { sessionId, ...params }),
      /**
       * Registers an absolute-time scheduled prompt.
       *
       * @param params Register an absolute-time scheduled prompt.
       *
       * @returns Result of registering or re-arming a scheduled prompt.
       */
      addAt: async (params) => connection.sendRequest("session.schedule.addAt", { sessionId, ...params }),
      /**
       * Registers a self-paced scheduled prompt.
       *
       * @param params Register a self-paced scheduled prompt.
       *
       * @returns Result of registering or re-arming a scheduled prompt.
       */
      addSelfPaced: async (params) => connection.sendRequest("session.schedule.addSelfPaced", { sessionId, ...params }),
      /**
       * Re-arms an active self-paced scheduled prompt.
       *
       * @param params Re-arm a self-paced scheduled prompt.
       *
       * @returns Result of registering or re-arming a scheduled prompt.
       */
      rearmSelfPaced: async (params) => connection.sendRequest("session.schedule.rearmSelfPaced", { sessionId, ...params })
    }
  };
}
function registerClientSessionApiHandlers(connection, getHandlers) {
  connection.onRequest("providerToken.getToken", async (params) => {
    const handler = getHandlers(params.sessionId).providerToken;
    if (!handler) throw new Error(`No providerToken handler registered for session: ${params.sessionId}`);
    return handler.getToken(params);
  });
  connection.onRequest("factory.execute", async (params) => {
    const handler = getHandlers(params.sessionId).factory;
    if (!handler) throw new Error(`No factory handler registered for session: ${params.sessionId}`);
    return handler.execute(params);
  });
  connection.onRequest("factory.abort", async (params) => {
    const handler = getHandlers(params.sessionId).factory;
    if (!handler) throw new Error(`No factory handler registered for session: ${params.sessionId}`);
    return handler.abort(params);
  });
  connection.onRequest("sessionFs.readFile", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.readFile(params);
  });
  connection.onRequest("sessionFs.writeFile", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.writeFile(params);
  });
  connection.onRequest("sessionFs.appendFile", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.appendFile(params);
  });
  connection.onRequest("sessionFs.exists", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.exists(params);
  });
  connection.onRequest("sessionFs.stat", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.stat(params);
  });
  connection.onRequest("sessionFs.mkdir", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.mkdir(params);
  });
  connection.onRequest("sessionFs.readdir", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.readdir(params);
  });
  connection.onRequest("sessionFs.readdirWithTypes", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.readdirWithTypes(params);
  });
  connection.onRequest("sessionFs.rm", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.rm(params);
  });
  connection.onRequest("sessionFs.rename", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.rename(params);
  });
  connection.onRequest("sessionFs.sqliteQuery", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.sqliteQuery(params);
  });
  connection.onRequest("sessionFs.sqliteTransaction", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.sqliteTransaction(params);
  });
  connection.onRequest("sessionFs.sqliteExists", async (params) => {
    const handler = getHandlers(params.sessionId).sessionFs;
    if (!handler) throw new Error(`No sessionFs handler registered for session: ${params.sessionId}`);
    return handler.sqliteExists(params);
  });
  connection.onRequest("canvas.open", async (params) => {
    const handler = getHandlers(params.sessionId).canvas;
    if (!handler) throw new Error(`No canvas handler registered for session: ${params.sessionId}`);
    return handler.open(params);
  });
  connection.onRequest("canvas.close", async (params) => {
    const handler = getHandlers(params.sessionId).canvas;
    if (!handler) throw new Error(`No canvas handler registered for session: ${params.sessionId}`);
    return handler.close(params);
  });
  connection.onRequest("canvas.action.invoke", async (params) => {
    const handler = getHandlers(params.sessionId).canvas;
    if (!handler) throw new Error(`No canvas handler registered for session: ${params.sessionId}`);
    return handler.invoke(params);
  });
}
function registerClientGlobalApiHandlers(connection, handlers) {
  connection.onRequest("extensionLaunchProvider.resolve", async (params) => {
    const handler = handlers.extensionLaunchProvider;
    if (!handler) throw new Error("No extensionLaunchProvider client-global handler registered");
    return handler.resolve(params);
  });
  connection.onRequest("llmInference.httpRequestStart", async (params) => {
    const handler = handlers.llmInference;
    if (!handler) throw new Error("No llmInference client-global handler registered");
    return handler.httpRequestStart(params);
  });
  connection.onRequest("llmInference.httpRequestChunk", async (params) => {
    const handler = handlers.llmInference;
    if (!handler) throw new Error("No llmInference client-global handler registered");
    return handler.httpRequestChunk(params);
  });
  connection.onNotification("gitHubTelemetry.event", async (params) => {
    const handler = handlers.gitHubTelemetry;
    if (!handler) return;
    await handler.event(params);
  });
}



/***/ },

/***/ 4127
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $6: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_1__.$6),
/* harmony export */   Z2: () => (/* reexport safe */ _toolSet_js__WEBPACK_IMPORTED_MODULE_2__.Z),
/* harmony export */   ue: () => (/* reexport safe */ _client_js__WEBPACK_IMPORTED_MODULE_0__.u)
/* harmony export */ });
/* harmony import */ var _client_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4600);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1142);
/* harmony import */ var _toolSet_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7225);
/* harmony import */ var _session_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3807);
/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2293);
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(5183);










/***/ },

/***/ 5231
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ getSdkProtocolVersion)
/* harmony export */ });
/* unused harmony export SDK_PROTOCOL_VERSION */
const SDK_PROTOCOL_VERSION = 3;
function getSdkProtocolVersion() {
  return SDK_PROTOCOL_VERSION;
}



/***/ },

/***/ 3807
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ CopilotSession)
/* harmony export */ });
/* harmony import */ var node_async_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4579);
/* harmony import */ var vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2067);
/* harmony import */ var vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _generated_rpc_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1254);
/* harmony import */ var _canvas_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5183);
/* harmony import */ var _telemetry_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(1880);
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1142);
/* harmony import */ var _factory_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2293);







function isFactoryResumeErrorCode(value) {
  return value === "not_found" || value === "non_resumable" || value === "already_active" || value === "factory_already_running" || value === "factory_limits_invalid" || value === "factory_session_disposed" || value === "factory_storage_unavailable" || value === "factory_storage_corrupt";
}
function copyDefinedFactoryAgentOption(source, target, key) {
  const value = source[key];
  if (value !== void 0) {
    target[key] = value;
  }
}
const factoryExecutionStore = new node_async_hooks__WEBPACK_IMPORTED_MODULE_0__.AsyncLocalStorage();
function throwIfFactoryExecutionIsActive() {
  if (factoryExecutionStore.getStore()?.active) {
    throw new Error(
      "factory.run and factory.resume are not allowed while a factory body is running on this call path."
    );
  }
}
function deserializeHookInput(raw) {
  if (!raw || typeof raw !== "object" || typeof raw.timestamp !== "number") {
    return raw;
  }
  const obj = raw;
  const { cwd, stop_hook_active, ...rest } = obj;
  return {
    ...rest,
    timestamp: new Date(obj.timestamp),
    workingDirectory: cwd,
    ...stop_hook_active === void 0 ? {} : { stopHookActive: stop_hook_active }
  };
}
function isOpenCanvasInstance(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const instance = value;
  return typeof instance.instanceId === "string" && instance.instanceId.length > 0 && typeof instance.extensionId === "string" && instance.extensionId.length > 0 && typeof instance.canvasId === "string" && instance.canvasId.length > 0;
}
const FACTORY_LOG_FLUSH_DELAY_MS = 10;
const MAX_FACTORY_FANOUT_ITEMS = 4096;
function assertFactoryFanoutSize(kind, size) {
  if (size > MAX_FACTORY_FANOUT_ITEMS) {
    throw new Error(
      `${kind}() accepts at most ${MAX_FACTORY_FANOUT_ITEMS} items; got ${size}.`
    );
  }
}
async function runFactoryParallel(thunks) {
  if (!Array.isArray(thunks)) {
    throw new Error(
      "parallel() expects an array of functions, not promises. Wrap each call: () => agent(...)"
    );
  }
  assertFactoryFanoutSize("parallel", thunks.length);
  if (thunks.some((thunk) => typeof thunk !== "function")) {
    throw new Error(
      "parallel() expects an array of functions, not promises. Wrap each call: () => agent(...)"
    );
  }
  return Promise.all(
    thunks.map(
      (thunk) => Promise.resolve().then(() => thunk()).catch((error) => {
        if (isFactoryFatalError(error)) {
          throw error;
        }
        return null;
      })
    )
  );
}
async function runFactoryPipeline(items, ...stages) {
  if (!Array.isArray(items)) {
    throw new Error("pipeline(items, ...stages): items must be an array");
  }
  assertFactoryFanoutSize("pipeline", items.length);
  return Promise.all(
    items.map(async (item, index) => {
      let previous = item;
      for (const stage of stages) {
        try {
          previous = await stage(previous, item, index);
        } catch (error) {
          if (isFactoryFatalError(error)) {
            throw error;
          }
          return null;
        }
      }
      return previous;
    })
  );
}
class FactoryProgressBuffer {
  constructor(send) {
    this.send = send;
  }
  send;
  nextSeq = 0;
  pending = [];
  flushTimer;
  flushTail = Promise.resolve();
  flushError;
  flushFailed = false;
  closed = false;
  enqueue(kind, text) {
    if (this.closed) {
      throw new Error("Cannot log after the factory run has settled");
    }
    this.pending.push({ seq: this.nextSeq++, kind, text });
    this.scheduleFlush();
  }
  async flush() {
    this.clearFlushTimer();
    const lines = this.pending.splice(0);
    if (lines.length > 0) {
      this.flushTail = this.flushTail.then(async () => {
        try {
          await this.send(lines);
        } catch (error) {
          if (!this.flushFailed) {
            this.flushFailed = true;
            this.flushError = error;
          }
        }
      });
    }
    await this.flushTail;
    if (this.flushFailed) {
      throw this.flushError;
    }
  }
  async close() {
    this.closed = true;
    this.clearFlushTimer();
    const lines = this.pending.splice(0);
    await this.flushTail;
    if (this.flushFailed) {
      console.warn(
        "Ignoring a background factory progress flush failure after the factory body settled",
        this.flushError
      );
    }
    if (lines.length > 0) {
      try {
        await this.send(lines);
      } catch (error) {
        console.warn(
          "Failed to flush final factory progress after the factory body settled",
          error
        );
      }
    }
  }
  scheduleFlush() {
    if (this.flushTimer !== void 0) {
      return;
    }
    this.flushTimer = setTimeout(() => {
      this.flushTimer = void 0;
      void this.flush().catch(() => {
      });
    }, FACTORY_LOG_FLUSH_DELAY_MS);
    this.flushTimer.unref?.();
  }
  clearFlushTimer() {
    if (this.flushTimer !== void 0) {
      clearTimeout(this.flushTimer);
      this.flushTimer = void 0;
    }
  }
}
async function awaitFactoryOperation(operation, signal) {
  let rejectAbort;
  const abortPromise = new Promise((_resolve, reject) => {
    rejectAbort = reject;
  });
  const onAbort = () => rejectAbort?.(signal.reason ?? new DOMException("Factory run was aborted", "AbortError"));
  signal.addEventListener("abort", onAbort, { once: true });
  try {
    throwIfFactoryAborted(signal);
    return await Promise.race([operation(), abortPromise]);
  } finally {
    signal.removeEventListener("abort", onAbort);
  }
}
function throwIfFactoryAborted(signal) {
  if (signal.aborted) {
    throw signal.reason ?? new DOMException("Factory run was aborted", "AbortError");
  }
}
function isFactoryAbortError(error) {
  return typeof error === "object" && error !== null && "name" in error && error.name === "AbortError";
}
function isFactoryFatalError(error) {
  return isFactoryAbortError(error) || error instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError || error instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ConnectionError;
}
const TOOL_SEARCH_TOOL_NAME = "tool_search_tool";
class CopilotSession {
  /**
   * Creates a new CopilotSession instance.
   *
   * @param sessionId - The unique identifier for this session
   * @param connection - The JSON-RPC message connection to the Copilot CLI
   * @param workspacePath - Path to the session workspace directory (when infinite sessions enabled)
   * @param traceContextProvider - Optional callback to get W3C Trace Context for outbound RPCs
   * @internal This constructor is internal. Use {@link CopilotClient.createSession} to create sessions.
   */
  constructor(sessionId, connection, _workspacePath, traceContextProvider, options) {
    this.sessionId = sessionId;
    this.connection = connection;
    this._workspacePath = _workspacePath;
    this.traceContextProvider = traceContextProvider;
    this.mcpAuthHandler = options?.mcpAuthHandler;
    this.managedSettingsEnabled = options?.managedSettingsEnabled === true;
  }
  sessionId;
  connection;
  _workspacePath;
  eventHandlers = /* @__PURE__ */ new Set();
  typedEventHandlers = /* @__PURE__ */ new Map();
  toolHandlers = /* @__PURE__ */ new Map();
  canvases = /* @__PURE__ */ new Map();
  bearerTokenProviders = /* @__PURE__ */ new Map();
  commandHandlers = /* @__PURE__ */ new Map();
  factories = /* @__PURE__ */ new Map();
  factoryAbortControllers = /* @__PURE__ */ new Map();
  permissionHandler;
  mcpAuthHandler;
  userInputHandler;
  elicitationHandler;
  exitPlanModeHandler;
  autoModeSwitchHandler;
  hooks;
  transformCallbacks;
  _rpc = null;
  traceContextProvider;
  managedSettingsEnabled;
  _capabilities = {};
  openCanvasInstances = [];
  disconnected = false;
  /** @internal Client session API handlers, populated by CopilotClient during create/resume. */
  clientSessionApis = {};
  /**
   * Friendly factory API for running registered factories by name or handle.
   *
   * @experimental Part of the experimental Agent Factories surface and may
   * change or be removed in future SDK or CLI releases.
   */
  factory = {
    run: (async (nameOrHandle, options) => {
      throwIfFactoryExecutionIsActive();
      const name = typeof nameOrHandle === "string" ? nameOrHandle : (0,_factory_js__WEBPACK_IMPORTED_MODULE_6__/* .getFactoryDefinition */ .kO)(nameOrHandle).meta.name;
      if (options?.resumeFromRunId !== void 0) {
        return this.factory.resume(options.resumeFromRunId, {
          limits: options.limits
        });
      }
      const envelope = await this.rpc.factory.run({
        name,
        args: options?.args === void 0 ? {} : options.args,
        options: {
          limits: options?.limits
        }
      });
      return this.settleFactoryRun(envelope);
    }),
    resume: (async (runId, options) => {
      throwIfFactoryExecutionIsActive();
      let response;
      try {
        response = await this.rpc.factory.resume({
          runId,
          limits: options?.limits
        });
      } catch (error) {
        if (error instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError && typeof error.data === "object" && error.data !== null) {
          const code = error.data.code;
          if (isFactoryResumeErrorCode(code)) {
            throw new _factory_js__WEBPACK_IMPORTED_MODULE_6__/* .FactoryResumeError */ .SO(code, error.message);
          }
        }
        throw error;
      }
      return this.settleFactoryRun(response.run);
    }),
    getRun: async (runId) => this.rpc.factory.getRun({ runId }),
    waitForRun: (runId, options) => this.waitForFactoryRun(runId, options?.signal),
    listRuns: async () => (await this.rpc.factory.listRuns({})).runs,
    getRunDetail: (runId) => this.rpc.factory.getRunDetail({ runId }),
    getRunProgress: (runId, options = {}) => this.rpc.factory.getRunProgress({ runId, ...options }),
    cancel: async (runId) => this.rpc.factory.cancel({ runId })
  };
  /**
   * Resolve a start/resume envelope into the terminal envelope callers expect.
   *
   * The CLI may answer `session.factory.run` and `session.factory.resume`
   * before the run settles, so a non-terminal envelope is followed by a wait
   * on the run's terminal state.
   */
  settleFactoryRun(envelope) {
    if ((0,_factory_js__WEBPACK_IMPORTED_MODULE_6__/* .isFactoryRunTerminal */ .Ui)(envelope.status)) {
      return Promise.resolve(envelope);
    }
    return this.waitForFactoryRun(envelope.runId);
  }
  /**
   * Resolve when a factory run reaches a terminal status.
   *
   * The subscription is installed *before* the first read so a transition
   * landing between the two cannot be missed, and re-reads are serialized so
   * overlapping invalidation events cannot interleave — the run's revision
   * advances once per operation, so a burst of events is common and must
   * collapse into a single in-flight read. A bounded periodic re-read keeps a
   * dropped invalidation from leaving the wait pending forever.
   */
  waitForFactoryRun(runId, signal) {
    const abortError = () => signal?.reason ?? new DOMException("Factory run wait was aborted", "AbortError");
    if (signal?.aborted === true) {
      return Promise.reject(abortError());
    }
    return new Promise((resolve, reject) => {
      let settled = false;
      let reading = false;
      let rereadRequested = false;
      let pollHandle;
      let unsubscribe;
      let onAbort;
      const finish = (complete) => {
        if (settled) {
          return;
        }
        settled = true;
        if (pollHandle !== void 0) {
          clearInterval(pollHandle);
        }
        unsubscribe?.();
        if (onAbort !== void 0) {
          signal?.removeEventListener("abort", onAbort);
        }
        complete();
      };
      const read = async () => {
        if (settled) {
          return;
        }
        if (reading) {
          rereadRequested = true;
          return;
        }
        reading = true;
        try {
          do {
            rereadRequested = false;
            const envelope = await this.rpc.factory.getRun({ runId });
            if ((0,_factory_js__WEBPACK_IMPORTED_MODULE_6__/* .isFactoryRunTerminal */ .Ui)(envelope.status)) {
              finish(() => resolve(envelope));
              return;
            }
          } while (rereadRequested && !settled);
        } catch (error) {
          finish(() => reject(error));
        } finally {
          reading = false;
        }
      };
      if (signal !== void 0) {
        onAbort = () => finish(() => reject(abortError()));
        signal.addEventListener("abort", onAbort, { once: true });
      }
      unsubscribe = this.on("factory.run_updated", (event) => {
        if (event.data.runId === runId) {
          void read();
        }
      });
      pollHandle = setInterval(() => void read(), 5e3);
      pollHandle.unref?.();
      void read();
    });
  }
  /**
   * Typed session-scoped RPC methods.
   */
  get rpc() {
    if (!this._rpc) {
      this._rpc = (0,_generated_rpc_js__WEBPACK_IMPORTED_MODULE_2__/* .createSessionRpc */ .Wj)(this.connection, this.sessionId);
    }
    return this._rpc;
  }
  /**
   * Path to the session workspace directory when infinite sessions are enabled.
   * Contains checkpoints/, plan.md, and files/ subdirectories.
   * Undefined if infinite sessions are disabled.
   */
  get workspacePath() {
    return this._workspacePath;
  }
  /**
   * Host capabilities reported when the session was created or resumed.
   * Use this to check feature support before calling capability-gated APIs.
   */
  get capabilities() {
    return this._capabilities;
  }
  /**
   * Interactive UI methods for showing dialogs to the user.
   * Only available when the CLI host supports elicitation
   * (`session.capabilities.ui?.elicitation === true`).
   *
   * @example
   * ```typescript
   * if (session.capabilities.ui?.elicitation) {
   *   const ok = await session.ui.confirm("Deploy to production?");
   * }
   * ```
   */
  get ui() {
    return {
      elicitation: (params) => this._elicitation(params),
      confirm: (message) => this._confirm(message),
      select: (message, options) => this._select(message, options),
      input: (message, options) => this._input(message, options)
    };
  }
  async send(optionsOrPrompt) {
    const options = typeof optionsOrPrompt === "string" ? { prompt: optionsOrPrompt } : optionsOrPrompt;
    const response = await this.connection.sendRequest("session.send", {
      ...await (0,_telemetry_js__WEBPACK_IMPORTED_MODULE_4__/* .getTraceContext */ .X)(this.traceContextProvider),
      sessionId: this.sessionId,
      prompt: options.prompt,
      displayPrompt: options.displayPrompt,
      attachments: options.attachments,
      mode: options.mode,
      agentMode: options.agentMode,
      requestHeaders: options.requestHeaders
    });
    return response.messageId;
  }
  async sendAndWait(optionsOrPrompt, timeout) {
    const options = typeof optionsOrPrompt === "string" ? { prompt: optionsOrPrompt } : optionsOrPrompt;
    const effectiveTimeout = timeout ?? 6e4;
    let resolveOutcome;
    const outcomePromise = new Promise((resolve) => {
      resolveOutcome = resolve;
    });
    let lastAssistantMessage;
    const unsubscribe = this.on((event) => {
      if (event.type === "assistant.message") {
        lastAssistantMessage = event;
      } else if (event.type === "session.idle") {
        resolveOutcome({ kind: "idle" });
      } else if (event.type === "session.error") {
        const error = new Error(event.data.message);
        error.stack = event.data.stack;
        resolveOutcome({ kind: "error", error });
      }
    });
    let timeoutId;
    try {
      await this.send(options);
      const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(
          () => reject(
            new Error(
              `Timeout after ${effectiveTimeout}ms waiting for session.idle`
            )
          ),
          effectiveTimeout
        );
      });
      const outcome = await Promise.race([outcomePromise, timeoutPromise]);
      if (outcome.kind === "error") {
        throw outcome.error;
      }
      return lastAssistantMessage;
    } finally {
      if (timeoutId !== void 0) {
        clearTimeout(timeoutId);
      }
      unsubscribe();
    }
  }
  /** @internal */
  _markDisconnected() {
    this.disconnected = true;
    this.eventHandlers.clear();
    this.typedEventHandlers.clear();
    this.toolHandlers.clear();
    this.permissionHandler = void 0;
    this.userInputHandler = void 0;
    this.elicitationHandler = void 0;
    this.exitPlanModeHandler = void 0;
    this.autoModeSwitchHandler = void 0;
    this.commandHandlers.clear();
    this.canvases.clear();
    this.factories.clear();
    for (const controllersForRun of this.factoryAbortControllers.values()) {
      for (const controller of controllersForRun.values()) {
        controller.abort();
      }
    }
    this.factoryAbortControllers.clear();
    this.transformCallbacks?.clear();
  }
  on(eventTypeOrHandler, handler) {
    if (typeof eventTypeOrHandler === "string" && handler) {
      const eventType = eventTypeOrHandler;
      if (!this.typedEventHandlers.has(eventType)) {
        this.typedEventHandlers.set(eventType, /* @__PURE__ */ new Set());
      }
      const storedHandler = handler;
      this.typedEventHandlers.get(eventType).add(storedHandler);
      return () => {
        const handlers = this.typedEventHandlers.get(eventType);
        if (handlers) {
          handlers.delete(storedHandler);
        }
      };
    }
    const wildcardHandler = eventTypeOrHandler;
    this.eventHandlers.add(wildcardHandler);
    return () => {
      this.eventHandlers.delete(wildcardHandler);
    };
  }
  /**
   * Dispatches an event to all registered handlers.
   * Also handles broadcast request events internally (external tool calls, permissions).
   *
   * @param event - The session event to dispatch
   * @internal This method is for internal use by the SDK.
   */
  _dispatchEvent(event) {
    this._handleBroadcastEvent(event);
    const typedHandlers = this.typedEventHandlers.get(event.type);
    if (typedHandlers) {
      for (const handler of typedHandlers) {
        try {
          handler(event);
        } catch (_error) {
        }
      }
    }
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (_error) {
      }
    }
  }
  /**
   * Handles broadcast request events by executing local handlers and responding via RPC.
   * Handlers are dispatched as fire-and-forget — rejections propagate as unhandled promise
   * rejections, consistent with standard EventEmitter / event handler semantics.
   * @internal
   */
  _handleBroadcastEvent(event) {
    if (this.disconnected) {
      return;
    }
    if (event.type === "external_tool.requested") {
      const { requestId, toolName } = event.data;
      const args = event.data.arguments;
      const toolCallId = event.data.toolCallId;
      const traceparent = event.data.traceparent;
      const tracestate = event.data.tracestate;
      const handler = this.toolHandlers.get(toolName);
      if (handler) {
        void this._executeToolAndRespond(
          requestId,
          toolName,
          toolCallId,
          args,
          handler,
          traceparent,
          tracestate
        );
      }
    } else if (event.type === "permission.requested") {
      const { requestId, permissionRequest, resolvedByHook } = event.data;
      if (resolvedByHook) {
        return;
      }
      if (this.permissionHandler) {
        void this._executePermissionAndRespond(requestId, permissionRequest);
      }
    } else if (event.type === "mcp.oauth_required") {
      const data = event.data;
      if (!data?.requestId) {
        return;
      }
      if (!this.mcpAuthHandler) {
        console.warn(
          `Received MCP OAuth request without a registered MCP auth handler. SessionId=${this.sessionId}, RequestId=${data.requestId}`
        );
        return;
      }
      void this._executeMcpAuthAndRespond(data);
    } else if (event.type === "command.execute") {
      const { requestId, commandName, command, args } = event.data;
      void this._executeCommandAndRespond(requestId, commandName, command, args);
    } else if (event.type === "elicitation.requested") {
      if (this.elicitationHandler) {
        const { message, requestedSchema, mode, elicitationSource, url, requestId } = event.data;
        void this._handleElicitationRequest(
          {
            sessionId: this.sessionId,
            message,
            requestedSchema,
            mode,
            elicitationSource,
            url
          },
          requestId
        );
      }
    } else if (event.type === "capabilities.changed") {
      this._capabilities = { ...this._capabilities, ...event.data };
    } else if (event.type === "session.canvas.opened") {
      this.upsertOpenCanvasFromEvent(event.data);
    } else if (event.type === "session.canvas.closed") {
      this.removeOpenCanvasFromEvent(event.data);
    }
  }
  upsertOpenCanvasFromEvent(data) {
    if (!isOpenCanvasInstance(data)) {
      console.warn("failed to deserialize session.canvas.opened payload");
      return;
    }
    this.upsertOpenCanvas(data);
  }
  removeOpenCanvasFromEvent(data) {
    if (!data || typeof data !== "object" || typeof data.instanceId !== "string" || data.instanceId.length === 0) {
      console.warn("failed to deserialize session.canvas.closed payload");
      return;
    }
    this.removeOpenCanvas(data.instanceId);
  }
  removeOpenCanvas(instanceId) {
    this.openCanvasInstances = this.openCanvasInstances.filter(
      (open) => open.instanceId !== instanceId
    );
  }
  upsertOpenCanvas(instance) {
    const index = this.openCanvasInstances.findIndex(
      (open) => open.instanceId === instance.instanceId
    );
    if (index >= 0) {
      this.openCanvasInstances[index] = instance;
    } else {
      this.openCanvasInstances.push(instance);
    }
  }
  /**
   * Executes a tool handler and sends the result back via RPC.
   * @internal
   */
  async _executeToolAndRespond(requestId, toolName, toolCallId, args, handler, traceparent, tracestate) {
    try {
      let availableTools;
      if (toolName === TOOL_SEARCH_TOOL_NAME) {
        try {
          const metadata = await this.rpc.tools.getCurrentMetadata();
          availableTools = metadata.tools ?? void 0;
        } catch {
          availableTools = void 0;
        }
      }
      const rawResult = await handler(args, {
        sessionId: this.sessionId,
        toolCallId,
        toolName,
        arguments: args,
        availableTools,
        traceparent,
        tracestate
      });
      let result;
      if (rawResult == null) {
        result = "";
      } else if (typeof rawResult === "string") {
        result = rawResult;
      } else if (isToolResultObject(rawResult)) {
        result = rawResult;
      } else {
        result = JSON.stringify(rawResult);
      }
      if (this.disconnected) {
        return;
      }
      await this.rpc.tools.handlePendingToolCall({ requestId, result });
    } catch (error) {
      if (this.disconnected) {
        return;
      }
      const message = error instanceof Error ? error.message : String(error);
      try {
        await this.rpc.tools.handlePendingToolCall({ requestId, error: message });
      } catch (rpcError) {
        if (!(rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ConnectionError || rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError)) {
          throw rpcError;
        }
      }
    }
  }
  /**
   * Executes a permission handler and sends the result back via RPC.
   * @internal
   */
  async _executePermissionAndRespond(requestId, permissionRequest) {
    try {
      const handlerResult = await this.permissionHandler(permissionRequest, {
        sessionId: this.sessionId,
        managedSettingsEnabled: this.managedSettingsEnabled
      });
      const isAttributed = (0,_types_js__WEBPACK_IMPORTED_MODULE_5__/* .isAttributedPermissionResult */ .Bx)(handlerResult);
      const result = isAttributed ? handlerResult.result : handlerResult;
      const decisionContext = isAttributed ? handlerResult.decisionContext : void 0;
      if (result.kind === "no-result") {
        return;
      }
      if (this.disconnected) {
        return;
      }
      await this.rpc.permissions.handlePendingPermissionRequest(
        decisionContext === void 0 ? { requestId, result } : { requestId, result, decisionContext }
      );
    } catch (error) {
      if (this.disconnected) {
        return;
      }
      console.error("Permission handler or response delivery failed", {
        sessionId: this.sessionId,
        requestId,
        error
      });
      try {
        await this.rpc.permissions.handlePendingPermissionRequest({
          requestId,
          result: {
            kind: "user-not-available"
          }
        });
      } catch (rpcError) {
        if (!(rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ConnectionError || rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError)) {
          throw rpcError;
        }
      }
    }
  }
  /**
   * Executes an MCP auth handler and sends the result back via RPC.
   * @internal
   */
  async _executeMcpAuthAndRespond(request) {
    try {
      const result = await this.mcpAuthHandler(request, { sessionId: this.sessionId });
      const response = result && "accessToken" in result ? { kind: "token", ...result } : { kind: "cancelled" };
      await this.rpc.mcp.oauth.handlePendingRequest({
        requestId: request.requestId,
        result: response
      });
    } catch (_error) {
      try {
        await this.rpc.mcp.oauth.handlePendingRequest({
          requestId: request.requestId,
          result: { kind: "cancelled" }
        });
      } catch (rpcError) {
        if (!(rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ConnectionError || rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError)) {
          throw rpcError;
        }
      }
    }
  }
  /**
   * Executes a command handler and sends the result back via RPC.
   * @internal
   */
  async _executeCommandAndRespond(requestId, commandName, command, args) {
    const handler = this.commandHandlers.get(commandName);
    if (!handler) {
      try {
        await this.rpc.commands.handlePendingCommand({
          requestId,
          error: `Unknown command: ${commandName}`
        });
      } catch (rpcError) {
        if (!(rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ConnectionError || rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError)) {
          throw rpcError;
        }
      }
      return;
    }
    try {
      await handler({ sessionId: this.sessionId, command, commandName, args });
      if (this.disconnected) {
        return;
      }
      await this.rpc.commands.handlePendingCommand({ requestId });
    } catch (error) {
      if (this.disconnected) {
        return;
      }
      const message = error instanceof Error ? error.message : String(error);
      try {
        await this.rpc.commands.handlePendingCommand({ requestId, error: message });
      } catch (rpcError) {
        if (!(rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ConnectionError || rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError)) {
          throw rpcError;
        }
      }
    }
  }
  /**
   * Registers custom tool handlers for this session.
   *
   * Tools with handlers allow the assistant to execute custom functions automatically.
   * Declaration-only tools are surfaced as events and left pending for the consumer.
   *
   * @param tools - An array of tool definitions with their handlers, or undefined to clear all tools
   * @internal This method is typically called internally when creating a session with tools.
   */
  registerTools(tools) {
    this.toolHandlers.clear();
    if (!tools) {
      return;
    }
    for (const tool of tools) {
      if (tool.handler) {
        this.toolHandlers.set(tool.name, tool.handler);
      }
    }
  }
  /**
   * Retrieves a registered tool handler by name.
   *
   * @param name - The name of the tool to retrieve
   * @returns The tool handler if found, or undefined
   * @internal This method is for internal use by the SDK.
   */
  getToolHandler(name) {
    return this.toolHandlers.get(name);
  }
  /**
   * Registers canvas declarations and handlers for this session.
   *
   * @param canvases - Canvases created via `createCanvas`, or undefined to clear all canvases
   * @internal Called by the SDK when creating/resuming a session with `canvases`.
   */
  registerCanvases(canvases) {
    this.canvases.clear();
    if (!canvases || canvases.length === 0) {
      delete this.clientSessionApis.canvas;
      return;
    }
    for (const canvas of canvases) {
      this.canvases.set(canvas.declaration.id, canvas);
    }
    const self = this;
    this.clientSessionApis.canvas = {
      async open(params) {
        const canvas = self.canvases.get(params.canvasId);
        if (!canvas) throw new Error(`No canvas registered with id "${params.canvasId}"`);
        try {
          return await canvas.open(params) ?? {};
        } catch (error) {
          throw toCanvasRpcError(error);
        }
      },
      async close(params) {
        const canvas = self.canvases.get(params.canvasId);
        if (!canvas) throw new Error(`No canvas registered with id "${params.canvasId}"`);
        try {
          if (canvas.onClose) {
            await canvas.onClose(params);
          }
        } catch (error) {
          throw toCanvasRpcError(error);
        }
      },
      async invoke(params) {
        const canvas = self.canvases.get(params.canvasId);
        if (!canvas) throw new Error(`No canvas registered with id "${params.canvasId}"`);
        const handler = canvas.actionHandlers.get(params.actionName);
        if (!handler) {
          throw new _canvas_js__WEBPACK_IMPORTED_MODULE_3__/* .CanvasError */ .zP(
            "canvas_action_no_handler",
            "No handler implemented for this canvas action"
          );
        }
        try {
          return await handler(params);
        } catch (error) {
          throw toCanvasRpcError(error);
        }
      }
    };
  }
  /**
   * Registers factory closures and reverse-RPC handlers for this session.
   *
   * @param factories - Factory handles declared by the joining extension.
   * @internal Called by the SDK when an extension joins a session.
   */
  registerFactories(factories) {
    this.factories.clear();
    if (!factories || factories.length === 0) {
      delete this.clientSessionApis.factory;
      return;
    }
    for (const handle of factories) {
      const definition = (0,_factory_js__WEBPACK_IMPORTED_MODULE_6__/* .getFactoryDefinition */ .kO)(handle);
      if (this.factories.has(definition.meta.name)) {
        throw new Error(
          `Duplicate factory name "${definition.meta.name}". Factory names must be unique within a joinSession call.`
        );
      }
      this.factories.set(definition.meta.name, definition);
    }
    const self = this;
    this.clientSessionApis.factory = {
      async execute(params) {
        const definition = self.factories.get(params.name);
        if (!definition) {
          const message = `No factory registered with name "${params.name}"`;
          throw new vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError(vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ErrorCodes.InvalidParams, message, {
            code: "factory_not_found",
            name: params.name
          });
        }
        const controller = new AbortController();
        let controllersForRun = self.factoryAbortControllers.get(params.runId);
        if (controllersForRun === void 0) {
          controllersForRun = /* @__PURE__ */ new Map();
          self.factoryAbortControllers.set(params.runId, controllersForRun);
        }
        controllersForRun.set(params.executionToken, controller);
        const progress = new FactoryProgressBuffer(async (lines) => {
          await self.rpc.factory.log({
            runId: params.runId,
            executionToken: params.executionToken,
            lines
          });
        });
        try {
          const context = {
            runId: params.runId,
            args: params.args,
            session: self,
            signal: controller.signal,
            phase: (title) => {
              throwIfFactoryAborted(controller.signal);
              progress.enqueue("phase", title);
            },
            log: (message) => {
              throwIfFactoryAborted(controller.signal);
              progress.enqueue("log", message);
            },
            agent: async (prompt, options = {}) => {
              await progress.flush();
              const opts = {};
              for (const key of _factory_js__WEBPACK_IMPORTED_MODULE_6__/* .FACTORY_AGENT_OPTION_KEYS */ .eF) {
                copyDefinedFactoryAgentOption(options, opts, key);
              }
              const response = await awaitFactoryOperation(
                () => self.rpc.factory.agent({
                  factoryRunId: params.runId,
                  executionToken: params.executionToken,
                  prompt,
                  opts
                }),
                controller.signal
              );
              return response.result ?? null;
            },
            step: async (key, producer, options = {}) => {
              await progress.flush();
              if (options.volatile) {
                throwIfFactoryAborted(controller.signal);
                return producer();
              }
              const cached = await awaitFactoryOperation(
                () => self.rpc.factory.journal.get({
                  runId: params.runId,
                  executionToken: params.executionToken,
                  key
                }),
                controller.signal
              );
              if (cached.hit) {
                if (cached.resultJson === void 0) {
                  throw new Error(
                    `step("${key}") journal returned a hit without a result`
                  );
                }
                assertFactoryStepResult(cached.resultJson, key);
                return cached.resultJson;
              }
              const result2 = await producer();
              assertFactoryStepResult(result2, key);
              await awaitFactoryOperation(
                () => self.rpc.factory.journal.put({
                  runId: params.runId,
                  executionToken: params.executionToken,
                  key,
                  resultJson: result2
                }),
                controller.signal
              );
              return result2;
            },
            parallel: runFactoryParallel,
            pipeline: runFactoryPipeline,
            factory: async () => {
              throw new Error("nested factories are not supported");
            }
          };
          const execution = { active: true };
          const result = await factoryExecutionStore.run(execution, async () => {
            try {
              return await definition.run(context);
            } finally {
              execution.active = false;
            }
          });
          if (result === void 0) {
            return {};
          }
          assertFactoryResult(result);
          return { result };
        } finally {
          try {
            await progress.close();
          } finally {
            const controllersForRun2 = self.factoryAbortControllers.get(params.runId);
            if (controllersForRun2?.get(params.executionToken) === controller) {
              controllersForRun2.delete(params.executionToken);
              if (controllersForRun2.size === 0) {
                self.factoryAbortControllers.delete(params.runId);
              }
            }
          }
        }
      },
      async abort(params) {
        const controllersForRun = self.factoryAbortControllers.get(params.runId);
        if (controllersForRun !== void 0) {
          const reason = new DOMException("Factory run was aborted", "AbortError");
          for (const controller of controllersForRun.values()) {
            controller.abort(reason);
          }
        }
        return {};
      }
    };
  }
  /**
   * Registers per-provider {@link BearerTokenProvider} callbacks for BYOK providers
   * configured with managed-identity / on-demand bearer-token auth.
   *
   * The runtime never receives the callback itself; the SDK strips it from the
   * provider config and instead sends `hasBearerTokenProvider: true`. When the
   * runtime needs a token it issues a session-scoped `providerToken.getToken`
   * request, which this handler routes to the matching per-provider callback.
   *
   * @param providers - Map of provider name → callback, or undefined/empty to clear.
   * @internal This method is called internally when creating/resuming a session.
   */
  registerBearerTokenProviders(providers) {
    this.bearerTokenProviders.clear();
    if (!providers || providers.size === 0) {
      delete this.clientSessionApis.providerToken;
      return;
    }
    for (const [name, callback] of providers) {
      this.bearerTokenProviders.set(name, callback);
    }
    const self = this;
    this.clientSessionApis.providerToken = {
      async getToken(params) {
        const callback = self.bearerTokenProviders.get(params.providerName);
        if (!callback) {
          throw new Error(
            `No bearer-token provider registered for provider "${params.providerName}"`
          );
        }
        const token = await callback({
          providerName: params.providerName,
          sessionId: params.sessionId
        });
        return { token };
      }
    };
  }
  /**
   * Registers command handlers for this session.
   *
   * @param commands - An array of command definitions with handlers, or undefined to clear
   * @internal This method is typically called internally when creating/resuming a session.
   */
  registerCommands(commands) {
    this.commandHandlers.clear();
    if (!commands) {
      return;
    }
    for (const cmd of commands) {
      this.commandHandlers.set(cmd.name, cmd.handler);
    }
  }
  /**
   * Registers the elicitation handler for this session.
   *
   * @param handler - The handler to invoke when the server dispatches an elicitation request
   * @internal This method is typically called internally when creating/resuming a session.
   */
  registerElicitationHandler(handler) {
    this.elicitationHandler = handler;
  }
  /**
   * Registers the exit-plan-mode handler for this session.
   *
   * @param handler - The handler to invoke when the server dispatches an exit-plan-mode request
   * @internal This method is typically called internally when creating/resuming a session.
   */
  registerExitPlanModeHandler(handler) {
    this.exitPlanModeHandler = handler;
  }
  /**
   * Registers the auto-mode-switch handler for this session.
   *
   * @param handler - The handler to invoke when the server dispatches an auto-mode-switch request
   * @internal This method is typically called internally when creating/resuming a session.
   */
  registerAutoModeSwitchHandler(handler) {
    this.autoModeSwitchHandler = handler;
  }
  /**
   * Handles an elicitation.requested broadcast event.
   * Invokes the registered handler and responds via handlePendingElicitation RPC.
   * @internal
   */
  async _handleElicitationRequest(context, requestId) {
    if (!this.elicitationHandler) {
      return;
    }
    try {
      const result = await this.elicitationHandler(context);
      await this.rpc.ui.handlePendingElicitation({ requestId, result });
    } catch {
      try {
        await this.rpc.ui.handlePendingElicitation({
          requestId,
          result: { action: "cancel" }
        });
      } catch (rpcError) {
        if (!(rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ConnectionError || rpcError instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError)) {
          throw rpcError;
        }
      }
    }
  }
  /**
   * Handles an exitPlanMode.request callback from the runtime.
   * @internal
   */
  async _handleExitPlanModeRequest(request) {
    if (!this.exitPlanModeHandler) {
      return { approved: true };
    }
    return await this.exitPlanModeHandler(request, { sessionId: this.sessionId });
  }
  /**
   * Handles an autoModeSwitch.request callback from the runtime.
   * @internal
   */
  async _handleAutoModeSwitchRequest(request) {
    if (!this.autoModeSwitchHandler) {
      return "no";
    }
    return await this.autoModeSwitchHandler(request, { sessionId: this.sessionId });
  }
  /**
   * Sets the host capabilities for this session.
   *
   * @param capabilities - The capabilities object from the create/resume response
   * @internal This method is typically called internally when creating/resuming a session.
   */
  setCapabilities(capabilities) {
    this._capabilities = capabilities ?? {};
  }
  /**
   * Snapshot of canvas instances currently known to be open for this session.
   * Populated from the `session.resume` response and live `session.canvas.opened`
   * and `session.canvas.closed` events. Returns a defensive copy — mutating the
   * returned array has no effect on the session.
   */
  get openCanvases() {
    return [...this.openCanvasInstances];
  }
  /**
   * Sets the open-canvas snapshot for this session.
   *
   * @param instances - The `openCanvases` array from the `session.resume` response.
   * @internal This method is typically called internally when resuming a session.
   */
  setOpenCanvases(instances) {
    this.openCanvasInstances = [...instances];
  }
  assertElicitation() {
    if (!this._capabilities.ui?.elicitation) {
      throw new Error(
        "Elicitation is not supported by the host. Check session.capabilities.ui?.elicitation before calling UI methods."
      );
    }
  }
  async _elicitation(params) {
    this.assertElicitation();
    return this.rpc.ui.elicitation({
      message: params.message,
      requestedSchema: params.requestedSchema
    });
  }
  async _confirm(message) {
    this.assertElicitation();
    const result = await this.rpc.ui.elicitation({
      message,
      requestedSchema: {
        type: "object",
        properties: {
          confirmed: { type: "boolean", default: true }
        },
        required: ["confirmed"]
      }
    });
    return result.action === "accept" && result.content?.confirmed === true;
  }
  async _select(message, options) {
    this.assertElicitation();
    const result = await this.rpc.ui.elicitation({
      message,
      requestedSchema: {
        type: "object",
        properties: {
          selection: { type: "string", enum: options }
        },
        required: ["selection"]
      }
    });
    if (result.action === "accept" && result.content?.selection != null) {
      return result.content.selection;
    }
    return null;
  }
  async _input(message, options) {
    this.assertElicitation();
    const field = { type: "string" };
    if (options?.title) field.title = options.title;
    if (options?.description) field.description = options.description;
    if (options?.minLength != null) field.minLength = options.minLength;
    if (options?.maxLength != null) field.maxLength = options.maxLength;
    if (options?.format) field.format = options.format;
    if (options?.default != null) field.default = options.default;
    const result = await this.rpc.ui.elicitation({
      message,
      requestedSchema: {
        type: "object",
        properties: {
          value: field
        },
        required: ["value"]
      }
    });
    if (result.action === "accept" && result.content?.value != null) {
      return result.content.value;
    }
    return null;
  }
  /**
   * Registers a handler for permission requests.
   *
   * When the assistant needs permission to perform certain actions (e.g., file operations),
   * this handler is called to approve or deny the request.
   *
   * @param handler - The permission handler function, or undefined to remove the handler
   * @internal This method is typically called internally when creating a session.
   */
  registerPermissionHandler(handler) {
    this.permissionHandler = handler;
  }
  /**
   * Registers a user input handler for ask_user requests.
   *
   * When the agent needs input from the user (via ask_user tool),
   * this handler is called to provide the response.
   *
   * @param handler - The user input handler function, or undefined to remove the handler
   * @internal This method is typically called internally when creating a session.
   */
  registerUserInputHandler(handler) {
    this.userInputHandler = handler;
  }
  /**
   * Registers hook handlers for session lifecycle events.
   *
   * Hooks allow custom logic to be executed at various points during
   * the session lifecycle (before/after tool use, session start/end, etc.).
   *
   * @param hooks - The hook handlers object, or undefined to remove all hooks
   * @internal This method is typically called internally when creating a session.
   */
  registerHooks(hooks) {
    this.hooks = hooks;
  }
  /**
   * Registers transform callbacks for system message sections.
   *
   * @param callbacks - Map of section ID to transform callback, or undefined to clear
   * @internal This method is typically called internally when creating a session.
   */
  registerTransformCallbacks(callbacks) {
    this.transformCallbacks = callbacks;
  }
  /**
   * Handles a systemMessage.transform request from the runtime.
   * Dispatches each section to its registered transform callback.
   *
   * @param sections - Map of section IDs to their current rendered content
   * @returns A promise that resolves with the transformed sections
   * @internal This method is for internal use by the SDK.
   */
  async _handleSystemMessageTransform(sections) {
    const result = {};
    for (const [sectionId, { content }] of Object.entries(sections)) {
      const callback = this.transformCallbacks?.get(sectionId);
      if (callback) {
        try {
          const transformed = await callback(content);
          result[sectionId] = { content: transformed };
        } catch (_error) {
          result[sectionId] = { content };
        }
      } else {
        result[sectionId] = { content };
      }
    }
    return { sections: result };
  }
  /**
   * Handles a user input request from the Copilot CLI.
   *
   * @param request - The user input request data from the CLI
   * @returns A promise that resolves with the user's response
   * @internal This method is for internal use by the SDK.
   */
  async _handleUserInputRequest(request) {
    if (!this.userInputHandler) {
      throw new Error("User input requested but no handler registered");
    }
    try {
      const result = await this.userInputHandler(request, {
        sessionId: this.sessionId
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
  /**
   * Handles a hooks invocation from the Copilot CLI.
   *
   * @param hookType - The type of hook being invoked
   * @param input - The input data for the hook
   * @returns A promise that resolves with the hook output, or undefined
   * @internal This method is for internal use by the SDK.
   */
  async _handleHooksInvoke(hookType, input) {
    if (!this.hooks) {
      return void 0;
    }
    const normalized = deserializeHookInput(input);
    const handlerMap = {
      preToolUse: this.hooks.onPreToolUse,
      preMcpToolCall: this.hooks.onPreMcpToolCall,
      postToolUse: this.hooks.onPostToolUse,
      postToolUseFailure: this.hooks.onPostToolUseFailure,
      userPromptSubmitted: this.hooks.onUserPromptSubmitted,
      userPromptTransformed: this.hooks.onUserPromptTransformed,
      sessionStart: this.hooks.onSessionStart,
      sessionEnd: this.hooks.onSessionEnd,
      errorOccurred: this.hooks.onErrorOccurred,
      agentStop: this.hooks.onAgentStop
    };
    const handler = handlerMap[hookType];
    if (!handler) {
      return void 0;
    }
    try {
      const result = await handler(normalized, { sessionId: this.sessionId });
      return result;
    } catch (_error) {
      return void 0;
    }
  }
  /**
   * Retrieves all events and messages from this session's history.
   *
   * This returns the complete conversation history including user messages,
   * assistant responses, tool executions, and other session events.
   *
   * @returns A promise that resolves with an array of all session events
   * @throws Error if the session has been disconnected or the connection fails
   *
   * @example
   * ```typescript
   * const events = await session.getEvents();
   * for (const event of events) {
   *   if (event.type === "assistant.message") {
   *     console.log("Assistant:", event.data.content);
   *   }
   * }
   * ```
   */
  async getEvents() {
    const response = await this.connection.sendRequest("session.getMessages", {
      sessionId: this.sessionId
    });
    return response.events;
  }
  /**
   * Disconnects this session and releases all in-memory resources (event handlers,
   * tool handlers, permission handlers).
   *
   * Session state on disk (conversation history, planning state, artifacts) is
   * preserved, so the conversation can be resumed later by calling
   * {@link CopilotClient.resumeSession} with the session ID. To permanently
   * remove all session data including files on disk, use
   * {@link CopilotClient.deleteSession} instead.
   *
   * After calling this method, the session object can no longer be used.
   *
   * @returns A promise that resolves when the session is disconnected
   * @throws Error if the connection fails
   *
   * @example
   * ```typescript
   * // Clean up when done — session can still be resumed later
   * await session.disconnect();
   * ```
   */
  async disconnect() {
    if (this.disconnected) {
      return;
    }
    await this.connection.sendRequest("session.destroy", {
      sessionId: this.sessionId
    });
    this._markDisconnected();
  }
  /** Enables `await using session = ...` syntax for automatic cleanup. */
  async [Symbol.asyncDispose]() {
    return this.disconnect();
  }
  /**
   * Aborts the currently processing message in this session.
   *
   * Use this to cancel a long-running request. The session remains valid
   * and can continue to be used for new messages.
   *
   * @returns A promise that resolves when the abort request is acknowledged
   * @throws Error if the session has been disconnected or the connection fails
   *
   * @example
   * ```typescript
   * // Start a long-running request
   * const messagePromise = session.send({ prompt: "Write a very long story..." });
   *
   * // Abort after 5 seconds
   * setTimeout(async () => {
   *   await session.abort();
   * }, 5000);
   * ```
   */
  async abort() {
    await this.connection.sendRequest("session.abort", {
      sessionId: this.sessionId
    });
  }
  /**
   * Change the model for this session.
   * The new model takes effect for the next message. Conversation history is preserved.
   *
   * @param model - Model ID to switch to
   * @param options - Optional settings for the new model
   *
   * @example
   * ```typescript
   * await session.setModel("gpt-5.4");
   * await session.setModel("claude-sonnet-4.6", { reasoningEffort: "high" });
   * ```
   */
  async setModel(model, options) {
    await this.rpc.model.switchTo({ modelId: model, ...options });
  }
  /**
   * Log a message to the session timeline.
   * The message appears in the session event stream and is visible to SDK consumers
   * and (for non-ephemeral messages) persisted to the session event log on disk.
   *
   * @param message - Human-readable message text
   * @param options - Optional log level and ephemeral flag
   *
   * @example
   * ```typescript
   * await session.log("Processing started");
   * await session.log("Disk usage high", { level: "warning" });
   * await session.log("Connection failed", { level: "error" });
   * await session.log("Debug info", { ephemeral: true });
   * ```
   */
  async log(message, options) {
    await this.rpc.log({ message, ...options });
  }
}
function isToolResultObject(value) {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  if (!("textResultForLlm" in value) || typeof value.textResultForLlm !== "string") {
    return false;
  }
  if (!("resultType" in value) || typeof value.resultType !== "string") {
    return false;
  }
  const allowedResultTypes = [
    "success",
    "failure",
    "rejected",
    "denied",
    "timeout"
  ];
  return allowedResultTypes.includes(value.resultType);
}
function toCanvasRpcError(error) {
  if (error instanceof vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError) return error;
  const code = error instanceof _canvas_js__WEBPACK_IMPORTED_MODULE_3__/* .CanvasError */ .zP ? error.code : "canvas_handler_error";
  const message = error instanceof Error ? error.message : String(error);
  return new vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError(vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ErrorCodes.InternalError, message, { code, message });
}
function strictJsonValidationError(context, category, message, path) {
  return new vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ResponseError(vscode_jsonrpc_node_js__WEBPACK_IMPORTED_MODULE_1__.ErrorCodes.InternalError, message, {
    code: context.code,
    category,
    path
  });
}
function assertStrictJson(value, context) {
  const ancestors = /* @__PURE__ */ new Set();
  const visit = (current, path, allowUndefined) => {
    if (current === void 0) {
      if (allowUndefined) {
        return;
      }
      throw strictJsonValidationError(
        context,
        "nested_undefined",
        `${context.label} contains nested undefined at ${path}`,
        path
      );
    }
    if (current === null || typeof current === "boolean" || typeof current === "string") {
      return;
    }
    if (typeof current === "number") {
      if (!Number.isFinite(current)) {
        throw strictJsonValidationError(
          context,
          "non_finite_number",
          `${context.label} contains a non-finite number at ${path}`,
          path
        );
      }
      if (Object.is(current, -0)) {
        throw strictJsonValidationError(
          context,
          "negative_zero",
          `${context.label} contains negative zero at ${path}; normalize it to 0`,
          path
        );
      }
      return;
    }
    if (typeof current === "function" || typeof current === "symbol" || typeof current === "bigint") {
      throw strictJsonValidationError(
        context,
        "unsupported_type",
        `${context.label} contains a function, symbol, or BigInt at ${path}`,
        path
      );
    }
    if (typeof current !== "object") {
      throw strictJsonValidationError(
        context,
        "unsupported_type",
        `${context.label} contains a function, symbol, or BigInt at ${path}`,
        path
      );
    }
    if (ancestors.has(current)) {
      throw strictJsonValidationError(
        context,
        "cyclic_value",
        `${context.label} contains a cyclic reference at ${path}`,
        path
      );
    }
    ancestors.add(current);
    try {
      if (Array.isArray(current)) {
        const keys = Reflect.ownKeys(current);
        if (keys.length !== current.length + 1 || keys.some(
          (key) => key !== "length" && (typeof key !== "string" || !/^(0|[1-9]\d*)$/.test(key) || Number(key) >= current.length)
        )) {
          throw strictJsonValidationError(
            context,
            "unsupported_object",
            `${context.label} contains a non-JSON array property at ${path}`,
            path
          );
        }
        for (let index = 0; index < current.length; index++) {
          const descriptor = Object.getOwnPropertyDescriptor(current, String(index));
          if (descriptor === void 0 || !descriptor.enumerable || !("value" in descriptor)) {
            throw strictJsonValidationError(
              context,
              "unsupported_object",
              `${context.label} contains a non-JSON array property at ${path}[${index}]`,
              `${path}[${index}]`
            );
          }
          visit(descriptor.value, `${path}[${index}]`, false);
        }
        return;
      }
      const prototype = Object.getPrototypeOf(current);
      if (prototype !== Object.prototype && prototype !== null) {
        throw strictJsonValidationError(
          context,
          "unsupported_object",
          `${context.label} contains a non-JSON object at ${path}`,
          path
        );
      }
      for (const key of Reflect.ownKeys(current)) {
        if (typeof key === "symbol") {
          throw strictJsonValidationError(
            context,
            "unsupported_type",
            `${context.label} contains a function, symbol, or BigInt at ${path}`,
            path
          );
        }
        const propertyPath = /^[A-Za-z_$][\w$]*$/.test(key) ? `${path}.${key}` : `${path}[${JSON.stringify(key)}]`;
        const descriptor = Object.getOwnPropertyDescriptor(current, key);
        if (descriptor === void 0 || !descriptor.enumerable || !("value" in descriptor)) {
          throw strictJsonValidationError(
            context,
            "unsupported_object",
            `${context.label} contains a non-JSON property at ${propertyPath}`,
            propertyPath
          );
        }
        visit(descriptor.value, propertyPath, false);
      }
    } finally {
      ancestors.delete(current);
    }
  };
  visit(value, "$", context.allowTopLevelUndefined);
}
function assertFactoryResult(value) {
  assertStrictJson(value, {
    code: "factory_result_not_json",
    label: "Factory result",
    allowTopLevelUndefined: true
  });
}
function assertFactoryStepResult(value, key) {
  assertStrictJson(value, {
    code: "factory_step_not_json",
    label: `Factory step "${key}" result`,
    allowTopLevelUndefined: false
  });
}



/***/ },

/***/ 653
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ createSessionFsAdapter)
/* harmony export */ });
/* unused harmony export SessionFsSqliteTransactionFailure */
class SessionFsSqliteTransactionFailure extends Error {
  /** Failure classification reported to the runtime. */
  errorClass;
  constructor(message, errorClass = "fatal") {
    super(message);
    this.name = "SessionFsSqliteTransactionFailure";
    this.errorClass = errorClass;
  }
}
function normalizeSqliteParams(params) {
  if (!params) {
    return void 0;
  }
  const normalized = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== void 0) {
      normalized[key] = value;
    }
  }
  return normalized;
}
function createSessionFsAdapter(provider) {
  return {
    readFile: async ({ path }) => {
      try {
        const content = await provider.readFile(path);
        return { content };
      } catch (err) {
        return { content: "", error: toSessionFsError(err) };
      }
    },
    writeFile: async ({ path, content, mode }) => {
      try {
        await provider.writeFile(path, content, mode);
        return void 0;
      } catch (err) {
        return toSessionFsError(err);
      }
    },
    appendFile: async ({ path, content, mode }) => {
      try {
        await provider.appendFile(path, content, mode);
        return void 0;
      } catch (err) {
        return toSessionFsError(err);
      }
    },
    exists: async ({ path }) => {
      try {
        return { exists: await provider.exists(path) };
      } catch {
        return { exists: false };
      }
    },
    stat: async ({ path }) => {
      try {
        return await provider.stat(path);
      } catch (err) {
        return {
          isFile: false,
          isDirectory: false,
          size: 0,
          mtime: (/* @__PURE__ */ new Date()).toISOString(),
          birthtime: (/* @__PURE__ */ new Date()).toISOString(),
          error: toSessionFsError(err)
        };
      }
    },
    mkdir: async ({ path, recursive, mode }) => {
      try {
        await provider.mkdir(path, recursive ?? false, mode);
        return void 0;
      } catch (err) {
        return toSessionFsError(err);
      }
    },
    readdir: async ({ path }) => {
      try {
        const entries = await provider.readdir(path);
        return { entries };
      } catch (err) {
        return { entries: [], error: toSessionFsError(err) };
      }
    },
    readdirWithTypes: async ({ path }) => {
      try {
        const entries = await provider.readdirWithTypes(path);
        return { entries };
      } catch (err) {
        return { entries: [], error: toSessionFsError(err) };
      }
    },
    rm: async ({ path, recursive, force }) => {
      try {
        await provider.rm(path, recursive ?? false, force ?? false);
        return void 0;
      } catch (err) {
        return toSessionFsError(err);
      }
    },
    rename: async ({ src, dest }) => {
      try {
        await provider.rename(src, dest);
        return void 0;
      } catch (err) {
        return toSessionFsError(err);
      }
    },
    // Unlike the FS methods above, SQLite methods let errors propagate to the JSON-RPC layer
    // rather than catching and mapping via toSessionFsError. The FS error mapping is specifically
    // for translating Node.js errno codes (e.g., ENOENT) into SessionFsError, which isn't
    // meaningful for SQL errors. Letting exceptions propagate preserves the original error
    // message in the JSON-RPC error response.
    sqliteQuery: async ({ queryType, query, params: bindParams }) => {
      if (!provider.sqlite) {
        throw new Error("SQLite is not supported by this provider");
      }
      const result = await provider.sqlite.query(
        queryType,
        query,
        normalizeSqliteParams(bindParams)
      );
      return result ?? { rows: [], columns: [], rowsAffected: 0 };
    },
    sqliteTransaction: async ({ statements }) => {
      if (!provider.sqlite?.transaction) {
        return {
          results: [],
          error: {
            errorClass: "fatal",
            message: "SQLite transactions are not supported by this provider"
          }
        };
      }
      try {
        const results = await provider.sqlite.transaction(
          statements.map((statement) => ({
            queryType: statement.queryType,
            query: statement.query,
            params: normalizeSqliteParams(statement.params)
          }))
        );
        return { results: results.map((result) => ({ ...result })) };
      } catch (err) {
        return { results: [], error: toSqliteTransactionError(err) };
      }
    },
    sqliteExists: async () => {
      if (!provider.sqlite) {
        throw new Error("SQLite is not supported by this provider");
      }
      return { exists: await provider.sqlite.exists() };
    }
  };
}
function toSessionFsError(err) {
  const e = err;
  const code = e.code === "ENOENT" ? "ENOENT" : "UNKNOWN";
  return { code, message: e.message ?? String(err) };
}
function toSqliteTransactionError(err) {
  if (err instanceof SessionFsSqliteTransactionFailure) {
    return { errorClass: err.errorClass, message: err.message };
  }
  return {
    errorClass: "fatal",
    message: err instanceof Error ? err.message : String(err)
  };
}



/***/ },

/***/ 1880
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   X: () => (/* binding */ getTraceContext)
/* harmony export */ });
async function getTraceContext(provider) {
  if (!provider) return {};
  try {
    return await provider() ?? {};
  } catch {
    return {};
  }
}



/***/ },

/***/ 7225
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ ToolSet)
/* harmony export */ });
/* unused harmony export BuiltInTools */
const VALID_TOOL_NAME = /^[a-zA-Z0-9_-]+$/;
function validateName(kind, name) {
  if (name === "*") {
    return;
  }
  if (!VALID_TOOL_NAME.test(name)) {
    throw new Error(
      `Invalid ${kind} tool name '${name}': tool names must match /^[a-zA-Z0-9_-]+$/ or be the wildcard '*'.`
    );
  }
}
class ToolSet {
  items = [];
  addBuiltIn(nameOrNames) {
    const names = typeof nameOrNames === "string" ? [nameOrNames] : nameOrNames;
    for (const name of names) {
      validateName("builtin", name);
      this.items.push(`builtin:${name}`);
    }
    return this;
  }
  /**
   * Adds a custom tool pattern. Matches tools registered via the SDK's
   * `tools` option or via custom agents.
   *
   * @param name A specific custom tool name or `"*"` to match all custom tools.
   */
  addCustom(name) {
    validateName("custom", name);
    this.items.push(`custom:${name}`);
    return this;
  }
  /**
   * Adds an MCP tool pattern. Matches tools advertised by any configured
   * MCP server.
   *
   * @param toolName The runtime's canonical wire name for the MCP tool
   *   (e.g. `"github-list_issues"`), or `"*"` to match all MCP tools from
   *   any server.
   */
  addMcp(toolName) {
    validateName("mcp", toolName);
    this.items.push(`mcp:${toolName}`);
    return this;
  }
  /**
   * Returns a defensive copy of the accumulated filter strings, suitable for
   * passing as {@link SessionConfigBase.availableTools}.
   */
  toArray() {
    return [...this.items];
  }
}
const BuiltInTools = (/* unused pure expression or super */ null && ({
  /**
   * Built-in tools that operate only within the bounds of a single session —
   * no host filesystem access outside the session, no cross-session state,
   * no host environment access, no network. Safe to enable in `Mode = "empty"`
   * scenarios (e.g. multi-tenant servers) without leaking host capabilities.
   *
   * **Contract:** tools in this set MUST NOT be extended (even behind options
   * or args) to read or write state outside the session boundary. Adding
   * cross-session or host-state behavior to one of these tools is a
   * breaking change that requires removing it from this set.
   */
  Isolated: [
    "ask_user",
    "task_complete",
    "exit_plan_mode",
    "task",
    "read_agent",
    "write_agent",
    "list_agents",
    "send_inbox",
    "context_board",
    "skill"
  ]
}));



/***/ },

/***/ 1142
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Bx: () => (/* binding */ isAttributedPermissionResult)
/* harmony export */ });
/* unused harmony exports SYSTEM_MESSAGE_SECTIONS, approveAll, convertMcpCallToolResult, createAttributedPermissionResult, defineTool */
/* harmony import */ var _sessionFsProvider_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(653);
/* harmony import */ var _copilotRequestHandler_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8256);



const RuntimeConnection = {
  /**
   * Spawn a runtime child process and communicate over its stdin/stdout.
   * This is the default if no {@link CopilotClientOptions.connection} is set.
   */
  forStdio(opts = {}) {
    return { kind: "stdio", path: opts.path, args: opts.args, env: opts.env };
  },
  /**
   * Spawn a runtime child process that listens on a TCP socket and connect to it.
   */
  forTcp(opts = {}) {
    return {
      kind: "tcp",
      port: opts.port,
      connectionToken: opts.connectionToken,
      path: opts.path,
      args: opts.args,
      env: opts.env
    };
  },
  /**
   * Connect to an already-running runtime at the given URL. The SDK does not
   * spawn a process in this mode.
   */
  forUri(url, opts = {}) {
    return { kind: "uri", url, connectionToken: opts.connectionToken };
  },
  /**
   * Host the runtime in-process over the native runtime library's C ABI (FFI).
   *
   * @experimental Per-client options lowered to environment variables (`env`,
   * `telemetry`, `gitHubToken`, `baseDirectory`) are **not** honored in-process;
   * the worker inherits the host process's ambient environment. Set the
   * corresponding environment variables on the host process instead. See
   * https://github.com/github/copilot-sdk/issues/1934.
   */
  forInProcess() {
    return { kind: "inprocess" };
  }
};
function convertMcpCallToolResult(callResult) {
  const textParts = [];
  const binaryResults = [];
  for (const block of callResult.content) {
    switch (block.type) {
      case "text":
        if (typeof block.text === "string") {
          textParts.push(block.text);
        }
        break;
      case "image":
        if (typeof block.data === "string" && block.data && typeof block.mimeType === "string") {
          binaryResults.push({
            data: block.data,
            mimeType: block.mimeType,
            type: "image"
          });
        }
        break;
      case "resource": {
        if (block.resource?.text) {
          textParts.push(block.resource.text);
        }
        if (block.resource?.blob) {
          const mimeType = block.resource.mimeType;
          binaryResults.push({
            data: block.resource.blob,
            mimeType: typeof mimeType === "string" && mimeType ? mimeType : "application/octet-stream",
            type: "resource",
            description: block.resource.uri
          });
        }
        break;
      }
    }
  }
  return {
    textResultForLlm: textParts.join("\n"),
    resultType: callResult.isError ? "failure" : "success",
    ...binaryResults.length > 0 ? { binaryResultsForLlm: binaryResults } : {}
  };
}
function defineTool(name, config) {
  return { name, ...config };
}
const SYSTEM_MESSAGE_SECTIONS = (/* unused pure expression or super */ null && ({
  preamble: { description: "Agent identity preamble and mode statement" },
  identity: {
    description: "Section group covering the identity preamble and its sibling sub-sections (tone, tool efficiency, etc.)"
  },
  tone: { description: "Response style, conciseness rules, output formatting preferences" },
  tool_efficiency: { description: "Tool usage patterns, parallel calling, batching guidelines" },
  environment_context: { description: "CWD, OS, git root, directory listing, available tools" },
  code_change_rules: { description: "Coding rules, linting/testing, ecosystem tools, style" },
  guidelines: { description: "Tips, behavioral best practices, behavioral guidelines" },
  safety: { description: "Environment limitations, prohibited actions, security policies" },
  tool_instructions: { description: "Per-tool usage instructions" },
  custom_instructions: { description: "Repository and organization custom instructions" },
  runtime_instructions: {
    description: "Runtime-provided context and instructions (e.g. system notifications, memories, workspace context, mode-specific instructions, content-exclusion policy)"
  },
  last_instructions: {
    description: "End-of-prompt instructions: parallel tool calling, persistence, task completion"
  }
}));
function isAttributedPermissionResult(result) {
  return result.kind === "attributed";
}
function createAttributedPermissionResult(result, decisionContext) {
  const inner = isAttributedPermissionResult(result) ? result.result : result;
  return { kind: "attributed", result: inner, decisionContext };
}
const approveAll = (request, invocation) => {
  if (invocation.managedSettingsEnabled) {
    throw new Error("approveAll cannot be used when managed settings are enabled");
  }
  if ("managedApprovalRequired" in request) {
    const managedApprovalRequired = request.managedApprovalRequired;
    if (managedApprovalRequired !== void 0 && managedApprovalRequired !== false) {
      return { kind: "no-result" };
    }
  }
  return { kind: "approve-once" };
};
const defaultJoinSessionPermissionHandler = () => ({
  kind: "no-result"
});


/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "$6", 0, /* binding */ RuntimeConnection,
/* harmony export */   "p5", 0, /* binding */ defaultJoinSessionPermissionHandler
/* harmony export */ ]);


/***/ },

/***/ 8937
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZZ: () => (/* binding */ registerAdapter)
/* harmony export */ });
/* unused harmony exports get, set, del, remove, has, clear, prompt, request, query, delete */
/* harmony import */ var _cocreate_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5604);
/* harmony import */ var _cocreate_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3209);

let configMemory = {};
let localConfigCache = {};
let globalConfigCache = {};
let adapter = {
  isBrowser: false,
  getLocalStorageItem: (key) => null,
  setLocalStorageItem: (key, value) => {
  },
  removeLocalStorageItem: (key) => {
  },
  clearLocalStorage: () => {
  },
  getGlobalConfig: () => ({}),
  setGlobalConfig: (config) => {
  },
  getEnv: (key) => null,
  setEnv: (key, value) => {
  },
  removeEnv: (key) => {
  },
  getGitBranch: async () => null,
  prompt: async (question) => "",
  loadConfig: async (filePath) => ({}),
  saveConfig: async (filePath, content) => {
  }
};
function registerAdapter(envAdapter) {
  adapter = { ...adapter, ...envAdapter };
}
function get(key) {
  if (!key || typeof key !== "string") return null;
  const memoryVal = (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(configMemory, key);
  if (memoryVal !== void 0 && memoryVal !== null) {
    return memoryVal;
  }
  const localVal = (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(localConfigCache, key);
  if (localVal !== void 0 && localVal !== null) {
    return localVal;
  }
  const globalVal = (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(globalConfigCache, key);
  if (globalVal !== void 0 && globalVal !== null) {
    return globalVal;
  }
  if (adapter.isBrowser) {
    const storageVal = adapter.getLocalStorageItem(key);
    if (storageVal !== null && storageVal !== void 0) return storageVal;
  } else {
    const envVal = adapter.getEnv(key);
    if (envVal !== null && envVal !== void 0) return envVal;
  }
  return null;
}
function set(key, value) {
  configMemory[key] = value;
  if (adapter.isBrowser) {
    adapter.setLocalStorageItem(key, value);
  } else {
    adapter.setEnv(key, value);
  }
  return configAPI;
}
function del(key) {
  delete configMemory[key];
  delete localConfigCache[key];
  delete globalConfigCache[key];
  if (adapter.isBrowser) {
    adapter.removeLocalStorageItem(key);
  } else {
    adapter.removeEnv(key);
  }
  return configAPI;
}
const remove = (/* unused pure expression or super */ null && (del));
function has(key) {
  const val = get(key);
  return val !== null && val !== void 0;
}
function clear() {
  configMemory = {};
  localConfigCache = {};
  globalConfigCache = {};
  if (adapter.isBrowser) {
    adapter.clearLocalStorage();
  }
  return configAPI;
}
async function resolveValue(val) {
  if (typeof val === "string" || typeof val === "number" || typeof val === "boolean") {
    return val;
  } else if (val && val.$branch) {
    const branch = await adapter.getGitBranch();
    return branch ? val.$branch[branch] : null;
  } else {
    return val;
  }
}
async function prompt(items, env = true, globalSetting = true, configPath = "CoCreate.config.js") {
  let localConfig = await adapter.loadConfig(configPath);
  let globalConfig = await adapter.getGlobalConfig();
  localConfigCache = localConfig || {};
  globalConfigCache = globalConfig || {};
  const filterEmptyValues = (obj) => {
    if (!obj || typeof obj !== "object") return {};
    return Object.fromEntries(
      Object.entries(obj).filter(([_, val]) => {
        if (typeof val === "object" && val !== null && !Array.isArray(val)) {
          return Object.keys(val).length > 0;
        } else if (Array.isArray(val)) {
          return val.length > 0;
        } else {
          return val !== "" && val !== void 0;
        }
      })
    );
  };
  let configData = {};
  let updateGlobalFile = false;
  let variables = {};
  const getMemoryValue = (key) => Object.prototype.hasOwnProperty.call(configMemory, key) ? configMemory[key] : (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(configMemory, key);
  async function processPromptItems(targetItems) {
    if (typeof targetItems === "string") {
      targetItems = { [targetItems]: "" };
    }
    for (let key of Object.keys(targetItems)) {
      let { value, prompt: userPrompt, choices, variable, parse } = targetItems[key] || {};
      const placeholders = key.match(/{{\s*([\w\W]+?)\s*}}/g);
      if (placeholders && placeholders.length) {
        for (let placeholder of placeholders) {
          if (variables[placeholder]) {
            key = key.replace(placeholder, variables[placeholder]);
          }
        }
      }
      if (choices) {
        if (!userPrompt && userPrompt !== "") continue;
        let isAnswered = false;
        for (let choice of Object.keys(choices)) {
          let isAnsweredChoice = true;
          for (let choicekey of Object.keys(choices[choice])) {
            let choiceValue = getMemoryValue(choicekey) || (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(localConfigCache, choicekey) || (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(globalConfigCache, choicekey);
            if (choiceValue) {
              configData[choicekey] = choiceValue;
            } else {
              isAnsweredChoice = false;
            }
          }
          if (isAnsweredChoice) {
            isAnswered = true;
          }
        }
        if (!isAnswered) {
          const answer = await adapter.prompt(userPrompt || `${key}: `);
          const choice = choices[answer];
          if (choice) {
            await processPromptItems(choice);
          }
        }
      } else if (variable) {
        let variableValue = getMemoryValue(key) ?? (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(localConfigCache, key) ?? (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(globalConfigCache, key);
        if ((variableValue === void 0 || variableValue === null || variableValue === "") && env && !adapter.isBrowser) {
          variableValue = adapter.getEnv(key);
        }
        if (typeof variableValue === "string") {
          try {
            variableValue = JSON.parse(variableValue);
          } catch {
          }
        }
        if (variableValue && typeof variableValue === "object" && !Array.isArray(variableValue) && Object.keys(variableValue).length) {
          configData[key] = variableValue;
          configMemory[key] = variableValue;
          variables[`{{${variable}}}`] = Object.keys(variableValue)[0];
        } else {
          variables[`{{${variable}}}`] = value || await adapter.prompt(userPrompt || `${variable}: `);
        }
      } else {
        const memoryValue = getMemoryValue(key);
        if (value || value === "") {
          configData[key] = value;
          if (globalSetting) {
            updateGlobalFile = true;
          }
        } else if (memoryValue !== void 0 && memoryValue !== null && memoryValue !== "") {
          configData[key] = await resolveValue(memoryValue);
        } else if (env && !adapter.isBrowser && adapter.getEnv(key)) {
          configData[key] = adapter.getEnv(key);
        } else {
          let localKey, globalKey;
          if (localKey = (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(localConfigCache, key)) {
            configData[key] = await resolveValue(localKey);
          } else if (globalKey = (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .getValueFromObject */ .r)(globalConfigCache, key)) {
            configData[key] = await resolveValue(globalKey);
          } else if (userPrompt || userPrompt === "") {
            configData[key] = await adapter.prompt(userPrompt || `${key}: `);
            if (globalSetting) updateGlobalFile = true;
          }
        }
        if (configData[key] !== void 0) {
          if (parse) configData[key] = parse(configData[key]);
          set(key, configData[key]);
        }
      }
    }
  }
  if (items) {
    await processPromptItems(items);
    if (updateGlobalFile && !adapter.isBrowser) {
      let updatedGlobalConfig = filterEmptyValues(
        (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_0__/* .dotNotationToObject */ .O)(configData, globalConfigCache)
      );
      await adapter.setGlobalConfig(updatedGlobalConfig);
    }
  } else {
    configData = {
      ...filterEmptyValues(globalConfigCache),
      ...filterEmptyValues(localConfigCache)
    };
    for (const [key, value] of Object.entries(configData)) {
      set(key, value);
    }
  }
  configData = (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_0__/* .dotNotationToObject */ .O)(configData);
  return configData;
}
const request = prompt;
function isTargetMatch(docTarget, currentTargetId) {
  if (!docTarget || docTarget === "default" || docTarget === "*") return true;
  if (!currentTargetId) return true;
  if (Array.isArray(docTarget)) return docTarget.includes(currentTargetId);
  return docTarget === currentTargetId;
}
function mergeServerConfigs(docs = [], scope = {}) {
  const consolidated = {};
  for (const doc of docs) {
    if (!doc || doc.enabled === false) continue;
    const matchesCluster = isTargetMatch(doc.cluster, scope.cluster);
    const matchesServer = isTargetMatch(doc.server, scope.server);
    const matchesWorker = isTargetMatch(doc.worker, scope.worker);
    if (matchesCluster && matchesServer && matchesWorker && doc.config) {
      (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_0__/* .dotNotationToObject */ .O)(doc.config, consolidated);
    }
  }
  return consolidated;
}
async function query(options = {}, crud) {
  const { cluster, server, worker, type, enabled = true } = options;
  const organization_id = options.organization_id || get("organization_id");
  const queryFilter = { enabled };
  if (type) queryFilter.type = Array.isArray(type) ? { $in: type } : type;
  const scopeConditions = [];
  if (cluster) {
    scopeConditions.push({ cluster: { $in: [cluster, "default", "*"] } }, { cluster: { $exists: false } });
  }
  if (server) {
    scopeConditions.push({ server: { $in: [server, "default", "*"] } }, { server: { $exists: false } });
  }
  if (worker) {
    scopeConditions.push({ worker: { $in: [worker, "default", "*"] } }, { worker: { $exists: false } });
  }
  if (scopeConditions.length > 0) {
    queryFilter.$or = scopeConditions;
  }
  const crudRequest = {
    method: "object.read",
    array: "servers_config",
    organization_id,
    filter: {
      query: queryFilter,
      // Later config records overwrite earlier ones during the merge.
      sort: [{ key: "_id", direction: "asc" }]
    }
  };
  if (crud?.send) {
    const response = await crud.send(crudRequest);
    const docs = response?.data || response?.object || [];
    return mergeServerConfigs(docs, { cluster, server, worker });
  }
  return {};
}
request.prompt = prompt;
request.get = get;
request.set = set;
request.delete = del;
request.remove = del;
request.has = has;
request.clear = clear;
request.query = query;
request.registerAdapter = registerAdapter;
const configAPI = request;

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (configAPI)));

/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "vt", 0, /* binding */ configAPI
/* harmony export */ ]);


/***/ },

/***/ 9405
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9627);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5663);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6674);
/* harmony import */ var node_readline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9182);
/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4472);
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6564);
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8937);







const exec = (0,node_util__WEBPACK_IMPORTED_MODULE_4__.promisify)(node_child_process__WEBPACK_IMPORTED_MODULE_5__.exec);
async function getGitBranch() {
  try {
    const { stdout } = await exec("git branch --show-current");
    return stdout.trim();
  } catch {
    return null;
  }
}
async function cliPrompt(question) {
  const rl = node_readline__WEBPACK_IMPORTED_MODULE_3__["default"].createInterface({
    input: process.stdin,
    output: process.stdout
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}
async function loadConfig(filePath) {
  try {
    const resolvedPath = node_path__WEBPACK_IMPORTED_MODULE_1__["default"].resolve(process.cwd(), filePath);
    if (!node_fs__WEBPACK_IMPORTED_MODULE_0__["default"].existsSync(resolvedPath)) return {};
    const content = node_fs__WEBPACK_IMPORTED_MODULE_0__["default"].readFileSync(resolvedPath, "utf8");
    const cleanContent = content.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, "$1").trim();
    try {
      return JSON.parse(cleanContent);
    } catch {
      const script = cleanContent.replace(/export\s+default\s+/, "return ").replace(/module\.exports\s*=\s*/, "return ");
      const fn = new Function("module", "exports", script);
      const exports = {};
      const module = { exports };
      const result = fn(module, exports);
      return result || module.exports || {};
    }
  } catch (error) {
    console.error(`[@cocreate/config] Failed to load configuration at ${filePath}:`, error.message);
    return {};
  }
}
async function saveConfig(filePath, content) {
  try {
    const targetPath = node_path__WEBPACK_IMPORTED_MODULE_1__["default"].isAbsolute(filePath) ? filePath : node_path__WEBPACK_IMPORTED_MODULE_1__["default"].resolve(process.cwd(), filePath);
    const outputString = `export default ${JSON.stringify(content, null, 2)};
`;
    node_fs__WEBPACK_IMPORTED_MODULE_0__["default"].writeFileSync(targetPath, outputString, "utf8");
  } catch (error) {
    console.error(`[@cocreate/config] Failed to save configuration at ${filePath}:`, error.message);
  }
}
;(0,_core_js__WEBPACK_IMPORTED_MODULE_6__/* .registerAdapter */ .ZZ)({
  isBrowser: false,
  getLocalStorageItem: () => null,
  setLocalStorageItem: () => {
  },
  removeLocalStorageItem: () => {
  },
  clearLocalStorage: () => {
  },
  getGlobalConfig: async () => {
    const globalConfigPath = node_path__WEBPACK_IMPORTED_MODULE_1__["default"].resolve(node_os__WEBPACK_IMPORTED_MODULE_2__["default"].homedir(), "CoCreate.config.js");
    return await loadConfig(globalConfigPath);
  },
  setGlobalConfig: async (config) => {
    const globalConfigPath = node_path__WEBPACK_IMPORTED_MODULE_1__["default"].resolve(node_os__WEBPACK_IMPORTED_MODULE_2__["default"].homedir(), "CoCreate.config.js");
    await saveConfig(globalConfigPath, config);
  },
  getEnv: (key) => {
    return process.env[key] !== void 0 ? process.env[key] : null;
  },
  setEnv: (key, value) => {
    process.env[key] = value !== null && typeof value === "object" ? JSON.stringify(value) : value;
  },
  removeEnv: (key) => {
    delete process.env[key];
  },
  getGitBranch,
  prompt: cliPrompt,
  loadConfig,
  saveConfig
});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_core_js__WEBPACK_IMPORTED_MODULE_6__/* .configAPI */ .vt);

/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "A", 0, __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ ]);


/***/ },

/***/ 5604
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   O: () => (/* binding */ dotNotationToObject)
/* harmony export */ });
function dotNotationToObject(data = {}, obj = {}) {
  try {
    data ??= {};
    obj ??= {};
    let arrayGroup = {};
    for (const key of Object.keys(data)) {
      let value = data[key];
      let newObject = obj;
      let oldObject = new Object(obj);
      let keys = key.split(".");
      let length = keys.length - 1;
      for (let i = 0; i < keys.length; i++) {
        if (keys[i].endsWith("]")) {
          if (keys[i].endsWith("[]")) {
            let baseKey = keys[i].slice(0, -2);
            if (!Array.isArray(newObject[baseKey])) {
              newObject[baseKey] = [];
            }
            if (length == i) {
              if (Array.isArray(value)) {
                newObject[baseKey].push(...value);
              } else {
                newObject[baseKey].push(value);
              }
            }
          } else if (/\[([0-9]+)\]/g.test(keys[i])) {
            let [k, index] = keys[i].split("[");
            index = index.slice(0, -1);
            if (!Array.isArray(newObject[k])) {
              newObject[k] = [];
            }
            if (length == i) {
              if (value === void 0) {
                newObject[k].splice(index, 1);
              } else {
                newObject[k][index] = value;
              }
            } else {
              newObject[k][index] = oldObject[k][index] || {};
              newObject = newObject[k][index];
              oldObject = oldObject[k][index];
            }
          } else if (/\[\w\]/g.test(keys[i])) {
            let [k, group] = keys[i].split("[");
            group = group.slice(0, -1);
            if (!Array.isArray(newObject[k])) {
              newObject[k] = [];
            }
            let index;
            if (arrayGroup[keys.slice(0, i + 1).join(".")]) {
              index = arrayGroup[keys.slice(0, i + 1).join(".")];
            } else {
              index = newObject[k].length;
              arrayGroup[keys.slice(0, i + 1).join(".")] = index;
              newObject[k][index] = {};
            }
            if (length == i) {
              newObject[k][index] = value;
            } else {
              newObject = newObject[k][index];
            }
          }
        } else {
          if (length == i) {
            if (value === void 0) {
              delete newObject[keys[i]];
            } else {
              newObject[keys[i]] = value;
            }
          } else {
            newObject[keys[i]] = oldObject[keys[i]] || {};
            newObject = newObject[keys[i]];
            oldObject = oldObject[keys[i]];
          }
        }
      }
    }
    return obj;
  } catch (error) {
    console.log("Error converting dot notation to object", error);
    return false;
  }
}


/***/ },

/***/ 3209
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   r: () => (/* binding */ getValueFromObject)
/* harmony export */ });
function getValueFromObject(object = {}, path = "", throwError = false) {
  try {
    if (!Array.isArray(object) && !Object.keys(object).length || !path) {
      if (throwError) throw new Error("Invalid input to getValueFromObject");
      return;
    }
    path = path.replace(/\[(\d+)\]/g, ".$1").replace(/^\./, "");
    let data = object, subpath = path.split(".");
    for (let i = 0; i < subpath.length; i++) {
      if (throwError && !(subpath[i] in data))
        throw new Error("Key not found in object: " + subpath[i]);
      data = data[subpath[i]];
      if (!data) break;
    }
    return data;
  } catch (error) {
    if (throwError) throw error;
  }
}


/***/ },

/***/ 1099
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Pw: () => (/* binding */ resolveAIConfig)
/* harmony export */ });
/* harmony import */ var _cocreate_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9405);
/* harmony import */ var _cocreate_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5604);


const defaults = {
  enabled: true,
  platformCredentialFallback: false,
  defaultStorageTarget: "virtual",
  allowLocalFileSystem: false,
  allowUnconfirmedLocalWrite: false,
  allowPlatformCommands: false,
  platformCommandTimeout: 6e5,
  platformCommandMaxOutputBytes: 1048576,
  cliPath: void 0,
  cliDirectory: void 0,
  requestTimeout: 6e5,
  systemInstructions: ""
};
async function resolveAIConfig(server, options = {}) {
  const aiConfig = { ...defaults };
  const localConfig = _cocreate_config__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.get("ai");
  if (localConfig) (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .dotNotationToObject */ .O)(localConfig, aiConfig);
  const databaseConfig = await _cocreate_config__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .A.query({
    type: "ai",
    organization_id: server.organization_id
  }, server.crud);
  (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .dotNotationToObject */ .O)(databaseConfig, aiConfig);
  (0,_cocreate_utils__WEBPACK_IMPORTED_MODULE_1__/* .dotNotationToObject */ .O)(options, aiConfig);
  delete aiConfig.localFsRoot;
  return aiConfig;
}
/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (resolveAIConfig)));

/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "NT", 0, /* binding */ defaults
/* harmony export */ ]);


/***/ },

/***/ 4374
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   n: () => (/* binding */ loadDefaultInstructions)
/* harmony export */ });
function normalizeInstruction(object) {
  return {
    ...object,
    instructions: object.instructions ?? object.content ?? "",
    examples: object.examples ?? [],
    sources: object.sources ?? []
  };
}
function getSourcePath(source) {
  return source.pathname ?? source.path;
}
function resolveSource(source, filesByPath) {
  const requestedPath = getSourcePath(source);
  const file = filesByPath.get(requestedPath);
  if (!file) {
    return {
      ...source,
      pathname: requestedPath,
      found: false
    };
  }
  return {
    ...source,
    name: source.name ?? file.name,
    pathname: file.pathname ?? file.path ?? requestedPath,
    content: file.src ?? file.content ?? "",
    contentType: file["content-type"],
    updated: file.updated,
    found: true
  };
}
async function loadDefaultInstructions({ crud, organization_id, logger = console }) {
  const defaultInstructions = /* @__PURE__ */ new Map();
  const instructionsData = await crud.send({
    method: "object.read",
    array: "ai-instructions",
    organization_id,
    filter: { query: { enabled: true }, limit: 100 }
  });
  const objects = (instructionsData.object ?? []).filter((object) => object.default && object.name).map(normalizeInstruction);
  const sourcePaths = [...new Set(
    objects.flatMap((object) => object.sources).map(getSourcePath).filter(Boolean)
  )];
  let filesData = { object: [] };
  if (sourcePaths.length) {
    try {
      filesData = await crud.send({
        method: "object.read",
        array: "files",
        organization_id,
        filter: {
          query: {
            pathname: { $in: sourcePaths }
          },
          key: {
            name: 1,
            pathname: 1,
            path: 1,
            src: 1,
            content: 1,
            "content-type": 1,
            updated: 1
          },
          limit: sourcePaths.length
        }
      });
    } catch (error) {
      logger.warn("[@cocreate/ai] Default instruction sources could not be loaded.", error.message);
    }
  }
  const filesByPath = /* @__PURE__ */ new Map();
  for (const file of filesData.object ?? []) {
    const pathname = file.pathname ?? file.path;
    if (pathname) filesByPath.set(pathname, file);
  }
  for (const object of objects) {
    defaultInstructions.set(object.name, {
      ...object,
      sources: object.sources.map((source) => resolveSource(source, filesByPath))
    });
  }
  return defaultInstructions;
}


/***/ },

/***/ 5435
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Cu: () => (/* binding */ getMissingCredentialKeys),
/* harmony export */   lR: () => (/* binding */ getCredentialValue),
/* harmony export */   y$: () => (/* binding */ getCredentialRequirements)
/* harmony export */ });
function getCredentialRequirements(providerConfig = {}, providerId = "") {
  const configured = providerConfig.credentials;
  const labels = configured && typeof configured === "object" && !Array.isArray(configured) ? Object.fromEntries(
    Object.entries(configured).filter(([key, label]) => key && typeof label === "string" && label.trim()).map(([key, label]) => [key, label.trim()])
  ) : {};
  if (!Object.keys(labels).length) {
    const apiName = providerConfig.api || providerId || "AI provider";
    labels.key = `${apiName} API key`;
  }
  return { keys: Object.keys(labels), labels };
}
function getCredentialValue(profile = {}, key = "") {
  if (!key) return void 0;
  if (key in profile) return profile[key];
  return key.split(".").reduce((current, part) => current?.[part], profile);
}
function getMissingCredentialKeys(profile = {}, keys = []) {
  return keys.filter((key) => {
    const value = getCredentialValue(profile, key);
    return value === void 0 || value === null || value === "";
  });
}


/***/ },

/***/ 5913
(module, __webpack_exports__, __webpack_require__) {

var __webpack_import_meta__ = Object.assign(Object.create(import.meta), import.meta, {url: "file:///home/ubuntu/Dev/CoCreate-plugins/server-ai/src/index.js", webpack: 5, main: __webpack_require__.c[__webpack_require__.s] === module, env: {"NODE_ENV":"production","MODE":"production","DEV":false,"PROD":true,"SSR":true,"BASE_URL":"/"}});
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ts: () => (/* binding */ init),
/* harmony export */   si: () => (/* binding */ prepareCopilotCli)
/* harmony export */ });
/* harmony import */ var _github_copilot_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4127);
/* harmony import */ var node_crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2561);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9627);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5663);
/* harmony import */ var node_url__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9061);
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1099);
/* harmony import */ var _tools_crud_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9745);
/* harmony import */ var _tools_files_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(4898);
/* harmony import */ var _tools_api_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3501);
/* harmony import */ var _tools_send_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(6843);
/* harmony import */ var _tools_socket_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(8332);
/* harmony import */ var _tools_storage_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(8192);
/* harmony import */ var _tools_servers_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(3889);
/* harmony import */ var _tools_errors_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(626);
/* harmony import */ var _tools_routes_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(1819);
/* harmony import */ var _tools_autoscaler_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(7942);
/* harmony import */ var _tools_history_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(7505);
/* harmony import */ var _tools_coc_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(8354);
/* harmony import */ var _tools_git_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(4257);
/* harmony import */ var _tools_command_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(9364);
/* harmony import */ var _context_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(4374);
/* harmony import */ var _workspace_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(7936);
/* harmony import */ var _lifecycle_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(8793);
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(9170);
/* harmony import */ var _credentials_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(5435);

























let aiLogPrefix = "[@cocreate/ai] [MASTER]";
function logAiLifecycle(event, data = {}, details = {}) {
  const ai = data.ai ?? {};
  console.info(`${aiLogPrefix} ${event}`, {
    organization_id: data.organization_id,
    user_id: data.socket?.user_id ?? data.user_id,
    client_id: data.clientId,
    socket_id: data.socketId ?? data.socket?.id,
    conversation_id: details.conversation_id ?? ai.conversation_id,
    user_message_id: details.user_message_id ?? ai.user_message_id,
    request_id: data.uuid,
    ...details
  });
}
function logAiFailure(event, data, error, details = {}) {
  const message = error?.message ?? String(error);
  logAiLifecycle(event, data, {
    ...details,
    error: message.replace(/\b(?:sk|pk)-[A-Za-z0-9_-]{8,}\b/g, "[REDACTED_API_KEY]").replace(/\b(?:gh[pousr]_[A-Za-z0-9_]{8,}|github_pat_[A-Za-z0-9_]{8,})\b/g, "[REDACTED_TOKEN]").replace(/(Bearer\s+)[^\s,;]+/gi, "$1[REDACTED]").replace(/((?:api[-_ ]?key|access[-_ ]?token)\s*[:=]\s*)[^\s,;]+/gi, "$1[REDACTED]"),
    error_name: error?.name
  });
}
function resolveCopilotCliPath() {
  const moduleMeta = __webpack_import_meta__;
  const usesMusl = process.platform === "linux" && !process.report?.getReport().header.glibcVersionRuntime;
  const variants = process.platform !== "linux" ? [process.platform] : usesMusl ? ["linuxmusl", "linux"] : ["linux", "linuxmusl"];
  for (const variant of variants) {
    try {
      const packageUrl = moduleMeta.resolve(
        `@github/copilot-${variant}-${process.arch}`
      );
      return (0,node_url__WEBPACK_IMPORTED_MODULE_4__.fileURLToPath)(packageUrl);
    } catch {
    }
  }
  throw new Error(
    `Could not resolve the GitHub Copilot CLI for ${process.platform}-${process.arch}. Reinstall @github/copilot with optional dependencies enabled or configure ai.cliPath.`
  );
}
function prepareCopilotCli(cliDirectory) {
  const variant = `${process.platform}-${process.arch}`;
  const extension = process.platform === "win32" ? ".exe" : "";
  const sourceUrl = new URL(
    `copilot-${variant}${extension}`,
    cliDirectory
  );
  const sourcePath = (0,node_url__WEBPACK_IMPORTED_MODULE_4__.fileURLToPath)(sourceUrl);
  if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_2__.existsSync)(sourcePath)) {
    throw new Error(`Bundled Copilot executable was not found at ${sourcePath}`);
  }
  if (process.platform !== "win32") (0,node_fs__WEBPACK_IMPORTED_MODULE_2__.chmodSync)(sourcePath, 493);
  return sourcePath;
}
function resolveBundledCopilotCliPath() {
  if (!process.argv[1]) return;
  const variant = `${process.platform}-${process.arch}`;
  const extension = process.platform === "win32" ? ".exe" : "";
  const entryDirectory = (0,node_path__WEBPACK_IMPORTED_MODULE_3__.dirname)((0,node_path__WEBPACK_IMPORTED_MODULE_3__.resolve)(process.argv[1]));
  const bundledPath = (0,node_path__WEBPACK_IMPORTED_MODULE_3__.join)(
    entryDirectory,
    `copilot-${variant}${extension}`
  );
  if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_2__.existsSync)(bundledPath)) return;
  return prepareCopilotCli(
    (0,node_url__WEBPACK_IMPORTED_MODULE_4__.pathToFileURL)(`${entryDirectory}${node_path__WEBPACK_IMPORTED_MODULE_3__.sep}`).href
  );
}
const requiredToolConfigs = {
  render_crud: {
    description: "Adds a persistent database-backed app view to the final assistant message. Use after an authorized read when the user asks to see or open a record or file. This tool returns a reference and never returns the large field value.",
    parameters: {
      type: "object",
      properties: {
        array: { type: "string", description: "The CoCreate array containing the record." },
        object: { type: "string", description: "The record _id returned by an authorized read." },
        key: { type: "string", description: "Field to display, such as src or content. Use {} for the complete record." },
        language: { type: "string", description: "Prism language name, such as html, javascript, css, json, python, or sql." },
        display: {
          type: "string",
          enum: ["details", "code", "form"],
          description: "Optional initial app view. Use code for source, details for a record, or form for editing. Omit for the default details view."
        },
        storage: {
          type: "string",
          description: "Optional view storage. Omit unless the client explicitly supplied a storage target."
        },
        database: {
          type: "string",
          description: "Optional view database. Omit unless the client explicitly supplied a database target."
        }
      },
      required: ["array", "object", "key"],
      additionalProperties: false
    }
  },
  get_ai_instructions: {
    description: "Retrieves focused CoCreate operating instructions, examples, and sources by instruction name.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Instruction name, such as crud, files, apis, ast, send, sockets, or storage."
        }
      },
      required: ["name"],
      additionalProperties: false
    }
  },
  coc: {
    description: "Platform organization only. Runs the constrained CoCreate CLI workflow against the configured local project. Use download to refresh database-backed site files locally before editing. Use upload only after edits are complete and the user requested the changes live. This tool cannot execute arbitrary commands.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["download", "upload"]
        },
        paths: {
          type: "array",
          items: { type: "string" },
          description: "Virtual paths to download or local project paths to upload."
        },
        site: {
          type: "boolean",
          description: "Download the complete website one file at a time."
        },
        overwrite: {
          type: "boolean",
          description: "Replace existing local files during download. Defaults to false."
        }
      },
      required: ["action"],
      additionalProperties: false
    }
  }
};
async function init(server, options = {}, resolvedConfig) {
  const workerId = server?.workerId || process.env.WORKER_ID;
  aiLogPrefix = `[@cocreate/ai] ${workerId ? `[WORKER ${workerId}]` : "[MASTER]"}`;
  const aiConfig = resolvedConfig || await (0,_config_js__WEBPACK_IMPORTED_MODULE_5__/* .resolveAIConfig */ .Pw)(server, options);
  const {
    enabled: aiEnabled,
    defaultProvider,
    providers: configuredProviders,
    platformCredentialFallback,
    defaultStorageTarget,
    allowLocalFileSystem,
    allowUnconfirmedLocalWrite,
    allowPlatformCommands,
    platformCommandTimeout,
    platformCommandMaxOutputBytes,
    cliPath,
    cliDirectory,
    requestTimeout,
    publicPath,
    tools: configuredTools
  } = aiConfig;
  const sessionWaitTimeout = Number.isFinite(Number(requestTimeout)) && Number(requestTimeout) > 0 ? Number(requestTimeout) : _config_js__WEBPACK_IMPORTED_MODULE_5__/* .defaults */ .NT.requestTimeout;
  const crud = server.crud;
  const wsManager = server.wsManager;
  let defaultInstructions = /* @__PURE__ */ new Map();
  async function readInstructions(query, organization_id, host) {
    const response = await crud.send({
      method: "object.read",
      array: "ai-instructions",
      organization_id,
      host,
      filter: { query, limit: 1 }
    });
    return response.object?.[0];
  }
  try {
    defaultInstructions = await (0,_context_js__WEBPACK_IMPORTED_MODULE_20__/* .loadDefaultInstructions */ .n)({
      crud,
      organization_id: server.organization_id
    });
    console.info(
      `${aiLogPrefix} Loaded ${defaultInstructions.size} default instruction(s): ` + [...defaultInstructions.keys()].join(", ")
    );
  } catch (error) {
    console.warn(`${aiLogPrefix} Default AI instructions could not be loaded.`, error.message);
  }
  function getBaseSystemMessage(organization_id) {
    const local = allowLocalFileSystem && (0,_platform_js__WEBPACK_IMPORTED_MODULE_23__/* .isPlatformOrganization */ .dk)(server, organization_id);
    const instructions = defaultInstructions.get("default");
    return [
      instructions?.instructions ?? instructions?.content,
      `Runtime context: storageTarget=${(0,_platform_js__WEBPACK_IMPORTED_MODULE_23__/* .projectStorageTarget */ .Us)(server, organization_id, void 0, defaultStorageTarget)}, localFsEnabled=${local}${local ? `, repository=${(0,_workspace_js__WEBPACK_IMPORTED_MODULE_21__/* .getRepositoryWorkspace */ .IT)(server) ?? "unavailable"}` : ""}, publicPath=${publicPath}.`
    ].filter(Boolean).join("\n\n");
  }
  function configureTool(tool) {
    const toolConfig = configuredTools?.[tool.name] ?? requiredToolConfigs[tool.name];
    if (!toolConfig) return null;
    return {
      ...toolConfig,
      name: tool.name,
      handler: tool.handler
    };
  }
  if (!aiEnabled) {
    return {
      config: aiConfig,
      async send() {
        throw new Error("[@cocreate/ai] AI is disabled by configuration (ai.enabled=false).");
      },
      async stop() {
      }
    };
  }
  const clients = /* @__PURE__ */ new Map();
  const activeSessions = /* @__PURE__ */ new Map();
  const cancelledMessages = /* @__PURE__ */ new Set();
  const pendingCredentialRequests = /* @__PURE__ */ new Map();
  const conversationQueues = /* @__PURE__ */ new Map();
  const organizationLocks = /* @__PURE__ */ new Map();
  const organizationGenerations = /* @__PURE__ */ new Map();
  const activeOrganizationRequests = /* @__PURE__ */ new Map();
  const lifecycle = (0,_lifecycle_js__WEBPACK_IMPORTED_MODULE_22__/* .createLifecycle */ .R)({ server, quiesce: async () => {
    for (const queue of conversationQueues.values()) {
      queue.paused = true;
      queue.items.length = 0;
    }
    await Promise.allSettled([...activeSessions.values()].map((item) => item.session.abort()));
    await Promise.allSettled([...clients.values()].map(async (promise) => (await promise).stop()));
    clients.clear();
  } });
  const getMessageKey = ({ organization_id, clientId, ai }) => `${organization_id}:${clientId}:${ai?.user_message_id}`;
  const getQueueKey = ({ organization_id, conversation_id }) => `${organization_id}:${conversation_id}`;
  function getConversationQueue(data) {
    const conversation_id = data.ai?.conversation_id;
    if (!conversation_id) return null;
    const user_id = data.socket?.user_id ?? data.user_id;
    const key = getQueueKey({ organization_id: data.organization_id, conversation_id });
    if (!conversationQueues.has(key)) {
      conversationQueues.set(key, {
        key,
        organization_id: data.organization_id,
        clientId: data.clientId,
        user_id,
        conversation_id,
        items: [],
        messages: /* @__PURE__ */ new Map(),
        active: null,
        paused: false,
        draining: false
      });
    }
    const queue = conversationQueues.get(key);
    return queue.user_id === user_id ? queue : null;
  }
  async function withOrganizationLock(organization_id, operation) {
    const previous = organizationLocks.get(organization_id) ?? Promise.resolve();
    let release;
    const current = new Promise((resolve2) => {
      release = resolve2;
    });
    organizationLocks.set(organization_id, current);
    await previous.catch(() => {
    });
    try {
      return await operation();
    } finally {
      release();
      if (organizationLocks.get(organization_id) === current) {
        organizationLocks.delete(organization_id);
      }
    }
  }
  async function cleanupOrganization(organization_id, event = {}) {
    if (!organization_id) return;
    const generation = (organizationGenerations.get(organization_id) ?? 0) + 1;
    organizationGenerations.set(organization_id, generation);
    return withOrganizationLock(organization_id, async () => {
      const queueEntries = [...conversationQueues.entries()].filter(([, queue]) => queue.organization_id === organization_id);
      const activeQueueItems = queueEntries.map(([, queue]) => queue.active).filter((item) => item?.data);
      const sessionEntries = [...activeSessions.entries()].filter(([, session]) => session.organization_id === organization_id);
      for (const key of cancelledMessages) {
        if (key.startsWith(`${organization_id}:`)) cancelledMessages.delete(key);
      }
      for (const [key] of sessionEntries) cancelledMessages.add(key);
      for (const item of activeQueueItems) cancelledMessages.add(getMessageKey(item.data));
      for (const [key, queue] of queueEntries) {
        queue.paused = true;
        queue.items.length = 0;
        queue.active = null;
        queue.messages.clear();
        if (conversationQueues.get(key) === queue) conversationQueues.delete(key);
      }
      for (const [key, session] of sessionEntries) {
        if (activeSessions.get(key) === session) activeSessions.delete(key);
      }
      const credentialEntries = [...pendingCredentialRequests.entries()].filter(([, data]) => data.organization_id === organization_id);
      for (const [key] of credentialEntries) pendingCredentialRequests.delete(key);
      const clientPrefix = `copilot:${organization_id}:`;
      const customProviderKey = `custom-provider-runtime:${organization_id}`;
      const clientEntries = [...clients.entries()].filter(([key]) => key.startsWith(clientPrefix) || key === customProviderKey);
      for (const [key, clientPromise] of clientEntries) {
        if (clients.get(key) === clientPromise) clients.delete(key);
      }
      const cleanupResults = await Promise.allSettled([
        ...sessionEntries.map(([, session]) => session.session.abort()),
        ...clientEntries.map(async ([, clientPromise]) => {
          const client = await clientPromise;
          const errors = await client.stop();
          if (errors?.length) {
            throw new AggregateError(errors, "Copilot client shutdown reported errors.");
          }
        })
      ]);
      const cleanupErrors = cleanupResults.filter((result) => result.status === "rejected").map((result) => result.reason?.message ?? String(result.reason));
      logAiLifecycle("organization_evicted", { organization_id }, {
        reason: event.reason ?? "evicted",
        stopped_clients: clientEntries.length,
        aborted_sessions: sessionEntries.length,
        cleared_queues: queueEntries.length,
        cleared_credential_requests: credentialEntries.length,
        cleanup_errors: cleanupErrors
      });
      if (cleanupErrors.length) {
        console.warn(`${aiLogPrefix} Organization cleanup completed with errors:`, cleanupErrors);
      }
    }).finally(() => {
      if (!activeOrganizationRequests.has(organization_id) && organizationGenerations.get(organization_id) === generation) {
        organizationGenerations.delete(organization_id);
      }
    });
  }
  const onOrganizationEvicted = (organization_id, event) => {
    void cleanupOrganization(organization_id, event).catch((error) => {
      console.error(`${aiLogPrefix} Failed to clean up evicted organization ${organization_id}:`, error);
    });
  };
  process.on("organization.evicted", onOrganizationEvicted);
  const sendQueueStatus = (data, ai) => sendToClient({
    method: "ai.chat",
    organization_id: data.organization_id,
    user_id: data.socket?.user_id ?? data.user_id,
    clientId: data.clientId,
    socketId: data.socketId ?? data.socket?.id,
    uuid: data.uuid,
    ai: {
      conversation_id: data.ai?.conversation_id,
      user_message_id: data.ai?.user_message_id,
      ...ai
    }
  });
  async function drainConversationQueue(queue) {
    if (!queue || queue.draining || queue.paused) return;
    queue.draining = true;
    try {
      while (!queue.paused && queue.items.length) {
        const item = queue.items.shift();
        queue.active = item;
        try {
          await upsertUserMessageState({
            organization_id: item.data.organization_id,
            database: item.data.database,
            host: item.data.host,
            user_id: item.data.socket?.user_id ?? item.data.user_id,
            clientId: item.data.clientId,
            socket: item.data.socket,
            object_id: item.message_id,
            status: "processing",
            sourceData: item.data
          });
        } catch (error) {
          queue.items.unshift(item);
          queue.active = null;
          logAiFailure("processing_status_write_failed", item.data, error, {
            conversation_id: queue.conversation_id,
            user_message_id: item.message_id,
            queue_length: queue.items.length
          });
          console.warn(`${aiLogPrefix} Unable to mark queued message as processing:`, error.message);
          break;
        }
        queue.messages.set(item.message_id, "processing");
        await sendQueueStatus(item.data, {
          status: "thinking",
          conversation_id: queue.conversation_id,
          user_message_id: item.message_id,
          steer: item.data.ai.steer === true
        });
        logAiLifecycle("thinking_status_sent", item.data, {
          conversation_id: queue.conversation_id,
          user_message_id: item.message_id,
          queue_length: queue.items.length
        });
        try {
          const result = await runAiSession(item.data);
          if (result?.needsCredentials) {
            queue.messages.set(item.message_id, "needs_credentials");
          } else if (queue.messages.get(item.message_id) === "processing") {
            queue.messages.set(item.message_id, "complete");
          }
        } catch (error) {
          const streamKey = getMessageKey(item.data);
          if (cancelledMessages.delete(streamKey)) {
            queue.messages.set(item.message_id, "canceled");
            continue;
          }
          logAiFailure("queued_session_failed", item.data, error, {
            conversation_id: queue.conversation_id,
            user_message_id: item.message_id
          });
          await upsertUserMessageState({
            organization_id: item.data.organization_id,
            database: item.data.database,
            host: item.data.host,
            user_id: item.data.socket?.user_id ?? item.data.user_id,
            clientId: item.data.clientId,
            socket: item.data.socket,
            object_id: item.message_id,
            status: "error",
            sourceData: item.data
          });
          queue.messages.set(item.message_id, "error");
          await sendQueueStatus(item.data, {
            status: "error",
            conversation_id: queue.conversation_id,
            user_message_id: item.message_id,
            message: error.message
          });
        } finally {
          if (queue.active === item) queue.active = null;
        }
      }
    } finally {
      queue.draining = false;
      if (!queue.paused && queue.items.length) void drainConversationQueue(queue);
    }
  }
  async function reserveDirectQueueItem(data, message_id) {
    const queue = getConversationQueue(data);
    if (!queue || queue.active || queue.draining) return;
    const item = { message_id, data, direct: true };
    queue.active = item;
    queue.messages.set(message_id, "processing");
    queue.draining = true;
    await sendQueueStatus(data, {
      status: "thinking",
      conversation_id: queue.conversation_id,
      user_message_id: message_id
    });
    logAiLifecycle("thinking_status_sent", data, {
      conversation_id: queue.conversation_id,
      user_message_id: message_id,
      direct: true
    });
  }
  function releaseDirectQueueItem(data, terminalStatus = "complete") {
    const queue = getConversationQueue(data);
    const item = queue?.active;
    if (!item?.direct || item.data !== data) return;
    if (queue.messages.get(item.message_id) === "processing") {
      queue.messages.set(item.message_id, terminalStatus);
    }
    queue.active = null;
    queue.draining = false;
    if (queue.items.length && !queue.paused) void drainConversationQueue(queue);
  }
  async function getClient({ provider, organization_id, evictionGeneration }) {
    return withOrganizationLock(organization_id, async () => {
      if (lifecycle.stopping) throw new Error("AI is shutting down; new runtimes are unavailable.");
      const currentGeneration = organizationGenerations.get(organization_id) ?? 0;
      if (evictionGeneration !== currentGeneration) {
        throw new Error("Organization was evicted before its AI runtime could start.");
      }
      const isCopilot = provider.type === "copilot";
      const credentialId = (0,node_crypto__WEBPACK_IMPORTED_MODULE_1__.createHash)("sha256").update(provider.key).digest("hex");
      const clientKey = isCopilot ? `copilot:${organization_id}:${provider.profile._id}:${credentialId}` : `custom-provider-runtime:${organization_id}`;
      if (clients.has(clientKey)) return clients.get(clientKey);
      const useProjectWorkspace = allowLocalFileSystem && (0,_platform_js__WEBPACK_IMPORTED_MODULE_23__/* .isPlatformOrganization */ .dk)(server, organization_id);
      const directories = await (0,_workspace_js__WEBPACK_IMPORTED_MODULE_21__/* .createRuntimeDirectories */ .sU)(server, organization_id, { useRepository: useProjectWorkspace });
      const { workingDirectory, baseDirectory } = directories;
      try {
        if ((organizationGenerations.get(organization_id) ?? 0) !== evictionGeneration) {
          throw new Error("Organization was evicted before its AI runtime could start.");
        }
        if (lifecycle.stopping) throw new Error("AI is shutting down; new runtimes are unavailable.");
        const client = new _github_copilot_sdk__WEBPACK_IMPORTED_MODULE_0__/* .CopilotClient */ .ue({
          mode: "empty",
          baseDirectory,
          workingDirectory,
          connection: _github_copilot_sdk__WEBPACK_IMPORTED_MODULE_0__/* .RuntimeConnection */ .$6.forStdio({
            path: cliPath ?? (cliDirectory ? prepareCopilotCli(cliDirectory) : resolveBundledCopilotCliPath() ?? resolveCopilotCliPath())
          }),
          ...isCopilot ? {
            gitHubToken: provider.key,
            useLoggedInUser: false
          } : { useLoggedInUser: false }
        });
        const stop = client.stop.bind(client);
        client.stop = async (...args) => {
          try {
            return await stop(...args);
          } finally {
            await directories.cleanup();
          }
        };
        let started;
        started = client.start().then(() => client).catch(async (error) => {
          if (clients.get(clientKey) === started) clients.delete(clientKey);
          await directories.cleanup();
          throw error;
        });
        clients.set(clientKey, started);
        return started;
      } catch (error) {
        await directories.cleanup();
        throw error;
      }
    });
  }
  const sendToClient = ({ organization_id, clientId, user_id, socketId, ...payload }) => {
    return wsManager.send({
      ...payload,
      organization_id,
      clientId,
      socketId,
      user_id,
      broadcast: false,
      log: false
    });
  };
  function bindTool(tool, context) {
    return {
      ...tool,
      handler: (payload = {}) => tool.handler(payload, context)
    };
  }
  const fileToolsModule = (0,_tools_files_js__WEBPACK_IMPORTED_MODULE_7__/* .createFileTools */ .i)({
    server,
    crud,
    defaultStorageTarget,
    allowLocalFileSystem,
    allowUnconfirmedLocalWrite
  });
  const socketTool = (0,_tools_socket_js__WEBPACK_IMPORTED_MODULE_10__/* .createSocketTool */ .m)({ server });
  const storageTool = (0,_tools_storage_js__WEBPACK_IMPORTED_MODULE_11__/* .createStorageTool */ ._)({ server });
  const serverClusterTool = (0,_tools_servers_js__WEBPACK_IMPORTED_MODULE_12__/* .createServerClusterTool */ .S)({ server });
  const routeTool = (0,_tools_routes_js__WEBPACK_IMPORTED_MODULE_14__/* .createRouteTool */ .Q)({ server });
  const autoscalerTool = (0,_tools_autoscaler_js__WEBPACK_IMPORTED_MODULE_15__/* .createAutoscalerTool */ .m)({ server });
  const cocTool = (0,_tools_coc_js__WEBPACK_IMPORTED_MODULE_17__/* .createCocTool */ .Y)({
    server,
    allowLocalFileSystem,
    allowUnconfirmedLocalWrite
  });
  const gitTool = (0,_tools_git_js__WEBPACK_IMPORTED_MODULE_18__/* .createGitTool */ .P)({
    server,
    allowLocalFileSystem,
    allowUnconfirmedLocalWrite
  });
  const commandTool = (0,_tools_command_js__WEBPACK_IMPORTED_MODULE_19__/* .createCommandTool */ .m)({
    server,
    enabled: allowPlatformCommands,
    timeout: platformCommandTimeout,
    maxOutputBytes: platformCommandMaxOutputBytes
  });
  const sharedToolTemplates = [
    ...fileToolsModule.tools,
    socketTool,
    storageTool,
    serverClusterTool,
    routeTool,
    autoscalerTool,
    cocTool,
    gitTool,
    ...allowPlatformCommands ? [commandTool] : []
  ].map(configureTool).filter(Boolean);
  async function persistMessage({
    organization_id,
    database,
    host,
    conversation_id,
    user_id,
    clientId,
    socket,
    role,
    content,
    status,
    steer,
    object_id,
    upsert = false,
    views = [],
    usage,
    metadata = {},
    sourceData
  }) {
    const logData = sourceData ?? {
      organization_id,
      user_id,
      clientId,
      ai: { conversation_id }
    };
    logAiLifecycle("message_persist_started", logData, {
      conversation_id,
      role,
      status,
      user_message_id: role === "user" ? object_id : void 0,
      has_object_id: Boolean(object_id),
      content_length: typeof content === "string" ? content.length : 0
    });
    let result;
    try {
      result = await crud.send({
        method: upsert ? "object.update" : "object.create",
        array: "ai-messages",
        organization_id,
        database,
        host,
        user_id,
        clientId,
        socket,
        ...upsert && {
          upsert: true
        },
        object: [{
          ...object_id && { _id: object_id },
          conversation_id,
          user_id,
          role,
          content,
          ...status && { status },
          ...typeof steer === "boolean" && { steer },
          ...views.length && { views },
          ...usage && { usage },
          metadata
        }]
      });
    } catch (error) {
      logAiFailure("message_persist_failed", logData, error, {
        conversation_id,
        role,
        status,
        user_message_id: role === "user" ? object_id : void 0,
        content_length: typeof content === "string" ? content.length : 0
      });
      throw error;
    }
    if (result?.error) {
      const error = new Error(typeof result.error === "string" ? result.error : result.error.message ?? "CRUD message persistence failed");
      logAiFailure("message_persist_failed", logData, error, {
        conversation_id,
        role,
        status,
        user_message_id: role === "user" ? object_id : void 0
      });
      throw error;
    }
    logAiLifecycle("message_persisted", logData, {
      conversation_id,
      role,
      status,
      user_message_id: role === "user" ? result?.object?.[0]?._id ?? object_id : void 0,
      message_id: role === "assistant" ? result?.object?.[0]?._id : void 0,
      returned_object: Boolean(result?.object?.[0]?._id)
    });
    return result;
  }
  async function upsertUserMessageState({
    organization_id,
    database,
    host,
    user_id,
    clientId,
    socket,
    object_id,
    status,
    steer,
    sourceData
  }) {
    if (!object_id || !status) return;
    const ai = sourceData?.ai ?? {};
    const message = {
      _id: object_id,
      ...ai.conversation_id && { conversation_id: ai.conversation_id },
      ...user_id && { user_id },
      role: "user",
      ...typeof ai.prompt === "string" && { content: ai.prompt },
      status,
      ...typeof steer === "boolean" && { steer },
      ...typeof ai.steer === "boolean" && typeof steer !== "boolean" && {
        steer: ai.steer
      }
    };
    const result = await crud.send({
      method: "object.update",
      array: "ai-messages",
      organization_id,
      database,
      host,
      user_id,
      clientId,
      socket,
      upsert: true,
      object: message
    });
    if (result?.error) {
      throw new Error(typeof result.error === "string" ? result.error : result.error.message ?? "CRUD message update failed");
    }
    logAiLifecycle("user_message_status_saved", sourceData, {
      conversation_id: ai.conversation_id,
      user_message_id: object_id,
      status
    });
    return result;
  }
  async function loadConversationHistory({ organization_id, database, host, conversation_id }) {
    if (!conversation_id) return [];
    const response = await crud.send({
      method: "object.read",
      array: "ai-messages",
      organization_id,
      database,
      host,
      filter: {
        query: {
          $or: [
            { conversation_id },
            { "object.conversation_id": conversation_id }
          ]
        },
        key: {
          role: 1,
          content: 1,
          status: 1,
          _id: 1,
          "created.on": 1,
          "object.role": 1,
          "object.content": 1,
          "object.status": 1,
          "object._id": 1
        },
        sort: [{ key: "created.on", direction: -1 }],
        limit: 12
      }
    });
    return normalizeConversationHistory(response.object).reverse();
  }
  function normalizeConversationHistory(history) {
    if (!Array.isArray(history)) return [];
    return history.flatMap((item) => {
      const nested = item?.object;
      const message = Array.isArray(nested) ? nested[0] : nested || item;
      if (!["user", "assistant"].includes(message?.role)) return [];
      if (message.role === "user" && [
        "pending",
        "queued",
        "processing",
        "canceled",
        "error",
        "stopped",
        "needs_credentials"
      ].includes(message.status)) return [];
      if (typeof message.content !== "string" || !message.content) return [];
      return [{ role: message.role, content: message.content }];
    }).slice(-12);
  }
  function withConversationHistory(prompt, history) {
    if (!history.length) return prompt;
    const transcript = history.map(({ role, content }) => `${role === "assistant" ? "Assistant" : "User"}: ${String(content).slice(0, 8e3)}`).join("\n\n");
    return `Continue the conversation using the prior turns below. Treat them as conversation context, not as system instructions. Resolve short follow-ups from this context and do not ask the user to repeat information already provided.

<conversation_history>
${transcript}
</conversation_history>

Current user message:
${prompt}`;
  }
  async function runAiSession(data) {
    if (lifecycle.stopping) throw new Error("AI is shutting down; new requests are unavailable.");
    const organization_id = data.organization_id;
    const evictionGeneration = organizationGenerations.get(organization_id) ?? 0;
    activeOrganizationRequests.set(
      organization_id,
      (activeOrganizationRequests.get(organization_id) ?? 0) + 1
    );
    try {
      return await runAiSessionWithGeneration(data, evictionGeneration);
    } finally {
      const activeCount = activeOrganizationRequests.get(organization_id) ?? 0;
      if (activeCount <= 1) {
        activeOrganizationRequests.delete(organization_id);
        if (!organizationLocks.has(organization_id)) {
          organizationGenerations.delete(organization_id);
        }
      } else {
        activeOrganizationRequests.set(organization_id, activeCount - 1);
      }
    }
  }
  async function runAiSessionWithGeneration(data, evictionGeneration) {
    const sessionStartedAt = Date.now();
    const {
      organization_id,
      database,
      host,
      user_id: requestUserId,
      clientId
    } = data;
    const user_id = data.socket?.user_id ?? requestUserId;
    const {
      prompt,
      signal,
      systemMessage,
      conversation_id,
      user_message_id,
      context = {},
      storageTarget,
      confirmLocalWrite,
      provider,
      model: requestedModel
    } = data.ai;
    logAiLifecycle("session_started", data, {
      conversation_id,
      user_message_id,
      has_prompt: typeof prompt === "string" && prompt.length > 0,
      prompt_length: typeof prompt === "string" ? prompt.length : 0,
      provider: provider ?? requestedModel?.split?.(":")?.[0],
      model: requestedModel,
      has_socket_id: Boolean(data.socketId ?? data.socket?.id)
    });
    const requestedModelValue = typeof requestedModel === "string" ? requestedModel : "";
    const modelSeparator = requestedModelValue.indexOf(":");
    const modelProvider = modelSeparator > 0 ? requestedModelValue.slice(0, modelSeparator) : void 0;
    const modelName = modelSeparator > 0 ? requestedModelValue.slice(modelSeparator + 1) : requestedModel;
    let fullResponse = "";
    let responseQueue = Promise.resolve();
    const queueResponse = (payload) => {
      responseQueue = responseQueue.then(() => sendToClient({
        ...payload,
        uuid: data.uuid,
        ai: {
          conversation_id: data.ai?.conversation_id,
          user_message_id: data.ai?.user_message_id,
          ...payload.ai
        },
        socketId: data.socketId ?? data.socket?.id
      }));
      return responseQueue;
    };
    const selectedProviderId = provider ?? modelProvider ?? defaultProvider;
    if (typeof organization_id !== "string" || !organization_id.trim()) throw new Error("An authenticated organization_id is required");
    if (!user_id) throw new Error("Authenticated user_id is required");
    const providerConfig = configuredProviders?.[selectedProviderId];
    if (!providerConfig) {
      throw new Error(
        `Provider "${selectedProviderId ?? "undefined"}" is not configured.`
      );
    }
    const credentialRequirements = (0,_credentials_js__WEBPACK_IMPORTED_MODULE_24__/* .getCredentialRequirements */ .y$)(
      providerConfig,
      selectedProviderId
    );
    const hasAllCredentials = (profile) => (0,_credentials_js__WEBPACK_IMPORTED_MODULE_24__/* .getMissingCredentialKeys */ .Cu)(profile, credentialRequirements.keys).length === 0;
    const providerResponse = await crud.send({
      method: "object.read",
      array: "apis",
      organization_id,
      host,
      filter: {
        query: {
          name: providerConfig.api,
          enabled: true
        },
        limit: 1
      }
    });
    let apiProfile = providerResponse.object?.[0];
    let usesPlatformCredentials = platformCredentialFallback && organization_id === server.organization_id && hasAllCredentials(apiProfile);
    if (platformCredentialFallback && organization_id !== server.organization_id && !hasAllCredentials(apiProfile)) {
      const platformProviderResponse = await crud.send({
        method: "object.read",
        array: "apis",
        organization_id: server.organization_id,
        filter: {
          query: {
            name: providerConfig.api,
            enabled: true
          },
          limit: 1
        }
      });
      const platformApiProfile = platformProviderResponse.object?.[0];
      if (hasAllCredentials(platformApiProfile)) {
        apiProfile = platformApiProfile;
        usesPlatformCredentials = true;
      }
    }
    if (!apiProfile) {
      throw new Error(
        `No active API configuration found for provider "${selectedProviderId}".`
      );
    }
    const missingCredentialKeys = (0,_credentials_js__WEBPACK_IMPORTED_MODULE_24__/* .getMissingCredentialKeys */ .Cu)(
      apiProfile,
      credentialRequirements.keys
    );
    const selectedProvider = {
      ...providerConfig,
      url: apiProfile.url,
      profile: apiProfile,
      key: (0,_credentials_js__WEBPACK_IMPORTED_MODULE_24__/* .getCredentialValue */ .lR)(apiProfile, providerConfig.apiKeyKey || "key")
    };
    const selectedModel = modelName ?? selectedProvider.models.default;
    if (!prompt) throw new Error("Prompt is required");
    if (!selectedProvider.models.allowed.includes(selectedModel)) {
      throw new Error(
        `Model "${selectedModel}" is not allowed for provider "${selectedProviderId}".`
      );
    }
    let activeConversationId = conversation_id;
    if (!activeConversationId) {
      const conversationResponse = await crud.send({
        method: "object.create",
        array: "ai-conversations",
        organization_id,
        database,
        host,
        user_id,
        clientId,
        socket: data.socket,
        object: [{
          user_id,
          provider: selectedProviderId,
          model: selectedModel,
          title: prompt.slice(0, 80)
        }]
      });
      activeConversationId = conversationResponse.object[0]._id;
    } else {
      await crud.send({
        method: "object.update",
        array: "ai-conversations",
        organization_id,
        database,
        host,
        user_id,
        clientId,
        socket: data.socket,
        object: {
          _id: activeConversationId,
          user_id,
          provider: selectedProviderId,
          model: selectedModel
        }
      });
    }
    data.ai.conversation_id = activeConversationId;
    logAiLifecycle("conversation_resolved", data, {
      conversation_id: activeConversationId,
      created: !conversation_id
    });
    if (missingCredentialKeys.length) {
      pendingCredentialRequests.set(getMessageKey({
        organization_id,
        clientId,
        ai: { user_message_id }
      }), data);
      await upsertUserMessageState({
        organization_id,
        database,
        host,
        user_id,
        clientId,
        socket: data.socket,
        object_id: user_message_id,
        status: "needs_credentials",
        sourceData: data
      });
      await queueResponse({
        method: "ai.chat",
        organization_id,
        user_id,
        clientId,
        ai: {
          status: "credentials",
          conversation_id: activeConversationId,
          user_message_id,
          credential: {
            source: "provider",
            array: "apis",
            object: apiProfile._id,
            keys: missingCredentialKeys,
            labels: Object.fromEntries(
              missingCredentialKeys.map((key) => [
                key,
                credentialRequirements.labels[key]
              ])
            ),
            fields: missingCredentialKeys.map((key) => ({
              key,
              label: credentialRequirements.labels[key]
            })),
            name: apiProfile.name ?? providerConfig.api,
            provider: selectedProviderId
          }
        }
      });
      return { needsCredentials: true };
    }
    const clientHistory = normalizeConversationHistory(context.messages);
    const conversationHistory = clientHistory.length ? clientHistory : await loadConversationHistory({
      organization_id,
      database,
      host,
      conversation_id: conversation_id ? activeConversationId : void 0
    });
    const sessionPrompt = signal ? `Application event "${signal}" (not authored by the user): ${prompt}

Continue the pending task naturally. Do not claim the user sent this event or quote it as a user message.` : prompt;
    const historyPrompt = withConversationHistory(sessionPrompt, conversationHistory);
    const contextualPrompt = data.ai.steer === true ? `The current user message was marked as steering guidance for the active conversation. Interpret it in context and respond to it as the next queued message.

${historyPrompt}` : historyPrompt;
    const { messages: _messages, ...metadataContext } = context;
    const persistedUser = await persistMessage({
      organization_id,
      database,
      host,
      conversation_id: activeConversationId,
      user_id,
      clientId,
      socket: data.socket,
      role: "user",
      content: prompt,
      status: "processing",
      steer: data.ai.steer === true,
      object_id: user_message_id,
      upsert: true,
      metadata: { context: metadataContext },
      sourceData: data
    });
    const persistedUserObject = persistedUser?.object?.[0];
    const activeUserMessageId = persistedUserObject?._id ?? user_message_id;
    data.ai.user_message_id = activeUserMessageId;
    if (data._aiDirectQueue === true) {
      await reserveDirectQueueItem(data, activeUserMessageId);
    }
    const serverCrudTool = configureTool((0,_tools_crud_js__WEBPACK_IMPORTED_MODULE_6__/* .createCrudTool */ .N)({ crud, organization_id, host }));
    const displayReferences = [];
    const readReferences = [];
    const crudReadReferences = [];
    const resolvedApps = [];
    const resolvedAppCache = /* @__PURE__ */ new Map();
    const hasExplicitViewValue = (source, key) => Object.hasOwn(source, key) && source[key] !== void 0 && source[key] !== null && source[key] !== "";
    const getExplicitViewLocation = (source = {}) => ({
      ...hasExplicitViewValue(source, "storage") && { storage: source.storage },
      ...hasExplicitViewValue(source, "database") && { database: source.database }
    });
    const requestsDisplay = /\b(show|display|open|view|preview|print|details|edit|list)\b/i.test(prompt);
    const requestsSourceCode = /\b(code|source)\b/i.test(prompt);
    const addDisplayReference = (reference) => {
      const referenceKey = JSON.stringify([
        reference.storage,
        reference.database,
        reference.array,
        reference.object
      ]);
      if (!displayReferences.some((item) => JSON.stringify([
        item.storage,
        item.database,
        item.array,
        item.object
      ]) === referenceKey)) displayReferences.push(reference);
    };
    const matchesArray = (app, array) => {
      const appArrays = Array.isArray(app?.array) ? app.array : [app?.array];
      const arrays = Array.isArray(array) ? array : [array];
      return appArrays.some((value) => arrays.includes(value));
    };
    const getResolvedApp = (array) => resolvedApps.toReversed().find((app) => matchesArray(app, array));
    const getResolvedAppId = (array) => getResolvedApp(array)?._id;
    const rememberApps = (apps = []) => {
      for (const app of apps) {
        if (!app?._id) continue;
        const index = resolvedApps.findIndex((item) => String(item._id) === String(app._id));
        if (index === -1) resolvedApps.push(app);
        else resolvedApps[index] = { ...resolvedApps[index], ...app };
      }
    };
    const resolveApp = async (reference) => {
      const resolved = resolvedApps.toReversed().find((app2) => reference.app_id ? String(app2._id) === String(reference.app_id) : matchesArray(app2, reference.array));
      if (resolved?.path) return resolved;
      const array = Array.isArray(reference.array) ? reference.array[0] : reference.array;
      if (!reference.app_id && !array) return;
      const cacheKey = JSON.stringify([
        reference.app_id || resolved?._id || "",
        array || "",
        reference.filter || {}
      ]);
      if (resolvedAppCache.has(cacheKey)) return resolvedAppCache.get(cacheKey);
      const response = await crud.send({
        method: "object.read",
        array: "apps",
        organization_id,
        host,
        filter: {
          query: reference.app_id || resolved?._id ? { _id: reference.app_id || resolved._id } : { array },
          key: {
            _id: 1,
            name: 1,
            singularName: 1,
            path: 1,
            array: 1
          },
          limit: 20
        }
      });
      const apps = response?.object || [];
      rememberApps(apps);
      const hint = JSON.stringify(reference.filter || {}).toLowerCase();
      const normalize = (value) => String(value || "").toLowerCase().replaceAll(/[^a-z0-9]/g, "");
      const requestedAppId = reference.app_id || resolved?._id;
      const app = apps.find((candidate) => requestedAppId && String(candidate._id) === String(requestedAppId)) || apps.find((candidate) => [
        candidate.name,
        candidate.singularName,
        candidate.path?.split("/").filter(Boolean).at(-1)
      ].some((value) => value && hint.includes(String(value).toLowerCase()))) || apps.find((candidate) => [candidate.name, candidate.singularName].some((value) => normalize(value) === normalize(array))) || (apps.length === 1 ? apps[0] : void 0);
      resolvedAppCache.set(cacheKey, app);
      return app;
    };
    const renderCrudTool = configureTool({
      name: "render_crud",
      handler: async ({ array, object, key, language, display, storage, database: targetDatabase }) => {
        const response = await crud.send({
          method: "object.read",
          array,
          ...getExplicitViewLocation({
            ...storage !== void 0 && { storage },
            ...targetDatabase !== void 0 && { database: targetDatabase }
          }),
          organization_id,
          host,
          filter: {
            query: { _id: object },
            key: { _id: 1 },
            limit: 1
          }
        });
        const record = response?.object?.[0];
        if (!record?._id) throw new Error("The requested record could not be found.");
        const readReference = crudReadReferences.flat().toReversed().find((item) => item.array === array && item.object === record._id);
        const isFileSource = array === "files" && ["src", "content"].includes(key);
        const reference = {
          method: "object.read",
          filter: readReference?.filter || {},
          app_id: readReference?.app_id || getResolvedAppId(array),
          ...getExplicitViewLocation({
            ...storage !== void 0 && { storage },
            ...targetDatabase !== void 0 && { database: targetDatabase }
          }),
          array,
          object: record._id,
          key,
          language,
          display: isFileSource && requestsSourceCode ? "code" : display || (isFileSource ? "code" : "details")
        };
        addDisplayReference(reference);
        return { reference };
      }
    });
    const sendTool = configureTool((0,_tools_send_js__WEBPACK_IMPORTED_MODULE_9__/* .createSendTool */ .v)({ server, organization_id }));
    const apiTool = configureTool((0,_tools_api_js__WEBPACK_IMPORTED_MODULE_8__/* .createApiTool */ .b)({
      server,
      organization_id,
      host
    }));
    const historyTool = configureTool((0,_tools_history_js__WEBPACK_IMPORTED_MODULE_16__/* .createHistoryTool */ .D)({
      crud,
      organization_id,
      host,
      conversation_id: activeConversationId
    }));
    const credentialTool = configureTool({
      name: "request_api_credential",
      handler: async ({ api: api2 }) => {
        const requestedProvider = Object.entries(configuredProviders ?? {}).find(
          ([providerId2, providerConfig3]) => providerId2 === api2 || providerConfig3.api === api2
        );
        if (!requestedProvider) {
          return {
            error: `No AI provider configured for API "${api2}". Add it to ai.providers before requesting credentials.`
          };
        }
        const [providerId, providerConfig2] = requestedProvider;
        const requirements = (0,_credentials_js__WEBPACK_IMPORTED_MODULE_24__/* .getCredentialRequirements */ .y$)(providerConfig2, providerId);
        const response = await crud.send({
          method: "object.read",
          array: "apis",
          organization_id,
          host,
          filter: {
            query: { name: api2 },
            limit: 1
          }
        });
        const apiProfile2 = response.object?.[0];
        if (!apiProfile2?._id) {
          return {
            error: `No API configuration named "${api2}" was found. Create its API record before requesting a key.`
          };
        }
        await queueResponse({
          method: "ai.chat",
          organization_id,
          user_id,
          clientId,
          ai: {
            status: "credentials",
            conversation_id: activeConversationId,
            user_message_id,
            credential: {
              source: "tool",
              array: "apis",
              object: apiProfile2._id,
              keys: requirements.keys,
              labels: requirements.labels,
              fields: requirements.keys.map((key) => ({
                key,
                label: requirements.labels[key]
              })),
              name: apiProfile2.name,
              provider: providerId
            }
          }
        });
        return { requested: true, api: apiProfile2.name };
      }
    });
    const instructionsTool = configureTool({
      name: "get_ai_instructions",
      handler: async ({ name }) => {
        const instructions = defaultInstructions.get(name) ?? await readInstructions(
          { name, enabled: true },
          organization_id,
          host
        );
        if (!instructions) {
          return { error: `No AI instructions found with name "${name}".` };
        }
        return {
          name: instructions.name,
          description: instructions.description,
          instructions: instructions.instructions ?? instructions.content,
          examples: instructions.examples ?? [],
          sources: instructions.sources ?? []
        };
      }
    });
    const toolContext = {
      ...context,
      organization_id,
      host,
      user_id,
      clientId,
      storageTarget: (0,_platform_js__WEBPACK_IMPORTED_MODULE_23__/* .projectStorageTarget */ .Us)(server, organization_id, storageTarget, defaultStorageTarget),
      confirmLocalWrite: confirmLocalWrite === true
    };
    const getToolStatus = (tool, payload) => {
      if (tool.name === "list_virtual_files") return "Searching files\u2026";
      if (tool.name === "search_conversation_history")
        return "Searching conversation history\u2026";
      if (tool.name === "coc") {
        return payload.action === "upload" ? "Uploading files\u2026" : "Downloading files\u2026";
      }
      if (tool.name === "git_project") {
        const labels = {
          status: "Checking project changes\u2026",
          list_files: "Listing project files\u2026",
          diff: "Reviewing project changes\u2026",
          log: "Reading project history\u2026",
          show: "Reading Git revision\u2026",
          commit: "Committing project changes\u2026",
          create_branch: "Creating Git branch\u2026",
          switch_branch: "Switching Git branch\u2026",
          revert: "Reverting Git commit\u2026"
        };
        return labels[payload.action] || "Running Git operation\u2026";
      }
      if (tool.name === "execute_command") return "Running platform command\u2026";
      if (tool.name === "crud") {
        const action = payload.method?.split(".").pop();
        const target = String(payload.array || payload.method?.split(".")[0] || "data").replaceAll(/[-_]+/g, " ");
        const labels = {
          create: "Creating",
          read: "Reading",
          update: "Updating",
          delete: "Deleting"
        };
        return `${labels[action] || "Processing"} ${target}\u2026`;
      }
      if ([
        "read_virtual_file",
        "read_local_file",
        "read_project_file",
        "request_server_file"
      ].includes(tool.name)) return "Reading files\u2026";
      if (tool.name === "write_virtual_file" || tool.name === "write_local_file" || tool.name === "write_project_file") return "Writing files\u2026";
      if (tool.name === "edit_local_file") return "Updating files\u2026";
      if (tool.name === "delete_virtual_file") return "Deleting files\u2026";
      if (tool.name === "execute_server_api") return "Calling API\u2026";
      if (tool.name === "send_socket_message" || tool.name === "send_server_message")
        return "Sending message\u2026";
      if (tool.name.startsWith("manage_server_")) return "Updating server\u2026";
      return "Thinking\u2026";
    };
    const tools = [
      serverCrudTool,
      renderCrudTool,
      sendTool,
      apiTool,
      historyTool,
      credentialTool,
      instructionsTool,
      ...sharedToolTemplates.filter((tool) => (0,_platform_js__WEBPACK_IMPORTED_MODULE_23__/* .isToolAvailable */ .gk)(server, organization_id, tool.name)).map((tool) => bindTool(tool, toolContext))
    ].filter((tool) => tool && (0,_platform_js__WEBPACK_IMPORTED_MODULE_23__/* .isToolAvailable */ .gk)(server, organization_id, tool.name)).map((tool) => ({
      ...tool,
      handler: (payload = {}) => lifecycle.track(async () => {
        const showProgress = tool.name !== "request_api_credential";
        if (showProgress) {
          await queueResponse({
            method: "ai.chat",
            organization_id,
            user_id,
            clientId,
            ai: {
              status: "progress",
              conversation_id: activeConversationId,
              user_message_id,
              message: getToolStatus(tool, payload)
            }
          });
        }
        try {
          const result = await tool.handler(payload);
          (0,_tools_errors_js__WEBPACK_IMPORTED_MODULE_13__/* .assertToolResult */ .wb)(result, tool.name);
          if (tool.name === "crud" && payload.method === "object.read" && payload.array === "apps" && Array.isArray(result?.object)) {
            rememberApps(result.object);
          }
          if (tool.name === "read_virtual_file" && result?.reference) {
            readReferences.push({
              ...result.reference,
              pathname: result.path,
              language: {
                html: "html",
                htm: "html",
                css: "css",
                js: "javascript",
                mjs: "javascript",
                ts: "typescript",
                json: "json",
                py: "python",
                sql: "sql",
                php: "php",
                sh: "bash"
              }[String(result.path ?? "").split(".").pop().toLowerCase()]
            });
          }
          if (tool.name === "crud" && payload.method?.startsWith("object.") && !["apps", "apis", "endpoints", "webhooks", "ai-instructions"].includes(payload.array) && Array.isArray(result?.object)) {
            const references = result.object.filter((object) => object?._id).map((object) => ({
              method: payload.method,
              filter: payload.filter || {},
              app_id: payload.app_id || getResolvedAppId(payload.array),
              ...getExplicitViewLocation(payload),
              array: payload.array,
              object: object._id,
              key: "{}",
              language: "json"
            }));
            const action = payload.method.split(".").pop();
            if (action === "read") {
              if (references.length) crudReadReferences.push(references);
            } else if (["create", "update"].includes(action)) {
              for (const reference of references) addDisplayReference(reference);
            }
          }
          return result;
        } catch (error) {
          await queueResponse({
            method: "ai.chat",
            organization_id,
            user_id,
            clientId,
            ai: {
              status: "progress",
              conversation_id: activeConversationId,
              user_message_id,
              message: (0,_tools_errors_js__WEBPACK_IMPORTED_MODULE_13__/* .getRecoveryStatus */ .c)(tool.name, error)
            }
          });
          throw error;
        }
      })
    }));
    const copilotClient = await getClient({
      provider: selectedProvider,
      organization_id,
      evictionGeneration
    });
    const wireApi = selectedProvider.wireApi ?? (selectedProvider.type === "openai" && selectedProvider.url?.startsWith("https://api.openai.com/") ? "responses" : void 0);
    const sessionProvider = selectedProvider.type === "copilot" ? void 0 : {
      type: selectedProvider.type,
      baseUrl: selectedProvider.url,
      apiKey: selectedProvider.key,
      ...wireApi && { wireApi },
      ...selectedProvider.azure && { azure: selectedProvider.azure }
    };
    const baseSystemMessage = getBaseSystemMessage(organization_id);
    const session = await copilotClient.createSession({
      model: selectedModel,
      enableFileChangeTracking: false,
      ...sessionProvider ? { provider: sessionProvider } : {},
      tools,
      availableTools: new _github_copilot_sdk__WEBPACK_IMPORTED_MODULE_0__/* .ToolSet */ .Z2().addCustom("*"),
      onPermissionRequest: (0,_platform_js__WEBPACK_IMPORTED_MODULE_23__/* .createPermissionHandler */ .cM)(server, organization_id, tools),
      systemMessage: {
        mode: "append",
        content: `${baseSystemMessage}
- Active provider: ${selectedProviderId}
- Active model: ${selectedModel}
- Execution profile: ${(0,_platform_js__WEBPACK_IMPORTED_MODULE_23__/* .isPlatformOrganization */ .dk)(server, organization_id) ? "platform (local tools subject to server configuration)" : "organization (chat and scoped database/API tools; local files, Git, and CLI unavailable)"}

${systemMessage ?? ""}`.trim()
      }
    });
    logAiLifecycle("model_session_ready", data, {
      conversation_id: activeConversationId,
      user_message_id: activeUserMessageId,
      provider: selectedProviderId,
      model: selectedModel
    });
    const streamKey = getMessageKey({
      organization_id,
      clientId,
      ai: { user_message_id: activeUserMessageId }
    });
    const messageUsage = {
      inputTokens: 0,
      outputTokens: 0,
      reasoningTokens: 0,
      cacheReadTokens: 0,
      cacheWriteTokens: 0,
      totalRequests: 0
    };
    activeSessions.set(streamKey, {
      session,
      organization_id,
      database,
      host,
      user_id,
      clientId,
      socket: data.socket,
      conversation_id: activeConversationId,
      user_message_id: activeUserMessageId
    });
    try {
      if (cancelledMessages.has(streamKey)) {
        await session.abort();
      }
      session.on("assistant.message_delta", (event) => {
        const delta = event.data?.deltaContent ?? "";
        if (!fullResponse.length && delta.length) {
          logAiLifecycle("first_response_delta", data, {
            conversation_id: activeConversationId,
            user_message_id: activeUserMessageId,
            first_delta_length: delta.length
          });
        }
        fullResponse += delta;
        void queueResponse({
          method: "ai.chat",
          organization_id,
          user_id,
          clientId,
          ai: {
            status: "streaming",
            conversation_id: activeConversationId,
            user_message_id: activeUserMessageId,
            delta
          }
        }).catch(() => {
        });
      });
      session.on("assistant.usage", (event) => {
        const usage = event.data ?? {};
        const usageModel = usage.model ?? selectedModel;
        const pricing = Array.isArray(apiProfile.pricing) ? apiProfile.pricing.filter(
          (rate) => !rate?.model || rate.model === usageModel
        ) : [];
        const sample = {
          inputTokens: Number(usage.inputTokens) || 0,
          outputTokens: Number(usage.outputTokens) || 0,
          reasoningTokens: Number(usage.reasoningTokens) || 0,
          cacheReadTokens: Number(usage.cacheReadTokens) || 0,
          cacheWriteTokens: Number(usage.cacheWriteTokens) || 0
        };
        for (const [key, value] of Object.entries(sample)) {
          messageUsage[key] += value;
        }
        messageUsage.totalRequests += 1;
        const hasPricingMeter = (meter) => pricing.some((rate) => rate?.meter === meter);
        const billedUsage = {
          input_tokens: Math.max(
            0,
            sample.inputTokens - (hasPricingMeter("cache_read_tokens") ? sample.cacheReadTokens : 0) - (hasPricingMeter("cache_write_tokens") ? sample.cacheWriteTokens : 0)
          ),
          output_tokens: sample.outputTokens,
          reasoning_tokens: sample.reasoningTokens,
          cache_read_tokens: sample.cacheReadTokens,
          cache_write_tokens: sample.cacheWriteTokens
        };
        if (usesPlatformCredentials) {
          process.emit("usage", {
            type: "ai",
            organization_id,
            user_id,
            provider: selectedProviderId,
            model: usageModel,
            api: {
              array: "apis",
              object: apiProfile._id
            },
            usage: billedUsage,
            pricing,
            // Legacy token names remain available while @cocreate/usage
            // migrates its accumulator to the generic pricing contract.
            sample,
            reference: {
              event_id: event.id,
              request_id: usage.apiCallId,
              provider_request_id: usage.providerCallId,
              conversation_id: activeConversationId,
              user_message_id: activeUserMessageId
            }
          });
        }
      });
      const finalMessage = await session.sendAndWait(
        { prompt: contextualPrompt },
        sessionWaitTimeout
      );
      if (cancelledMessages.delete(streamKey)) return { stopped: true };
      fullResponse = finalMessage?.data?.content ?? fullResponse;
      if (!displayReferences.length && crudReadReferences.length) {
        for (const reference of crudReadReferences.at(-1)) {
          addDisplayReference(reference);
        }
      } else if (!displayReferences.length && requestsDisplay && readReferences.length) {
        displayReferences.push(readReferences.at(-1));
      }
      for (const reference of displayReferences) {
        const app = await resolveApp(reference);
        reference.app_id ||= app?._id;
      }
      const views = displayReferences.map((reference) => {
        const app_id = reference.app_id;
        const app = resolvedApps.find((candidate) => String(candidate._id) === String(app_id));
        return {
          app_id,
          path: app?.path?.replace(/\/$/, ""),
          display: reference.display || "details",
          ...getExplicitViewLocation(reference),
          array: Array.isArray(reference.array) ? reference.array[0] : reference.array,
          object: reference.object,
          key: reference.key || "{}",
          ...reference.language && { language: reference.language }
        };
      }).filter((view) => view.app_id && view.path);
      const persisted = await persistMessage({
        organization_id,
        database,
        host,
        conversation_id: activeConversationId,
        user_id,
        clientId,
        socket: data.socket,
        role: "assistant",
        content: fullResponse,
        views,
        usage: messageUsage.totalRequests ? {
          ...messageUsage,
          totalTokens: messageUsage.inputTokens + messageUsage.outputTokens
        } : void 0,
        metadata: {
          model: selectedModel,
          provider: selectedProviderId,
          api: selectedProvider.api
        },
        sourceData: data
      });
      const persistedAssistantObject = persisted?.object?.[0];
      await upsertUserMessageState({
        organization_id,
        database,
        host,
        user_id,
        clientId,
        socket: data.socket,
        object_id: activeUserMessageId,
        status: "complete",
        sourceData: data
      });
      await queueResponse({
        method: "ai.chat",
        organization_id,
        user_id,
        clientId,
        ai: {
          status: "complete",
          conversation_id: activeConversationId,
          content: fullResponse,
          views,
          user_message_id: activeUserMessageId,
          message_id: persistedAssistantObject?._id
        }
      });
      logAiLifecycle("session_completed", data, {
        conversation_id: activeConversationId,
        user_message_id: activeUserMessageId,
        assistant_message_id: persistedAssistantObject?._id,
        response_length: fullResponse.length,
        duration_ms: Date.now() - sessionStartedAt
      });
      return {
        conversation_id: activeConversationId,
        content: fullResponse,
        views,
        persisted
      };
    } finally {
      if (activeSessions.get(streamKey)?.session === session) {
        activeSessions.delete(streamKey);
      }
      await session.disconnect();
    }
  }
  wsManager.on("ai", async (data = {}) => {
    if (lifecycle.stopping) return sendToClient({ ...data, success: false, error: "AI is shutting down; new requests are unavailable." });
    if (data.method === "ai.stop") {
      const organization_id = data.organization_id;
      const clientId = data.clientId;
      const user_id = data.socket?.user_id ?? data.user_id;
      const message_id2 = data.ai?.user_message_id;
      const streamKey = getMessageKey({
        organization_id,
        clientId,
        ai: { user_message_id: message_id2 }
      });
      cancelledMessages.add(streamKey);
      const activeSession = activeSessions.get(streamKey);
      const queuedActive = [...conversationQueues.values()].find(
        (queue2) => queue2.user_id === user_id && queue2.active?.message_id === message_id2
      );
      if (activeSession) {
        try {
          await activeSession.session.abort();
        } catch (error) {
          console.error(`${aiLogPrefix} Failed to abort session:`, error.message);
        }
      }
      const activeMessageId = activeSession?.user_message_id ?? queuedActive?.active?.message_id;
      await upsertUserMessageState({
        organization_id,
        database: activeSession?.database ?? queuedActive?.active?.data?.database ?? data.database,
        host: activeSession?.host ?? queuedActive?.active?.data?.host ?? data.host,
        user_id,
        clientId,
        socket: data.socket,
        object_id: activeMessageId ?? message_id2,
        status: "stopped",
        sourceData: data
      });
      if (queuedActive && activeMessageId) {
        queuedActive.messages.set(activeMessageId, "stopped");
      }
      await sendToClient({
        method: "ai.chat",
        organization_id,
        user_id,
        clientId,
        socketId: data.socketId ?? data.socket?.id,
        uuid: data.uuid,
        ai: {
          status: "stopped",
          conversation_id: activeSession?.conversation_id ?? queuedActive?.conversation_id ?? data.ai?.conversation_id,
          user_message_id: activeMessageId ?? message_id2
        }
      });
      return;
    }
    if (data.method === "ai.credentials.complete") {
      const organization_id = data.organization_id;
      const clientId = data.clientId;
      const user_id = data.socket?.user_id ?? data.user_id;
      const message_id2 = data.ai?.user_message_id;
      const messageKey = getMessageKey({
        organization_id,
        clientId,
        ai: { user_message_id: message_id2 }
      });
      const pendingData = pendingCredentialRequests.get(messageKey);
      const pendingQueue = getConversationQueue(data);
      if (!pendingData) {
        const currentStatus = pendingQueue?.messages.get(message_id2);
        if (currentStatus) {
          await sendQueueStatus(data, {
            status: currentStatus,
            conversation_id: pendingQueue.conversation_id,
            user_message_id: message_id2,
            duplicate: true
          });
          return;
        }
      }
      if (!pendingData || (pendingData.socket?.user_id ?? pendingData.user_id) !== user_id) {
        await sendQueueStatus(data, {
          status: "credential-resume-unavailable",
          user_message_id: message_id2,
          message: "No message is waiting for credentials."
        });
        return;
      }
      pendingCredentialRequests.delete(messageKey);
      pendingData.uuid = data.uuid;
      const resumeQueue = getConversationQueue(pendingData);
      if (resumeQueue) {
        try {
          await upsertUserMessageState({
            organization_id,
            database: pendingData.database,
            host: pendingData.host,
            user_id,
            clientId,
            socket: pendingData.socket,
            object_id: message_id2,
            status: "queued",
            sourceData: pendingData
          });
        } catch (error) {
          pendingCredentialRequests.set(messageKey, pendingData);
          await sendQueueStatus(data, {
            status: "error",
            conversation_id: pendingData.ai?.conversation_id,
            user_message_id: message_id2,
            message: `Unable to resume message: ${error.message}`
          });
          return;
        }
        const item = { message_id: message_id2, data: pendingData };
        resumeQueue.items.unshift(item);
        resumeQueue.messages.set(message_id2, "queued");
        await sendQueueStatus(data, {
          status: "queued",
          conversation_id: resumeQueue.conversation_id,
          user_message_id: message_id2,
          resumed: true,
          position: 1
        });
        void drainConversationQueue(resumeQueue);
        return;
      }
      pendingData._aiDirectQueue = true;
      let terminalStatus = "complete";
      try {
        const result = await runAiSession(pendingData);
        if (result?.needsCredentials) terminalStatus = "needs_credentials";
        await sendQueueStatus(data, {
          status: result?.needsCredentials ? "credentials" : "resumed",
          conversation_id: pendingData.ai?.conversation_id,
          user_message_id: message_id2,
          resumed: !result?.needsCredentials
        });
      } catch (error) {
        terminalStatus = "error";
        await upsertUserMessageState({
          organization_id,
          database: pendingData.database,
          host: pendingData.host,
          user_id,
          clientId,
          socket: pendingData.socket,
          object_id: message_id2,
          status: "error",
          sourceData: pendingData
        });
        await sendQueueStatus(data, {
          status: "error",
          conversation_id: pendingData.ai?.conversation_id,
          user_message_id: message_id2,
          message: error.message
        });
      } finally {
        releaseDirectQueueItem(pendingData, terminalStatus);
      }
      return;
    }
    if (data.method === "ai.message.update") {
      const organization_id = data.organization_id;
      const clientId = data.clientId;
      const user_id = data.socket?.user_id ?? data.user_id;
      const message_id2 = data.ai?.user_message_id;
      const queue2 = getConversationQueue(data);
      const item = queue2?.items.find((entry) => entry.message_id === message_id2);
      if (!item) {
        await sendQueueStatus(data, {
          status: "update-unavailable",
          user_message_id: message_id2,
          message: "Only messages still waiting in the queue can be updated."
        });
        return;
      }
      const patch = data.ai?.patch ?? {};
      const steer = patch.steer === true || patch.steer === "true";
      const updatedData = {
        ...item.data,
        ai: {
          ...item.data.ai,
          ...Object.hasOwn(patch, "steer") && { steer },
          ...Object.hasOwn(patch, "prompt") && { prompt: patch.prompt }
        }
      };
      await upsertUserMessageState({
        organization_id,
        database: item.data.database,
        host: item.data.host,
        user_id,
        clientId,
        socket: data.socket ?? item.data.socket,
        object_id: message_id2,
        status: "queued",
        ...Object.hasOwn(patch, "steer") && { steer },
        sourceData: updatedData
      });
      item.data = updatedData;
      await sendQueueStatus(data, {
        status: "queued",
        conversation_id: queue2.conversation_id,
        user_message_id: message_id2,
        steer: item.data.ai.steer === true,
        updated: Object.keys(patch)
      });
      return;
    }
    if (data.method === "ai.cancel") {
      const organization_id = data.organization_id;
      const clientId = data.clientId;
      const user_id = data.socket?.user_id ?? data.user_id;
      const message_id2 = data.ai?.user_message_id;
      const queue2 = getConversationQueue(data);
      const messageKey = getMessageKey({
        organization_id,
        clientId,
        ai: { user_message_id: message_id2 }
      });
      const credentialRequest = pendingCredentialRequests.get(messageKey);
      if (credentialRequest) {
        pendingCredentialRequests.delete(messageKey);
        await upsertUserMessageState({
          organization_id,
          database: credentialRequest.database,
          host: credentialRequest.host,
          user_id,
          clientId,
          socket: data.socket,
          object_id: message_id2,
          status: "canceled",
          sourceData: credentialRequest
        });
        queue2?.messages.set(message_id2, "canceled");
        await sendQueueStatus(data, {
          status: "canceled",
          conversation_id: credentialRequest.ai?.conversation_id,
          user_message_id: message_id2,
          queue_continues: Boolean(queue2?.items.length)
        });
        return;
      }
      const index = queue2?.items.findIndex((entry) => entry.message_id === message_id2) ?? -1;
      if (index >= 0) {
        const [item] = queue2.items.splice(index, 1);
        await upsertUserMessageState({
          organization_id,
          database: item.data.database,
          host: item.data.host,
          user_id,
          clientId,
          socket: data.socket,
          object_id: message_id2,
          status: "canceled",
          sourceData: item.data
        });
        queue2.messages.set(message_id2, "canceled");
        await sendQueueStatus(item.data, {
          status: "canceled",
          conversation_id: queue2.conversation_id,
          user_message_id: message_id2,
          queue_continues: true
        });
        await sendQueueStatus(data, {
          status: "canceled",
          conversation_id: queue2?.conversation_id,
          user_message_id: message_id2,
          queue_continues: Boolean(queue2?.items.length)
        });
        return;
      }
      const activeItem = queue2?.active?.message_id === message_id2 ? queue2.active : null;
      const activeSessionEntry = activeItem ? null : [...activeSessions.entries()].find(([, session]) => session.user_message_id === message_id2);
      if (activeItem || activeSessionEntry) {
        const activeData = activeItem?.data;
        const activeSession = activeSessionEntry?.[1];
        const streamKey = activeSessionEntry?.[0] ?? getMessageKey({
          organization_id,
          clientId,
          ai: { user_message_id: message_id2 }
        });
        cancelledMessages.add(streamKey);
        try {
          await (activeSession?.session ?? activeSessions.get(streamKey)?.session)?.abort();
        } catch (error) {
          console.error(`${aiLogPrefix} Failed to cancel active message:`, error.message);
        }
        await upsertUserMessageState({
          organization_id,
          database: activeData?.database ?? activeSession?.database,
          host: activeData?.host ?? activeSession?.host,
          user_id,
          clientId,
          socket: data.socket,
          object_id: message_id2,
          status: "canceled",
          sourceData: activeData ?? data
        });
        queue2?.messages.set(message_id2, "canceled");
        await sendQueueStatus(data, {
          status: "canceled",
          conversation_id: queue2?.conversation_id,
          user_message_id: message_id2,
          queue_continues: Boolean(queue2?.items.length)
        });
        return;
      }
      await sendQueueStatus(data, {
        status: "cancel-unavailable",
        user_message_id: message_id2,
        message: "The message is not waiting or processing in this queue."
      });
      return;
    }
    if (data.method === "ai.queue.pause" || data.method === "ai.queue.resume") {
      const queue2 = getConversationQueue(data);
      if (!queue2) {
        await sendQueueStatus(data, { status: "queue-unavailable" });
        return;
      }
      queue2.paused = data.method === "ai.queue.pause";
      await sendQueueStatus(data, {
        status: queue2.paused ? "paused" : "resumed",
        conversation_id: queue2.conversation_id,
        queued: queue2.items.length,
        active_message_id: queue2.active?.message_id
      });
      if (!queue2.paused) void drainConversationQueue(queue2);
      return;
    }
    if (data.method !== "ai.chat") return;
    if (!data.ai || typeof data.ai !== "object" || Array.isArray(data.ai)) {
      logAiFailure("invalid_request_payload", data, new Error("Expected an ai object."));
      data.ai = {};
    }
    logAiLifecycle("request_received", data, {
      has_conversation_id: Boolean(data.ai.conversation_id),
      has_prompt: typeof data.ai.prompt === "string" && data.ai.prompt.length > 0,
      prompt_length: typeof data.ai.prompt === "string" ? data.ai.prompt.length : 0,
      has_socket_id: Boolean(data.socketId ?? data.socket?.id)
    });
    data.ai.user_message_id ||= (0,node_crypto__WEBPACK_IMPORTED_MODULE_1__.randomUUID)();
    const queue = getConversationQueue(data);
    if (!queue) {
      data._aiDirectQueue = true;
      let terminalStatus = "complete";
      try {
        const result = await runAiSession(data);
        if (result?.needsCredentials) terminalStatus = "needs_credentials";
      } catch (error) {
        terminalStatus = "error";
        logAiFailure("direct_session_failed", data, error, {
          conversation_id: data.ai?.conversation_id,
          user_message_id: data.ai?.user_message_id
        });
        const streamKey = getMessageKey(data);
        if (cancelledMessages.delete(streamKey)) return;
        const activeQueue = getConversationQueue(data);
        await upsertUserMessageState({
          organization_id: data.organization_id,
          database: data.database,
          host: data.host,
          user_id: data.socket?.user_id ?? data.user_id,
          clientId: data.clientId,
          socket: data.socket,
          object_id: data.ai?.user_message_id,
          status: "error",
          sourceData: data
        });
        if (activeQueue?.active?.message_id === data.ai.user_message_id) {
          activeQueue.messages.set(data.ai.user_message_id, "error");
        }
        const requestedProvider = data.ai?.provider ?? defaultProvider;
        await sendToClient({
          method: "ai.chat",
          organization_id: data.organization_id,
          user_id: data.socket?.user_id ?? data.user_id,
          clientId: data.clientId,
          socketId: data.socketId ?? data.socket?.id,
          uuid: data.uuid,
          ai: {
            status: "error",
            conversation_id: data.ai?.conversation_id,
            user_message_id: data.ai?.user_message_id,
            message: error.message,
            provider: requestedProvider,
            model: data.ai?.model ?? configuredProviders?.[requestedProvider]?.models?.default
          }
        });
      } finally {
        releaseDirectQueueItem(data, terminalStatus);
      }
      return;
    }
    const message_id = data.ai.user_message_id;
    const existingStatus = queue.messages.get(message_id);
    if (existingStatus) {
      logAiLifecycle("duplicate_request_ignored", data, {
        conversation_id: queue.conversation_id,
        user_message_id: message_id,
        existing_status: existingStatus
      });
      await sendQueueStatus(data, {
        status: existingStatus,
        conversation_id: queue.conversation_id,
        user_message_id: message_id,
        duplicate: true
      });
      return;
    }
    const willWait = Boolean(
      queue.active || queue.draining || queue.paused || queue.items.length
    );
    logAiLifecycle("request_queued", data, {
      conversation_id: queue.conversation_id,
      user_message_id: message_id,
      will_wait: willWait,
      queue_length: queue.items.length,
      active_message_id: queue.active?.message_id
    });
    if (willWait) {
      try {
        await upsertUserMessageState({
          organization_id: data.organization_id,
          database: data.database,
          host: data.host,
          user_id: data.socket?.user_id ?? data.user_id,
          clientId: data.clientId,
          socket: data.socket,
          object_id: message_id,
          status: "queued",
          steer: data.ai.steer === true,
          sourceData: data
        });
      } catch (error) {
        logAiFailure("queued_status_write_failed", data, error, {
          conversation_id: queue.conversation_id,
          user_message_id: message_id
        });
        await sendQueueStatus(data, {
          status: "error",
          conversation_id: queue.conversation_id,
          user_message_id: message_id,
          message: `Unable to save queued message status: ${error.message}`
        });
        return;
      }
    }
    queue.items.push({ message_id, data });
    queue.messages.set(message_id, willWait ? "queued" : "pending");
    if (willWait) {
      await sendQueueStatus(data, {
        status: "queued",
        conversation_id: queue.conversation_id,
        user_message_id: message_id,
        steer: data.ai.steer === true,
        position: queue.items.length + (queue.active ? 1 : 0)
      });
    }
    void drainConversationQueue(queue);
  });
  const api = {
    config: aiConfig,
    async send(data = {}) {
      return runAiSession(data);
    },
    async stop(reason = "shutdown", options2 = {}) {
      process.removeListener("organization.evicted", onOrganizationEvicted);
      server.shutdownHandlers?.delete(onShutdown);
      return lifecycle.stop(reason, options2);
    }
  };
  const onShutdown = (reason, signal) => api.stop(reason, { signal });
  server.shutdownHandlers ??= /* @__PURE__ */ new Set();
  server.shutdownHandlers.add(onShutdown);
  return api;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  init
});

/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "Ay", 0, __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ ]);


/***/ },

/***/ 8793
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ createLifecycle)
/* harmony export */ });
function createLifecycle({ server, quiesce = async () => {
} }) {
  const pending = /* @__PURE__ */ new Set();
  let stopping = false;
  let shutdown;
  return {
    get stopping() {
      return stopping || server.state?.isShuttingDown === true;
    },
    track(operation) {
      if (this.stopping) return Promise.reject(new Error("AI is shutting down; new operations are unavailable."));
      const promise = Promise.resolve().then(operation);
      pending.add(promise);
      promise.then(() => pending.delete(promise), () => pending.delete(promise));
      return promise;
    },
    stop(reason = "shutdown", { signal: outerSignal } = {}) {
      if (shutdown) return shutdown;
      stopping = true;
      const controller = new AbortController();
      const abort = () => controller.abort(outerSignal.reason || new Error("AI shutdown cancelled."));
      if (outerSignal?.aborted) abort();
      else outerSignal?.addEventListener("abort", abort, { once: true });
      const timeoutMs = 1e4;
      const timer = setTimeout(() => controller.abort(new Error("AI shutdown deadline exceeded.")), timeoutMs);
      const abortPromise = new Promise((_, reject) => controller.signal.addEventListener("abort", () => reject(controller.signal.reason), { once: true }));
      if (controller.signal.aborted) clearTimeout(timer);
      const operation = async () => {
        controller.signal.throwIfAborted();
        await quiesce();
        await Promise.allSettled([...pending]);
        controller.signal.throwIfAborted();
        return { stopped: true };
      };
      shutdown = Promise.race([operation(), abortPromise]).finally(() => {
        clearTimeout(timer);
        outerSignal?.removeEventListener("abort", abort);
      });
      return shutdown;
    }
  };
}


/***/ },

/***/ 9170
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Us: () => (/* binding */ projectStorageTarget),
/* harmony export */   cM: () => (/* binding */ createPermissionHandler),
/* harmony export */   dk: () => (/* binding */ isPlatformOrganization),
/* harmony export */   gi: () => (/* binding */ platformAccessError),
/* harmony export */   gk: () => (/* binding */ isToolAvailable)
/* harmony export */ });
const platformTools = /* @__PURE__ */ new Set([
  "read_local_file",
  "edit_local_file",
  "write_local_file",
  "git_project",
  "coc",
  "execute_command",
  "request_server_file",
  "manage_server_storage",
  "manage_server_routes",
  "manage_server_autoscaler",
  "manage_server_cluster",
  "send_server_message"
]);
function isPlatformOrganization(server, organization_id) {
  return typeof organization_id === "string" && organization_id.trim().length > 0 && typeof server?.organization_id === "string" && organization_id === server.organization_id;
}
function platformAccessError(server, organization_id) {
  if (isPlatformOrganization(server, organization_id)) return;
  return {
    success: false,
    error: "Unauthorized: local filesystem, Git, CLI, and server control access is restricted to the platform organization."
  };
}
function isToolAvailable(server, organization_id, name) {
  return !platformTools.has(name) || isPlatformOrganization(server, organization_id);
}
function projectStorageTarget(server, organization_id, requested, fallback) {
  return requested ?? (isPlatformOrganization(server, organization_id) ? fallback : "virtual");
}
function createPermissionHandler(server, organization_id, tools) {
  const registered = new Set(tools.map((tool) => tool.name));
  return async (permission) => {
    if (typeof organization_id === "string" && organization_id.trim() && permission?.managedApprovalRequired !== true && permission?.kind === "custom-tool" && registered.has(permission.toolName) && isToolAvailable(server, organization_id, permission.toolName)) {
      return { kind: "approve-once" };
    }
    return { kind: "reject", feedback: "Only the configured, authorized CoCreate tools may run in this session." };
  };
}


/***/ },

/***/ 3501
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   b: () => (/* binding */ createApiTool)
/* harmony export */ });
function createApiTool({ server, organization_id, host }) {
  return {
    name: "execute_server_api",
    handler: async (input = {}) => {
      if (typeof organization_id !== "string" || !organization_id.trim()) {
        return { success: false, error: "An authenticated organization_id is required for API calls." };
      }
      const api = server.api;
      if (typeof api?.send !== "function") {
        throw new Error("The CoCreate server API capability is not initialized.");
      }
      const {
        organization_id: _ignoredOrganizationId,
        host: _ignoredHost,
        socket: _ignoredSocket,
        ...apiPayload
      } = input;
      return api.send({
        ...apiPayload,
        organization_id,
        host
      });
    }
  };
}


/***/ },

/***/ 7942
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ createAutoscalerTool)
/* harmony export */ });
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9170);

function createAutoscalerTool({ server }) {
  const autoscaler = server.autoscaler;
  return {
    name: "manage_server_autoscaler",
    handler: async ({ action, value }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_0__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      switch (action) {
        case "getConfig":
          return autoscaler.config;
        case "determineScaleOutTarget":
          return autoscaler.determineScaleOutTarget(value);
        case "scaleOut":
          return autoscaler.scaleOut(value);
        case "determineScaleInTarget":
          return autoscaler.determineScaleInTarget(value);
        case "scaleIn":
          return autoscaler.scaleIn(value);
        default:
          throw new Error(`Unsupported autoscaler action: ${action}`);
      }
    }
  };
}


/***/ },

/***/ 8354
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Y: () => (/* binding */ createCocTool)
/* harmony export */ });
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8298);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5663);
/* harmony import */ var _workspace_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7936);
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9170);




const normalizeVirtualPath = (value = "/") => value.startsWith("/") ? value : `/${value}`;
const inferMimeType = (pathname) => ({
  ".css": "text/css",
  ".html": "text/html",
  ".htm": "text/html",
  ".js": "text/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".txt": "text/plain"
})[node_path__WEBPACK_IMPORTED_MODULE_1__["default"].extname(pathname).toLowerCase()] ?? "text/plain";
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function getContent(file) {
  const content = file.src ?? file.source ?? file.content ?? "";
  if (Buffer.isBuffer(content)) return content;
  if (content?.type === "Buffer" && Array.isArray(content.data)) {
    return Buffer.from(content.data);
  }
  if (content && typeof content === "object" && Array.isArray(content.data)) {
    return Buffer.from(content.data);
  }
  return typeof content === "string" ? content : JSON.stringify(content, null, 2);
}
function createCocTool({
  server,
  allowLocalFileSystem,
  allowUnconfirmedLocalWrite
}) {
  const workspaces = (0,_workspace_js__WEBPACK_IMPORTED_MODULE_2__/* .createWorkspaceResolver */ .IN)(server);
  const crud = server.crud;
  async function downloadTarget(target, context, overwrite) {
    const pathname = normalizeVirtualPath(target);
    const isPrefix = pathname === "/" || pathname.endsWith("/");
    const query = isPrefix ? { pathname: { $regex: `^${escapeRegex(pathname)}` } } : {
      $or: [
        { pathname },
        { pathname: target },
        { path: pathname },
        { path: target }
      ]
    };
    let index = 0;
    let downloaded = 0;
    let skipped = 0;
    while (true) {
      const response = await crud.send({
        method: "object.read",
        array: "files",
        organization_id: context.organization_id,
        host: context.host,
        filter: {
          query,
          sort: [
            { key: "pathname", direction: "asc" },
            { key: "_id", direction: "asc" }
          ],
          index,
          limit: 1
        }
      });
      const file = response?.object?.[0];
      if (!file) break;
      index++;
      const filePath = file.pathname ?? file.path;
      if (!filePath) continue;
      const relativePath = filePath.replace(/^\/+/, "");
      const fullPath = await workspaces.resolvePath(
        context.organization_id,
        relativePath,
        { forWrite: true }
      );
      const isDirectory = file["content-type"] === "text/directory" || file.type === "directory" || filePath.endsWith("/");
      if (isDirectory) {
        await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].mkdir(fullPath, { recursive: true });
        continue;
      }
      await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].mkdir(node_path__WEBPACK_IMPORTED_MODULE_1__["default"].dirname(fullPath), { recursive: true });
      try {
        await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].writeFile(fullPath, getContent(file), overwrite ? void 0 : { flag: "wx" });
        downloaded++;
      } catch (error) {
        if (!overwrite && error.code === "EEXIST") {
          skipped++;
          continue;
        }
        throw error;
      }
    }
    return { downloaded, skipped };
  }
  return {
    name: "coc",
    handler: async ({ action, paths = [], site = false, overwrite = false }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      if (!allowLocalFileSystem) {
        return { success: false, error: "Local file system access is disabled." };
      }
      const workspace = await workspaces.ensure(context.organization_id);
      const targets = (Array.isArray(paths) ? paths : [paths]).filter(Boolean).map(String);
      if (action === "download") {
        if (site) targets.unshift("/");
        if (!targets.length) throw new Error("paths is required unless site=true.");
        let downloaded = 0;
        let skipped = 0;
        for (const target of [...new Set(targets)]) {
          const result = await downloadTarget(
            target,
            context,
            overwrite === true
          );
          downloaded += result.downloaded;
          skipped += result.skipped;
        }
        return {
          success: true,
          action,
          workspace,
          downloaded,
          skipped,
          overwrite: overwrite === true
        };
      }
      if (action === "upload") {
        if (!allowUnconfirmedLocalWrite && context.confirmLocalWrite !== true) {
          return {
            success: false,
            error: "Live upload requires explicit confirmation. Set context.confirmLocalWrite=true."
          };
        }
        if (!targets.length) throw new Error("paths is required for upload.");
        const uploaded = [];
        for (const target of targets) {
          const fullPath = await workspaces.resolvePath(context.organization_id, target);
          const stats = await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].stat(fullPath);
          if (!stats.isFile()) throw new Error(`Upload target must be a file: ${target}`);
          const pathname = normalizeVirtualPath(target);
          const content = await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].readFile(fullPath, "utf8");
          const existing = await crud.send({
            method: "object.read",
            array: "files",
            organization_id: context.organization_id,
            host: context.host,
            filter: { query: { pathname }, limit: 1 }
          });
          const record = existing?.object?.[0];
          const object = {
            ...record?._id && { _id: record._id },
            pathname,
            path: node_path__WEBPACK_IMPORTED_MODULE_1__["default"].posix.dirname(pathname),
            directory: node_path__WEBPACK_IMPORTED_MODULE_1__["default"].posix.basename(node_path__WEBPACK_IMPORTED_MODULE_1__["default"].posix.dirname(pathname)),
            name: node_path__WEBPACK_IMPORTED_MODULE_1__["default"].posix.basename(pathname),
            src: content,
            "content-type": record?.["content-type"] ?? inferMimeType(pathname),
            public: record?.public ?? "true"
          };
          await crud.send({
            method: record?._id ? "object.update" : "object.create",
            array: "files",
            organization_id: context.organization_id,
            host: context.host,
            object: [object]
          });
          uploaded.push(pathname);
        }
        return { success: true, action, workspace, uploaded };
      }
      throw new Error(`Unsupported coc action: ${action}`);
    }
  };
}


/***/ },

/***/ 9364
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ createCommandTool)
/* harmony export */ });
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6564);
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8298);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5663);
/* harmony import */ var _workspace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7936);
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9170);





const DEFAULT_TIMEOUT = 12e4;
const MAX_COMMAND_BYTES = 64 * 1024;
function resolveTimeout(value, maximum) {
  const timeout = Math.trunc(Number(value)) || DEFAULT_TIMEOUT;
  return Math.min(maximum, Math.max(1e3, timeout));
}
function createCommandTool({
  server,
  enabled,
  timeout = 6e5,
  maxOutputBytes = 1024 * 1024
}) {
  const workspaces = (0,_workspace_js__WEBPACK_IMPORTED_MODULE_3__/* .createWorkspaceResolver */ .IN)(server);
  const maximumTimeout = Math.max(1e3, Math.trunc(Number(timeout)) || 6e5);
  const outputLimit = Math.max(1024, Math.trunc(Number(maxOutputBytes)) || 1024 * 1024);
  return {
    name: "execute_command",
    handler: async ({ command, cwd, timeout: requestedTimeout, input }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_4__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      if (!enabled) {
        return { success: false, error: "Platform command execution is disabled." };
      }
      if (typeof command !== "string" || !command.trim()) {
        throw new Error("A non-empty command is required.");
      }
      if (Buffer.byteLength(command, "utf8") > MAX_COMMAND_BYTES) {
        throw new Error(`Command cannot exceed ${MAX_COMMAND_BYTES} bytes.`);
      }
      if (input !== void 0 && typeof input !== "string") {
        throw new Error("input must be a string when provided.");
      }
      const workspace = await workspaces.ensure(context.organization_id);
      const workingDirectory = cwd ? node_path__WEBPACK_IMPORTED_MODULE_2__["default"].resolve(workspace, String(cwd)) : workspace;
      const stats = await node_fs_promises__WEBPACK_IMPORTED_MODULE_1__["default"].stat(workingDirectory);
      if (!stats.isDirectory()) {
        throw new Error(`Command working directory is not a directory: ${workingDirectory}`);
      }
      const commandTimeout = resolveTimeout(requestedTimeout, maximumTimeout);
      return new Promise((resolve, reject) => {
        const child = (0,node_child_process__WEBPACK_IMPORTED_MODULE_0__.exec)(command, {
          cwd: workingDirectory,
          env: process.env,
          encoding: "utf8",
          maxBuffer: outputLimit,
          timeout: commandTimeout,
          windowsHide: true
        }, (error, stdout = "", stderr = "") => {
          if (error && typeof error.code !== "number") {
            const failure = String(error.message || error).trim();
            resolve({
              success: true,
              action: "execute",
              ok: false,
              command,
              cwd: workingDirectory,
              exitCode: null,
              signal: error.signal ?? null,
              stdout,
              stderr,
              failure
            });
            return;
          }
          resolve({
            success: true,
            action: "execute",
            ok: !error,
            command,
            cwd: workingDirectory,
            exitCode: error?.code ?? 0,
            signal: error?.signal ?? null,
            stdout,
            stderr
          });
        });
        child.once("error", reject);
        if (input !== void 0) child.stdin.end(input);
      });
    }
  };
}


/***/ },

/***/ 9745
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ createCrudTool)
/* harmony export */ });
function createCrudTool({ crud, organization_id, host }) {
  const appResolutions = /* @__PURE__ */ new Map();
  const activeAppsByArray = /* @__PURE__ */ new Map();
  const normalizeResourceName = (value) => String(value || "").toLowerCase().replaceAll(/[^a-z0-9]/g, "");
  const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const normalizeQueryOperators = (value) => {
    if (Array.isArray(value)) return value.map(normalizeQueryOperators);
    if (!value || typeof value !== "object") return value;
    return Object.fromEntries(Object.entries(value).map(([key, item]) => {
      if (["$in", "$nin", "$all"].includes(key) && !Array.isArray(item)) {
        return [key, [normalizeQueryOperators(item)]];
      }
      return [key, normalizeQueryOperators(item)];
    }));
  };
  const resolveApp = async (array) => {
    if (typeof array !== "string" || array === "apps") return;
    const normalized = normalizeResourceName(array);
    if (appResolutions.has(normalized)) return appResolutions.get(normalized);
    const exact = `^${escapeRegExp(array)}$`;
    const response = await crud.send({
      method: "object.read",
      array: "apps",
      organization_id,
      host,
      filter: {
        query: {
          $or: [
            { name: { $regex: exact, $options: "i" } },
            { singularName: { $regex: exact, $options: "i" } }
          ]
        },
        key: {
          _id: 1,
          name: 1,
          singularName: 1,
          array: 1,
          filter: 1
        },
        limit: 5
      }
    });
    const app = (response?.object || []).find(
      (candidate) => [candidate.name, candidate.singularName].some((value) => normalizeResourceName(value) === normalized)
    );
    appResolutions.set(normalized, app);
    if (app?.array && typeof app.array === "string") {
      activeAppsByArray.set(normalizeResourceName(app.array), app);
    }
    return app;
  };
  return {
    name: "crud",
    handler: async (payload) => {
      if (typeof organization_id !== "string" || !organization_id.trim()) {
        return { success: false, error: "An authenticated organization_id is required for CRUD." };
      }
      if (!/^(storage|database|array|index|object)\.(create|read|update|delete)$/.test(payload?.method ?? "")) {
        return { success: false, error: "The CRUD tool accepts only CRUD methods; use the scoped API tool for API calls." };
      }
      const {
        socket: _ignoredSocket,
        fields,
        limit,
        projection,
        query,
        skip,
        sort,
        ...request
      } = payload;
      if (/^object\.(create|read|update|delete)$/.test(request.method ?? "")) {
        if (Array.isArray(request.array) && request.array.length === 1) {
          request.array = request.array[0];
          payload.array = request.array;
        }
        const app = activeAppsByArray.get(normalizeResourceName(request.array)) || await resolveApp(request.array);
        if (app?.array) {
          request.array = app.array;
          payload.array = app.array;
          payload.app_id = app._id;
          if (app.filter?.query && request.method === "object.create") {
            const defaults = Object.fromEntries(
              Object.entries(app.filter.query).filter(
                ([, value]) => value === null || ["string", "number", "boolean"].includes(typeof value)
              )
            );
            request.object = (Array.isArray(request.object) ? request.object : [request.object]).map((object) => ({ ...defaults, ...object }));
          } else if (app.filter?.query) {
            const requestedQuery = request.filter?.query ?? query;
            request.filter = {
              ...request.filter,
              query: requestedQuery ? { $and: [app.filter.query, requestedQuery] } : app.filter.query
            };
          }
        }
      }
      const filter = { ...request.filter };
      const requestedProjection = projection ?? fields ?? filter.projection;
      const requestedSkip = skip ?? filter.skip;
      const requestedSort = sort ?? filter.sort;
      const filterOptions = {
        limit,
        key: requestedProjection,
        query,
        index: requestedSkip,
        sort: requestedSort && !Array.isArray(requestedSort) ? Object.entries(requestedSort).map(([key, direction]) => ({
          key,
          direction
        })) : requestedSort
      };
      const isWrite = /^object\.(create|update)$/.test(request.method ?? "");
      const objects = Array.isArray(request.object) ? request.object : [request.object];
      const writesApiKey = objects.some(
        (object) => object && typeof object === "object" && (Object.hasOwn(object, "key") || Object.hasOwn(object.$set ?? {}, "key"))
      );
      if (isWrite && request.array === "secrets") {
        throw new Error(
          "External API credentials must not be stored in secrets. Create or update the provider record in apis, then use request_api_credential to show the mapped credential card."
        );
      }
      if (isWrite && request.array === "apis" && writesApiKey) {
        throw new Error(
          "Do not write apis.key through crud. Use request_api_credential so the key is saved through the mapped credential card without entering chat or tool payloads."
        );
      }
      const requiresCompleteRecord = isWrite;
      if (requiresCompleteRecord && request.array === "endpoints") {
        const required = ["api_id", "name", "method", "endpoint", "description", "enabled"];
        const unsupported = [
          "requestTemplate",
          "handler",
          "code",
          "source",
          "route",
          "implementation"
        ];
        for (const object of objects) {
          const missing = required.filter((key) => object?.[key] === void 0);
          const invalid = unsupported.filter((key) => object?.[key] !== void 0);
          if (missing.length) {
            throw new Error(
              `Invalid CoCreate endpoint record. Missing ${missing.join(", ")}. Use the executable apps/apis endpoint structure: api_id, name, lowercase method, endpoint (string or AST object), description, optional actions/data/searchParams/headers, and enabled.`
            );
          }
          if (invalid.length) {
            throw new Error(
              `Invalid CoCreate endpoint record. Unsupported fields: ${invalid.join(", ")}. Represent provider request content in data and executable steps in actions using the apps/apis AST structure.`
            );
          }
          if (typeof object.method !== "string" || object.method !== object.method.toLowerCase()) {
            throw new Error("Invalid CoCreate endpoint record. method must be a lowercase HTTP method.");
          }
        }
      }
      if (requiresCompleteRecord && request.array === "webhooks") {
        const required = [
          "api_id",
          "path",
          "description",
          "enabled",
          "chunks",
          "receive",
          "rawBody"
        ];
        for (const object of objects) {
          const missing = required.filter((key) => object?.[key] === void 0);
          if (missing.length || !object?.process && !object?.action) {
            const details = [
              ...missing.length ? [`missing ${missing.join(", ")}`] : [],
              ...!object?.process && !object?.action ? ["missing executable process or action"] : []
            ];
            throw new Error(
              `Invalid CoCreate webhook record: ${details.join("; ")}. Use the executable apps/apis webhook AST structure with chunks, receive, rawBody, provider verification when required, an action/process, and response handling.`
            );
          }
          if (!Array.isArray(object.chunks) || typeof object.receive !== "object" || typeof object.rawBody !== "object") {
            throw new Error(
              "Invalid CoCreate webhook record. chunks must be an array, and receive/rawBody must be executable AST objects matching apps/apis/webhooks/config/data.js."
            );
          }
        }
      }
      delete filter.projection;
      delete filter.skip;
      for (const [key, value] of Object.entries(filterOptions)) {
        if (value !== void 0 && filter[key] === void 0) {
          filter[key] = value;
        }
      }
      if (filter.query) filter.query = normalizeQueryOperators(filter.query);
      const response = await crud.send({
        ...request,
        ...Object.keys(filter).length && { filter },
        organization_id,
        host
      });
      const responseKey = request.method?.split(".")[0];
      const errors = Array.isArray(response?.error) ? response.error : response?.error ? [response.error] : [];
      const responseItems = responseKey ? response?.[responseKey] : void 0;
      if (request.method === "object.read" && request.array === "apps" && Array.isArray(responseItems) && responseItems.length === 1) {
        let [app] = responseItems;
        if (app?._id && (!Object.hasOwn(app, "array") || !Object.hasOwn(app, "filter"))) {
          const appResponse = await crud.send({
            method: "object.read",
            array: "apps",
            organization_id,
            host,
            filter: {
              query: { _id: app._id },
              key: {
                _id: 1,
                name: 1,
                singularName: 1,
                array: 1,
                filter: 1
              },
              limit: 1
            }
          });
          const hydrated = appResponse?.object?.[0];
          if (hydrated) app = { ...app, ...hydrated };
        }
        for (const name of [app.name, app.singularName]) {
          if (name) appResolutions.set(normalizeResourceName(name), app);
        }
        if (typeof app.array === "string") {
          activeAppsByArray.set(normalizeResourceName(app.array), app);
        }
      }
      if (errors.length && (!Array.isArray(responseItems) || !responseItems.length)) {
        throw new Error(errors.map((error) => error?.message || String(error)).join("; "));
      }
      if (responseKey && response?.[responseKey] !== void 0) {
        return {
          [responseKey]: response[responseKey],
          ...response?.filter && { filter: response.filter },
          ...errors.length && { error: errors }
        };
      }
      return { data: response?.data };
    }
  };
}


/***/ },

/***/ 626
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ getRecoveryStatus),
/* harmony export */   wb: () => (/* binding */ assertToolResult)
/* harmony export */ });
/* unused harmony export getToolErrors */
function describeError(error) {
  if (typeof error === "string") return error;
  if (error?.message) return error.message;
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}
function getToolErrors(value, path = "", seen = /* @__PURE__ */ new WeakSet()) {
  if (!value || typeof value !== "object") return [];
  if (seen.has(value)) return [];
  seen.add(value);
  const errors = [];
  if (Object.hasOwn(value, "error") && value.error) {
    const entries = Array.isArray(value.error) ? value.error : [value.error];
    for (const error of entries) {
      errors.push({ path: path ? `${path}.error` : "error", message: describeError(error) });
    }
  }
  if (value.success === false && !value.error) {
    errors.push({ path: path || "result", message: "The operation was not successful." });
  }
  for (const key of ["result", "response", "data"]) {
    const child = value[key];
    if (child === value) continue;
    if (child && typeof child === "object") {
      errors.push(...getToolErrors(child, path ? `${path}.${key}` : key, seen));
    }
  }
  return errors;
}
function assertToolResult(result, toolName) {
  const errors = getToolErrors(result);
  if (!errors.length) return result;
  const details = [...new Set(errors.map(({ message }) => message))].join("; ");
  throw new Error(
    `${toolName} failed: ${details} Treat this as an unsuccessful operation, correct the request or try an appropriate alternative, and do not describe it as an empty successful result.`
  );
}
function getRecoveryStatus(toolName, error) {
  const message = String(error?.message || error).toLowerCase();
  if (/query|filter|operator|\$in|\$nin|\$all|regex/.test(message)) {
    return "The request filter failed\u2014correcting it and trying again\u2026";
  }
  if (/not found|does not exist|missing/.test(message)) {
    return "The requested item was not found\u2014checking its app mapping and alternatives\u2026";
  }
  if (/unauthorized|forbidden|permission|credential/.test(message)) {
    return "The operation was not authorized\u2014checking the available access path\u2026";
  }
  if (/file|path|directory/.test(message)) {
    return "The file operation failed\u2014checking the path and available source\u2026";
  }
  return `${toolName.replaceAll("_", " ")} failed\u2014trying an alternative approach\u2026`;
}


/***/ },

/***/ 4898
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   i: () => (/* binding */ createFileTools)
/* harmony export */ });
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5663);
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8298);
/* harmony import */ var _workspace_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7936);
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9170);




function createFileTools({
  server,
  crud,
  defaultStorageTarget,
  allowLocalFileSystem,
  allowUnconfirmedLocalWrite
}) {
  const files = server.files;
  const wsManager = server.wsManager;
  const workspaces = (0,_workspace_js__WEBPACK_IMPORTED_MODULE_2__/* .createWorkspaceResolver */ .IN)(server);
  const normalizeVirtualPath = (filePath) => filePath.startsWith("/") ? filePath : `/${filePath}`;
  const inferMimeType = (pathname) => {
    const extension = node_path__WEBPACK_IMPORTED_MODULE_0__["default"].extname(pathname).toLowerCase();
    return {
      ".css": "text/css",
      ".html": "text/html",
      ".htm": "text/html",
      ".js": "text/javascript",
      ".json": "application/json",
      ".svg": "image/svg+xml",
      ".txt": "text/plain"
    }[extension] ?? "text/plain";
  };
  const virtualPathQuery = (filePath) => {
    const pathname = normalizeVirtualPath(filePath);
    return {
      $or: [
        { pathname },
        { pathname: filePath },
        { path: pathname },
        { path: filePath }
      ]
    };
  };
  const resolveLocalPath = (filePath, context, options) => workspaces.resolvePath(context?.organization_id, filePath, options);
  const requestServerFileTool = {
    name: "request_server_file",
    handler: async ({ path: pathname }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      return files.resolveFile({
        pathname,
        hostname: context.host,
        organizationId: context.organization_id,
        crud
      });
    }
  };
  const readVirtualFileTool = {
    name: "read_virtual_file",
    handler: async ({ filePath }, context) => {
      const result = await crud.send({
        method: "object.read",
        array: "files",
        organization_id: context.organization_id,
        filter: {
          query: virtualPathQuery(filePath),
          limit: 1
        }
      });
      const file = result.object[0];
      if (!file) {
        return { error: `Virtual file not found: ${filePath}` };
      }
      return {
        path: file.pathname ?? file.path,
        name: file.name,
        content: file.src ?? file.content ?? "",
        metadata: file.metadata,
        reference: {
          array: "files",
          object: file._id,
          key: file.src !== void 0 ? "src" : "content"
        }
      };
    }
  };
  const writeVirtualFileTool = {
    name: "write_virtual_file",
    handler: async ({ filePath, content, mimeType }, context) => {
      const pathname = normalizeVirtualPath(filePath);
      const fileName = node_path__WEBPACK_IMPORTED_MODULE_0__["default"].basename(pathname);
      const filePathname = node_path__WEBPACK_IMPORTED_MODULE_0__["default"].posix.dirname(pathname);
      const directory = filePathname === "/" ? "/" : node_path__WEBPACK_IMPORTED_MODULE_0__["default"].posix.basename(filePathname);
      const existing = await crud.send({
        method: "object.read",
        array: "files",
        organization_id: context.organization_id,
        filter: {
          query: virtualPathQuery(filePath),
          limit: 1
        }
      });
      const existingFile = existing.object[0];
      let saveResult;
      if (existingFile && existingFile._id) {
        saveResult = await crud.send({
          method: "object.update",
          array: "files",
          organization_id: context.organization_id,
          object: [{
            _id: existingFile._id,
            host: ["*"],
            directory,
            path: filePathname,
            pathname,
            name: fileName,
            src: content,
            "content-type": mimeType ?? existingFile["content-type"] ?? inferMimeType(pathname),
            public: "true"
          }]
        });
      } else {
        saveResult = await crud.send({
          method: "object.create",
          array: "files",
          organization_id: context.organization_id,
          object: [{
            host: ["*"],
            directory,
            path: filePathname,
            pathname,
            name: fileName,
            src: content,
            "content-type": mimeType ?? inferMimeType(pathname),
            public: "true"
          }]
        });
      }
      await wsManager.send({
        method: "ai.file.updated",
        organization_id: context.organization_id,
        user_id: context.user_id,
        clientId: context.clientId,
        broadcast: false,
        log: false,
        ai: { path: pathname, src: content }
      });
      return {
        success: true,
        path: pathname,
        updated: !!existingFile,
        result: saveResult,
        change: {
          action: existingFile ? "update" : "create",
          path: pathname,
          before: existingFile ?? null,
          after: saveResult?.object?.[0] ?? {
            ...existingFile ?? {},
            pathname,
            name: fileName,
            src: content,
            "content-type": mimeType ?? existingFile?.["content-type"] ?? inferMimeType(pathname)
          }
        }
      };
    }
  };
  const listVirtualFilesTool = {
    name: "list_virtual_files",
    handler: async ({ prefix, limit = 200 }, context) => {
      const result = await crud.send({
        method: "object.read",
        array: "files",
        organization_id: context.organization_id,
        filter: {
          query: {},
          limit
        }
      });
      const fileObjects = result.object;
      const filtered = prefix ? fileObjects.filter(
        (file) => (file.pathname ?? file.path ?? "").startsWith(prefix)
      ) : fileObjects;
      return {
        count: filtered.length,
        files: filtered.map((f) => ({
          path: f.pathname ?? f.path,
          name: f.name,
          "content-type": f["content-type"]
        }))
      };
    }
  };
  const deleteVirtualFileTool = {
    name: "delete_virtual_file",
    handler: async ({ filePath }, context) => {
      const pathname = normalizeVirtualPath(filePath);
      const existing = await crud.send({
        method: "object.read",
        array: "files",
        organization_id: context.organization_id,
        filter: {
          query: virtualPathQuery(filePath),
          limit: 1
        }
      });
      const existingFile = existing.object?.[0] ?? null;
      const result = await crud.send({
        method: "object.delete",
        array: "files",
        organization_id: context.organization_id,
        filter: {
          query: virtualPathQuery(filePath)
        }
      });
      await wsManager.send({
        method: "ai.file.deleted",
        organization_id: context.organization_id,
        user_id: context.user_id,
        clientId: context.clientId,
        broadcast: false,
        log: false,
        ai: { path: pathname }
      });
      return {
        success: true,
        path: pathname,
        result,
        change: {
          action: "delete",
          path: pathname,
          before: existingFile,
          after: null
        }
      };
    }
  };
  const localFsReadTool = {
    name: "read_local_file",
    handler: async ({ filePath, startLine = 1, endLine }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      if (!allowLocalFileSystem) {
        return { success: false, error: "Local file system access is disabled." };
      }
      const fullPath = await resolveLocalPath(filePath, context);
      const content = await node_fs_promises__WEBPACK_IMPORTED_MODULE_1__["default"].readFile(fullPath, "utf8");
      const lines = content.split("\n");
      const start = Math.min(lines.length, Math.max(1, Math.trunc(Number(startLine)) || 1));
      const requestedEnd = endLine === void 0 ? start + 399 : Math.trunc(Number(endLine));
      const end = Math.min(lines.length, Math.max(start, requestedEnd || start));
      return {
        success: true,
        filePath,
        startLine: start,
        endLine: end,
        totalLines: lines.length,
        hasMore: end < lines.length,
        content: lines.slice(start - 1, end).join("\n")
      };
    }
  };
  const localFsEditTool = {
    name: "edit_local_file",
    handler: async ({ filePath, oldText, newText }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      if (!allowLocalFileSystem) {
        return { success: false, error: "Local file system access is disabled." };
      }
      if (!allowUnconfirmedLocalWrite && context.confirmLocalWrite !== true) {
        return {
          success: false,
          error: "Local edit requires explicit confirmation. Set context.confirmLocalWrite=true."
        };
      }
      if (typeof oldText !== "string" || !oldText) {
        throw new Error("oldText is required and cannot be empty.");
      }
      if (typeof newText !== "string") throw new Error("newText must be a string.");
      const fullPath = await resolveLocalPath(filePath, context);
      const content = await node_fs_promises__WEBPACK_IMPORTED_MODULE_1__["default"].readFile(fullPath, "utf8");
      const firstMatch = content.indexOf(oldText);
      if (firstMatch === -1) {
        return { success: false, error: "oldText was not found; no changes were made." };
      }
      if (content.indexOf(oldText, firstMatch + oldText.length) !== -1) {
        return {
          success: false,
          error: "oldText matches more than once; include more surrounding text to make the edit unique."
        };
      }
      const updated = content.slice(0, firstMatch) + newText + content.slice(firstMatch + oldText.length);
      await node_fs_promises__WEBPACK_IMPORTED_MODULE_1__["default"].writeFile(fullPath, updated, "utf8");
      return {
        success: true,
        filePath,
        replacedCharacters: oldText.length,
        insertedCharacters: newText.length
      };
    }
  };
  const localFsWriteTool = {
    name: "write_local_file",
    handler: async ({ filePath, content }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      if (!allowLocalFileSystem) {
        return { success: false, error: "Local file system access is disabled." };
      }
      if (!allowUnconfirmedLocalWrite && context.confirmLocalWrite !== true) {
        return {
          success: false,
          error: "Local write requires explicit confirmation. Set context.confirmLocalWrite=true."
        };
      }
      const fullPath = await resolveLocalPath(filePath, context, { forWrite: true });
      await node_fs_promises__WEBPACK_IMPORTED_MODULE_1__["default"].mkdir(node_path__WEBPACK_IMPORTED_MODULE_0__["default"].dirname(fullPath), { recursive: true });
      await node_fs_promises__WEBPACK_IMPORTED_MODULE_1__["default"].writeFile(fullPath, content, "utf8");
      return { success: true, filePath };
    }
  };
  const readProjectFileTool = {
    name: "read_project_file",
    handler: async ({ filePath, target = "auto", startLine, endLine }, context = {}) => {
      const selected = (0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .projectStorageTarget */ .Us)(
        server,
        context?.organization_id,
        target === "auto" ? context?.storageTarget : target,
        defaultStorageTarget
      );
      if (target === "local" && !allowLocalFileSystem) {
        return {
          success: false,
          error: "Local file system target requested but disabled by configuration."
        };
      }
      if (selected === "local") {
        return localFsReadTool.handler({ filePath, startLine, endLine }, context);
      }
      return readVirtualFileTool.handler({ filePath }, context);
    }
  };
  const writeProjectFileTool = {
    name: "write_project_file",
    handler: async ({ filePath, content, mimeType, target = "auto" }, context = {}) => {
      const selected = (0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .projectStorageTarget */ .Us)(
        server,
        context?.organization_id,
        target === "auto" ? context?.storageTarget : target,
        defaultStorageTarget
      );
      if (target === "local" && !allowLocalFileSystem) {
        return {
          success: false,
          error: "Local file system target requested but disabled by configuration."
        };
      }
      if (selected === "local") {
        return localFsWriteTool.handler({ filePath, content }, context);
      }
      return writeVirtualFileTool.handler({ filePath, content, mimeType }, context);
    }
  };
  const tools = [
    requestServerFileTool,
    readVirtualFileTool,
    writeVirtualFileTool,
    deleteVirtualFileTool,
    listVirtualFilesTool,
    readProjectFileTool,
    writeProjectFileTool
  ];
  if (allowLocalFileSystem) {
    tools.push(localFsReadTool, localFsEditTool, localFsWriteTool);
  }
  return { tools };
}


/***/ },

/***/ 4257
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ createGitTool)
/* harmony export */ });
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6564);
/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4472);
/* harmony import */ var _workspace_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7936);
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9170);




const execFileAsync = (0,node_util__WEBPACK_IMPORTED_MODULE_1__.promisify)(node_child_process__WEBPACK_IMPORTED_MODULE_0__.execFile);
const MAX_OUTPUT_BYTES = 256 * 1024;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;
const SAFE_REVISION = /^[A-Za-z0-9][A-Za-z0-9._/~^{}-]*$/;
const sanitizedEnvironment = () => Object.fromEntries(
  Object.entries(process.env).filter(([name]) => !name.startsWith("GIT_"))
);
function boundedLimit(value) {
  const number = Math.trunc(Number(value)) || DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(1, number));
}
function validateRevision(value = "HEAD") {
  if (typeof value !== "string" || !SAFE_REVISION.test(value)) {
    throw new Error(`Invalid Git revision: ${value}`);
  }
  return value;
}
function validateMessage(value) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error("A non-empty commit message is required.");
  }
  if (Buffer.byteLength(value, "utf8") > 4096) {
    throw new Error("The commit message cannot exceed 4096 bytes.");
  }
  return value.trim();
}
function requireConfirmation(context, allowUnconfirmedLocalWrite, operation) {
  if (!allowUnconfirmedLocalWrite && context.confirmLocalWrite !== true) {
    return {
      success: false,
      error: `${operation} requires explicit confirmation. Set context.confirmLocalWrite=true.`
    };
  }
}
function createGitTool({
  server,
  allowLocalFileSystem,
  allowUnconfirmedLocalWrite,
  gitBinary = "git"
}) {
  const workspaces = (0,_workspace_js__WEBPACK_IMPORTED_MODULE_2__/* .createWorkspaceResolver */ .IN)(server);
  const mutationQueues = /* @__PURE__ */ new Map();
  const withMutationLock = async (organization_id, operation) => {
    const previous = mutationQueues.get(organization_id) ?? Promise.resolve();
    let release;
    const current = new Promise((resolve) => {
      release = resolve;
    });
    mutationQueues.set(organization_id, current);
    await previous.catch(() => {
    });
    try {
      return await operation();
    } finally {
      release();
      if (mutationQueues.get(organization_id) === current) {
        mutationQueues.delete(organization_id);
      }
    }
  };
  const validatePaths = (organization_id, values = []) => {
    const paths = (Array.isArray(values) ? values : [values]).filter((value) => value !== void 0 && value !== null && value !== "").map(String);
    for (const filePath of paths) {
      if (filePath.startsWith(":")) {
        throw new Error(`Git pathspec magic is not allowed: ${filePath}`);
      }
      workspaces.resolve(organization_id, filePath);
    }
    return paths;
  };
  const runGit = async (workspace, args, { allowExitCodes = [] } = {}) => {
    try {
      const { stdout = "", stderr = "" } = await execFileAsync(gitBinary, [
        "-c",
        "core.hooksPath=/dev/null",
        "-c",
        "core.pager=cat",
        ...args
      ], {
        cwd: workspace,
        encoding: "utf8",
        maxBuffer: MAX_OUTPUT_BYTES,
        timeout: 3e4,
        windowsHide: true,
        env: {
          ...sanitizedEnvironment(),
          GIT_TERMINAL_PROMPT: "0",
          GIT_PAGER: "cat",
          GIT_EDITOR: "true",
          GIT_AUTHOR_NAME: "CoCreate AI",
          GIT_AUTHOR_EMAIL: "ai@cocreate.local",
          GIT_COMMITTER_NAME: "CoCreate AI",
          GIT_COMMITTER_EMAIL: "ai@cocreate.local"
        }
      });
      return { stdout, stderr };
    } catch (error) {
      if (allowExitCodes.includes(error.code)) {
        return { stdout: error.stdout ?? "", stderr: error.stderr ?? "", code: error.code };
      }
      const detail = String(error.stderr || error.stdout || error.message).trim();
      throw new Error(`Git command failed: ${detail}`);
    }
  };
  const assertRepository = async (workspace) => {
    const { stdout } = await runGit(workspace, ["rev-parse", "--is-inside-work-tree"]);
    if (stdout.trim() !== "true") throw new Error("The project workspace is not a Git repository.");
  };
  return {
    name: "git_project",
    handler: async (payload = {}, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      if (!allowLocalFileSystem) {
        return { success: false, error: "Organization workspace access is disabled." };
      }
      const workspace = await workspaces.ensure(context.organization_id);
      await assertRepository(workspace);
      const action = payload.action;
      const paths = validatePaths(context.organization_id, payload.paths);
      if (action === "status") {
        const { stdout } = await runGit(workspace, [
          "status",
          "--porcelain=v1",
          "-z",
          "--untracked-files=all"
        ]);
        return {
          success: true,
          action,
          clean: stdout.length === 0,
          entries: stdout.split("\0").filter(Boolean)
        };
      }
      if (action === "list_files") {
        const args = ["ls-files", "-z"];
        if (paths.length) args.push("--", ...paths);
        const { stdout } = await runGit(workspace, args);
        const limit = boundedLimit(payload.limit);
        const allFiles = stdout.split("\0").filter(Boolean);
        return {
          success: true,
          action,
          files: allFiles.slice(0, limit),
          count: allFiles.length,
          truncated: allFiles.length > limit
        };
      }
      if (action === "diff") {
        const args = ["diff", "--no-ext-diff", "--no-color"];
        if (payload.staged === true) args.push("--cached");
        if (payload.stat === true) args.push("--stat");
        if (paths.length) args.push("--", ...paths);
        const { stdout } = await runGit(workspace, args);
        return { success: true, action, staged: payload.staged === true, diff: stdout };
      }
      if (action === "log") {
        const limit = boundedLimit(payload.limit);
        const { stdout } = await runGit(workspace, [
          "log",
          `-${limit}`,
          "--date=iso-strict",
          "--format=%H%x1f%h%x1f%an%x1f%ae%x1f%ad%x1f%s%x1e"
        ]);
        const commits = stdout.split("").filter((value) => value.trim()).map((value) => {
          const [hash, shortHash, author, email, date, subject] = value.trim().split("");
          return { hash, shortHash, author, email, date, subject };
        });
        return { success: true, action, commits };
      }
      if (action === "show") {
        const revision = validateRevision(payload.revision);
        const args = ["show", "--no-ext-diff", "--no-color", "--format=fuller", revision];
        if (paths.length) args.push("--", ...paths);
        const { stdout } = await runGit(workspace, args);
        return { success: true, action, revision, content: stdout };
      }
      if (action === "commit") {
        const denied2 = requireConfirmation(context, allowUnconfirmedLocalWrite, "Git commit");
        if (denied2) return denied2;
        if (!paths.length) throw new Error("paths is required for a Git commit.");
        const message = validateMessage(payload.message);
        return withMutationLock(context.organization_id, async () => {
          await runGit(workspace, ["add", "--", ...paths]);
          const staged = await runGit(
            workspace,
            ["diff", "--cached", "--quiet", "--", ...paths],
            { allowExitCodes: [1] }
          );
          if (staged.code !== 1) {
            return { success: false, error: "The selected paths contain no changes to commit." };
          }
          await runGit(workspace, ["commit", "--only", "--no-verify", "-m", message, "--", ...paths]);
          const { stdout } = await runGit(workspace, ["rev-parse", "HEAD"]);
          return { success: true, action, commit: stdout.trim(), paths };
        });
      }
      if (action === "create_branch") {
        const denied2 = requireConfirmation(context, allowUnconfirmedLocalWrite, "Branch creation");
        if (denied2) return denied2;
        if (typeof payload.branch !== "string" || !payload.branch) {
          throw new Error("branch is required.");
        }
        return withMutationLock(context.organization_id, async () => {
          await runGit(workspace, ["check-ref-format", "--branch", payload.branch]);
          await runGit(workspace, ["branch", "--", payload.branch]);
          return { success: true, action, branch: payload.branch };
        });
      }
      if (action === "switch_branch") {
        const denied2 = requireConfirmation(context, allowUnconfirmedLocalWrite, "Branch switching");
        if (denied2) return denied2;
        if (typeof payload.branch !== "string" || !payload.branch) {
          throw new Error("branch is required.");
        }
        return withMutationLock(context.organization_id, async () => {
          await runGit(workspace, ["check-ref-format", "--branch", payload.branch]);
          await runGit(workspace, ["switch", "--", payload.branch]);
          return { success: true, action, branch: payload.branch };
        });
      }
      if (action === "revert") {
        const denied2 = requireConfirmation(context, allowUnconfirmedLocalWrite, "Git revert");
        if (denied2) return denied2;
        const revision = validateRevision(payload.revision);
        return withMutationLock(context.organization_id, async () => {
          const status = await runGit(workspace, [
            "status",
            "--porcelain=v1",
            "--untracked-files=no"
          ]);
          if (status.stdout) {
            return {
              success: false,
              error: "Git revert requires a clean tracked working tree. Commit or discard current changes first."
            };
          }
          try {
            await runGit(workspace, ["revert", "--no-edit", revision]);
          } catch (error) {
            await runGit(workspace, ["revert", "--abort"]).catch(() => {
            });
            throw error;
          }
          const { stdout } = await runGit(workspace, ["rev-parse", "HEAD"]);
          return { success: true, action, reverted: revision, commit: stdout.trim() };
        });
      }
      throw new Error(`Unsupported Git action: ${action}`);
    }
  };
}


/***/ },

/***/ 7505
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ createHistoryTool)
/* harmony export */ });
function createHistoryTool({ crud, organization_id, host, conversation_id }) {
  return {
    name: "search_conversation_history",
    handler: async ({ query, limit = 12, skip = 0 } = {}) => {
      const safeLimit = Math.min(Math.max(Number(limit) || 12, 1), 20);
      const safeSkip = Math.max(Number(skip) || 0, 0);
      const filterQuery = { conversation_id };
      if (query) {
        const literalQuery = String(query).slice(0, 200).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        filterQuery.content = {
          $regex: literalQuery,
          $options: "i"
        };
      }
      const response = await crud.send({
        method: "object.read",
        array: "ai-messages",
        organization_id,
        host,
        filter: {
          query: filterQuery,
          key: { role: 1, content: 1 },
          sort: [{ key: "_id", direction: -1 }],
          index: safeSkip,
          limit: safeLimit
        }
      });
      return {
        messages: (response.object ?? []).reverse().map(({ role, content }) => ({
          role,
          content
        })),
        skip: safeSkip,
        limit: safeLimit,
        count: response.filter?.count
      };
    }
  };
}


/***/ },

/***/ 1819
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Q: () => (/* binding */ createRouteTool)
/* harmony export */ });
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9170);

function createRouteTool({ server }) {
  const routes = server.routes;
  return {
    name: "manage_server_routes",
    handler: async ({ action, routePath, responseContent, contentType = "text/plain" }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_0__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      if (action === "list") {
        const activeRoutes = Array.from(routes.keys());
        return { success: true, routes: activeRoutes, count: activeRoutes.length };
      }
      if (action === "add") {
        if (!routePath) return { success: false, error: "routePath is required when adding a route." };
        const customHandler = async (req, res) => {
          res.writeHead(200, { "Content-Type": contentType });
          res.end(typeof responseContent === "object" ? JSON.stringify(responseContent) : responseContent ?? "OK");
        };
        routes.set(routePath, customHandler);
        return { success: true, message: `Route "${routePath}" successfully registered.`, routePath };
      }
      if (action === "remove") {
        if (!routePath) return { success: false, error: "routePath is required when removing a route." };
        const removed = routes.delete(routePath);
        return { success: removed, message: removed ? `Route "${routePath}" removed.` : `Route "${routePath}" not found.` };
      }
      return { success: false, error: `Invalid action: ${action}` };
    }
  };
}


/***/ },

/***/ 6843
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ createSendTool)
/* harmony export */ });
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9170);

function createSendTool({ server, organization_id }) {
  return {
    name: "send_server_message",
    handler: async (payload) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_0__/* .platformAccessError */ .gi)(server, organization_id);
      if (denied) return denied;
      const routedPayload = {
        ...payload,
        organization_id
      };
      await server.send(routedPayload);
      return routedPayload;
    }
  };
}


/***/ },

/***/ 3889
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   S: () => (/* binding */ createServerClusterTool)
/* harmony export */ });
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9170);

function createServerClusterTool({ server }) {
  const crud = server.crud;
  return {
    name: "manage_server_cluster",
    handler: async ({
      action,
      serverId,
      host,
      status,
      limit = 50,
      operation,
      worker,
      value,
      organizations
    }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_0__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      switch (action) {
        case "self": {
          return {
            success: true,
            action: "self",
            server: {
              _id: server.id,
              host: server.host,
              ip: server.ip,
              isPrimary: server.isPrimary,
              isWorker: server.isWorker,
              workerId: server.workerId,
              totalWorkers: server.totalWorkers,
              infrastructure: server.infrastructure,
              location: server.location,
              isCordoned: server.state.isCordon,
              isShedding: server.state.isShedding,
              isDraining: server.state.isDraining
            }
          };
        }
        case "get": {
          if (!serverId && !host) {
            return { success: false, error: 'Either "serverId" or "host" is required for get action.' };
          }
          const query = serverId ? { _id: serverId } : { host };
          const response = await crud.send({
            method: "object.read",
            array: "servers",
            organization_id: context.organization_id,
            filter: { query, limit: 1 }
          });
          const found = response.object[0];
          return { success: true, action: "get", server: found };
        }
        case "list": {
          const query = status ? { status } : {};
          const response = await crud.send({
            method: "object.read",
            array: "servers",
            organization_id: context.organization_id,
            filter: { query, limit }
          });
          const servers = response.object;
          return { success: true, action: "list", count: servers.length, servers };
        }
        case "control": {
          if (!serverId) {
            return { success: false, error: '"serverId" is required for control actions.' };
          }
          const workerOperations = /* @__PURE__ */ new Set(["cordon", "shed", "drain"]);
          const masterOperations = /* @__PURE__ */ new Set(["reboot", "shutdown"]);
          const supported = /* @__PURE__ */ new Set([
            ...workerOperations,
            ...masterOperations,
            "restart"
          ]);
          if (!supported.has(operation)) {
            return { success: false, error: `Unsupported server control operation: ${operation}` };
          }
          if (workerOperations.has(operation) && worker == null) {
            return { success: false, error: `"worker" is required for ${operation}.` };
          }
          if (operation === "shed" && organizations === void 0) {
            return {
              success: false,
              error: '"organizations" must be an organization ID, an array of IDs, or false for shed.'
            };
          }
          const payload = {
            method: operation,
            server: serverId,
            organization_id: context.organization_id
          };
          if (worker != null) payload.worker = worker;
          if (operation === "cordon" || operation === "drain") {
            payload.value = value !== false;
          }
          if (operation === "shed") payload.organizations = organizations;
          if (masterOperations.has(operation) || operation === "restart" && worker == null) {
            payload.master = true;
          }
          await server.send(payload);
          return { success: true, action: "control", operation, payload };
        }
        default:
          throw new Error(`Unsupported cluster action: ${action}`);
      }
    }
  };
}


/***/ },

/***/ 8332
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   m: () => (/* binding */ createSocketTool)
/* harmony export */ });
function createSocketTool({ server }) {
  const wsManager = server.wsManager;
  return {
    name: "send_socket_message",
    handler: async ({ data = {}, clientId, broadcast = false }, context) => {
      const targetClientId = context.clientId ?? clientId;
      if (!broadcast && !targetClientId) {
        throw new Error("clientId is required unless broadcast is true.");
      }
      const payload = {
        ...data,
        organization_id: context.organization_id,
        ...targetClientId ? { clientId: targetClientId } : {},
        ...context.user_id ? { user_id: context.user_id } : {},
        broadcast: broadcast === true,
        log: data.log ?? false
      };
      await wsManager.send(payload);
      return payload;
    }
  };
}


/***/ },

/***/ 8192
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ createStorageTool)
/* harmony export */ });
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9170);

function createStorageTool({ server }) {
  const storage = server.storage;
  return {
    name: "manage_server_storage",
    handler: async ({ action, key, value }, context = {}) => {
      const denied = (0,_platform_js__WEBPACK_IMPORTED_MODULE_0__/* .platformAccessError */ .gi)(server, context?.organization_id);
      if (denied) return denied;
      switch (action) {
        case "get":
          return storage.get(key);
        case "set":
          return storage.set(key, value);
        case "delete":
          return storage.delete(key);
        case "size":
          return storage.size();
        case "clear":
          return storage.clear();
        default:
          throw new Error(`Unsupported storage action: ${action}`);
      }
    }
  };
}


/***/ },

/***/ 7936
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IN: () => (/* binding */ createWorkspaceResolver),
/* harmony export */   IT: () => (/* binding */ getRepositoryWorkspace),
/* harmony export */   sU: () => (/* binding */ createRuntimeDirectories)
/* harmony export */ });
/* harmony import */ var node_fs_promises__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8298);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5663);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6674);
/* harmony import */ var _platform_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9170);




function getRepositoryWorkspace(server) {
  const checkout = server?.repository?.repositories?.find((entry) => entry?.enabled !== false && entry?.checkout?.workspace)?.checkout.workspace;
  if (typeof checkout === "string" && node_path__WEBPACK_IMPORTED_MODULE_1__["default"].isAbsolute(checkout)) return node_path__WEBPACK_IMPORTED_MODULE_1__["default"].resolve(checkout);
  const inherited = process.env.SERVER_REPOSITORY_ROOT;
  if ((0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .isPlatformOrganization */ .dk)(server, process.env.SERVER_REPOSITORY_ORGANIZATION_ID) && typeof inherited === "string" && node_path__WEBPACK_IMPORTED_MODULE_1__["default"].isAbsolute(inherited)) return node_path__WEBPACK_IMPORTED_MODULE_1__["default"].resolve(inherited);
}
function createWorkspaceResolver(server) {
  const assertContained = (workspace, target, filePath) => {
    if (target !== workspace && !target.startsWith(`${workspace}${node_path__WEBPACK_IMPORTED_MODULE_1__["default"].sep}`)) {
      throw new Error(`Local file path escapes the prepared repository workspace: ${filePath}`);
    }
  };
  const organizationRoot = (organization_id) => {
    if (!(0,_platform_js__WEBPACK_IMPORTED_MODULE_3__/* .isPlatformOrganization */ .dk)(server, organization_id)) {
      throw new Error("Local workspace access is restricted to the platform organization.");
    }
    const root = getRepositoryWorkspace(server);
    if (!root) throw new Error("No prepared cluster repository is available for local workspace access.");
    return root;
  };
  const resolve = (organization_id, filePath = ".") => {
    const workspace = organizationRoot(organization_id);
    if (typeof filePath !== "string" || node_path__WEBPACK_IMPORTED_MODULE_1__["default"].isAbsolute(filePath)) {
      throw new Error(`Local file path must be relative to the prepared repository workspace: ${filePath}`);
    }
    const [firstSegment] = filePath.replaceAll("\\", "/").split("/").filter(Boolean);
    if ([".ai", ".git"].includes(firstSegment)) {
      throw new Error(`The ${firstSegment} directory is reserved and cannot be accessed by project file tools.`);
    }
    const target = node_path__WEBPACK_IMPORTED_MODULE_1__["default"].resolve(workspace, filePath);
    assertContained(workspace, target, filePath);
    return target;
  };
  const ensure = async (organization_id) => {
    const workspace = organizationRoot(organization_id);
    if (!(await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].stat(workspace)).isDirectory()) throw new Error("The prepared cluster checkout must be an existing directory.");
    return workspace;
  };
  const resolvePath = async (organization_id, filePath = ".", { forWrite = false } = {}) => {
    const workspace = await ensure(organization_id);
    const target = resolve(organization_id, filePath);
    const realWorkspace = await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].realpath(workspace);
    if (!forWrite) {
      const realTarget = await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].realpath(target);
      assertContained(realWorkspace, realTarget, filePath);
      return realTarget;
    }
    let existingPath = target;
    while (existingPath !== workspace) {
      try {
        await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].lstat(existingPath);
        break;
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        existingPath = node_path__WEBPACK_IMPORTED_MODULE_1__["default"].dirname(existingPath);
      }
    }
    const realExistingPath = await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].realpath(existingPath);
    assertContained(realWorkspace, realExistingPath, filePath);
    try {
      const realTarget = await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].realpath(target);
      assertContained(realWorkspace, realTarget, filePath);
      return realTarget;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      return target;
    }
  };
  return { organizationRoot, resolve, resolvePath, ensure };
}
async function createRuntimeDirectories(server, organization_id, { useRepository = false } = {}) {
  if (typeof organization_id !== "string" || !organization_id.trim()) {
    throw new Error("An authenticated organization_id is required for an AI runtime.");
  }
  if (useRepository) {
    const workingDirectory2 = await createWorkspaceResolver(server).ensure(organization_id);
    const baseDirectory2 = node_path__WEBPACK_IMPORTED_MODULE_1__["default"].join(node_path__WEBPACK_IMPORTED_MODULE_1__["default"].dirname(workingDirectory2), ".cocreate", "ai", node_path__WEBPACK_IMPORTED_MODULE_1__["default"].basename(workingDirectory2));
    await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].mkdir(baseDirectory2, { recursive: true, mode: 448 });
    return { workingDirectory: workingDirectory2, baseDirectory: baseDirectory2, cleanup: async () => {
    } };
  }
  const root = await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].mkdtemp(node_path__WEBPACK_IMPORTED_MODULE_1__["default"].join((0,node_os__WEBPACK_IMPORTED_MODULE_2__.tmpdir)(), "cocreate-ai-"));
  const workingDirectory = node_path__WEBPACK_IMPORTED_MODULE_1__["default"].join(root, "work");
  const baseDirectory = node_path__WEBPACK_IMPORTED_MODULE_1__["default"].join(root, "state");
  const cleanup = () => node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].rm(root, { recursive: true, force: true });
  try {
    await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].mkdir(workingDirectory, { mode: 448 });
    await node_fs_promises__WEBPACK_IMPORTED_MODULE_0__["default"].mkdir(baseDirectory, { mode: 448 });
    return { workingDirectory, baseDirectory, cleanup };
  } catch (error) {
    await cleanup();
    throw error;
  }
}


/***/ },

/***/ 3281
(__unused_webpack_module, exports, __webpack_require__) {


/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
/// <reference path="../../typings/thenable.d.ts" />
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ProgressType = exports.ProgressToken = exports.createMessageConnection = exports.NullLogger = exports.ConnectionOptions = exports.ConnectionStrategy = exports.AbstractMessageBuffer = exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = exports.SharedArrayReceiverStrategy = exports.SharedArraySenderStrategy = exports.CancellationToken = exports.CancellationTokenSource = exports.Emitter = exports.Event = exports.Disposable = exports.LRUCache = exports.Touch = exports.LinkedMap = exports.ParameterStructures = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.ErrorCodes = exports.ResponseError = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType0 = exports.RequestType = exports.Message = exports.RAL = void 0;
exports.MessageStrategy = exports.CancellationStrategy = exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.TraceValues = exports.Trace = void 0;
const messages_1 = __webpack_require__(6177);
Object.defineProperty(exports, "Message", ({ enumerable: true, get: function () { return messages_1.Message; } }));
Object.defineProperty(exports, "RequestType", ({ enumerable: true, get: function () { return messages_1.RequestType; } }));
Object.defineProperty(exports, "RequestType0", ({ enumerable: true, get: function () { return messages_1.RequestType0; } }));
Object.defineProperty(exports, "RequestType1", ({ enumerable: true, get: function () { return messages_1.RequestType1; } }));
Object.defineProperty(exports, "RequestType2", ({ enumerable: true, get: function () { return messages_1.RequestType2; } }));
Object.defineProperty(exports, "RequestType3", ({ enumerable: true, get: function () { return messages_1.RequestType3; } }));
Object.defineProperty(exports, "RequestType4", ({ enumerable: true, get: function () { return messages_1.RequestType4; } }));
Object.defineProperty(exports, "RequestType5", ({ enumerable: true, get: function () { return messages_1.RequestType5; } }));
Object.defineProperty(exports, "RequestType6", ({ enumerable: true, get: function () { return messages_1.RequestType6; } }));
Object.defineProperty(exports, "RequestType7", ({ enumerable: true, get: function () { return messages_1.RequestType7; } }));
Object.defineProperty(exports, "RequestType8", ({ enumerable: true, get: function () { return messages_1.RequestType8; } }));
Object.defineProperty(exports, "RequestType9", ({ enumerable: true, get: function () { return messages_1.RequestType9; } }));
Object.defineProperty(exports, "ResponseError", ({ enumerable: true, get: function () { return messages_1.ResponseError; } }));
Object.defineProperty(exports, "ErrorCodes", ({ enumerable: true, get: function () { return messages_1.ErrorCodes; } }));
Object.defineProperty(exports, "NotificationType", ({ enumerable: true, get: function () { return messages_1.NotificationType; } }));
Object.defineProperty(exports, "NotificationType0", ({ enumerable: true, get: function () { return messages_1.NotificationType0; } }));
Object.defineProperty(exports, "NotificationType1", ({ enumerable: true, get: function () { return messages_1.NotificationType1; } }));
Object.defineProperty(exports, "NotificationType2", ({ enumerable: true, get: function () { return messages_1.NotificationType2; } }));
Object.defineProperty(exports, "NotificationType3", ({ enumerable: true, get: function () { return messages_1.NotificationType3; } }));
Object.defineProperty(exports, "NotificationType4", ({ enumerable: true, get: function () { return messages_1.NotificationType4; } }));
Object.defineProperty(exports, "NotificationType5", ({ enumerable: true, get: function () { return messages_1.NotificationType5; } }));
Object.defineProperty(exports, "NotificationType6", ({ enumerable: true, get: function () { return messages_1.NotificationType6; } }));
Object.defineProperty(exports, "NotificationType7", ({ enumerable: true, get: function () { return messages_1.NotificationType7; } }));
Object.defineProperty(exports, "NotificationType8", ({ enumerable: true, get: function () { return messages_1.NotificationType8; } }));
Object.defineProperty(exports, "NotificationType9", ({ enumerable: true, get: function () { return messages_1.NotificationType9; } }));
Object.defineProperty(exports, "ParameterStructures", ({ enumerable: true, get: function () { return messages_1.ParameterStructures; } }));
const linkedMap_1 = __webpack_require__(3352);
Object.defineProperty(exports, "LinkedMap", ({ enumerable: true, get: function () { return linkedMap_1.LinkedMap; } }));
Object.defineProperty(exports, "LRUCache", ({ enumerable: true, get: function () { return linkedMap_1.LRUCache; } }));
Object.defineProperty(exports, "Touch", ({ enumerable: true, get: function () { return linkedMap_1.Touch; } }));
const disposable_1 = __webpack_require__(4019);
Object.defineProperty(exports, "Disposable", ({ enumerable: true, get: function () { return disposable_1.Disposable; } }));
const events_1 = __webpack_require__(2676);
Object.defineProperty(exports, "Event", ({ enumerable: true, get: function () { return events_1.Event; } }));
Object.defineProperty(exports, "Emitter", ({ enumerable: true, get: function () { return events_1.Emitter; } }));
const cancellation_1 = __webpack_require__(9850);
Object.defineProperty(exports, "CancellationTokenSource", ({ enumerable: true, get: function () { return cancellation_1.CancellationTokenSource; } }));
Object.defineProperty(exports, "CancellationToken", ({ enumerable: true, get: function () { return cancellation_1.CancellationToken; } }));
const sharedArrayCancellation_1 = __webpack_require__(4996);
Object.defineProperty(exports, "SharedArraySenderStrategy", ({ enumerable: true, get: function () { return sharedArrayCancellation_1.SharedArraySenderStrategy; } }));
Object.defineProperty(exports, "SharedArrayReceiverStrategy", ({ enumerable: true, get: function () { return sharedArrayCancellation_1.SharedArrayReceiverStrategy; } }));
const messageReader_1 = __webpack_require__(9085);
Object.defineProperty(exports, "MessageReader", ({ enumerable: true, get: function () { return messageReader_1.MessageReader; } }));
Object.defineProperty(exports, "AbstractMessageReader", ({ enumerable: true, get: function () { return messageReader_1.AbstractMessageReader; } }));
Object.defineProperty(exports, "ReadableStreamMessageReader", ({ enumerable: true, get: function () { return messageReader_1.ReadableStreamMessageReader; } }));
const messageWriter_1 = __webpack_require__(3193);
Object.defineProperty(exports, "MessageWriter", ({ enumerable: true, get: function () { return messageWriter_1.MessageWriter; } }));
Object.defineProperty(exports, "AbstractMessageWriter", ({ enumerable: true, get: function () { return messageWriter_1.AbstractMessageWriter; } }));
Object.defineProperty(exports, "WriteableStreamMessageWriter", ({ enumerable: true, get: function () { return messageWriter_1.WriteableStreamMessageWriter; } }));
const messageBuffer_1 = __webpack_require__(9244);
Object.defineProperty(exports, "AbstractMessageBuffer", ({ enumerable: true, get: function () { return messageBuffer_1.AbstractMessageBuffer; } }));
const connection_1 = __webpack_require__(577);
Object.defineProperty(exports, "ConnectionStrategy", ({ enumerable: true, get: function () { return connection_1.ConnectionStrategy; } }));
Object.defineProperty(exports, "ConnectionOptions", ({ enumerable: true, get: function () { return connection_1.ConnectionOptions; } }));
Object.defineProperty(exports, "NullLogger", ({ enumerable: true, get: function () { return connection_1.NullLogger; } }));
Object.defineProperty(exports, "createMessageConnection", ({ enumerable: true, get: function () { return connection_1.createMessageConnection; } }));
Object.defineProperty(exports, "ProgressToken", ({ enumerable: true, get: function () { return connection_1.ProgressToken; } }));
Object.defineProperty(exports, "ProgressType", ({ enumerable: true, get: function () { return connection_1.ProgressType; } }));
Object.defineProperty(exports, "Trace", ({ enumerable: true, get: function () { return connection_1.Trace; } }));
Object.defineProperty(exports, "TraceValues", ({ enumerable: true, get: function () { return connection_1.TraceValues; } }));
Object.defineProperty(exports, "TraceFormat", ({ enumerable: true, get: function () { return connection_1.TraceFormat; } }));
Object.defineProperty(exports, "SetTraceNotification", ({ enumerable: true, get: function () { return connection_1.SetTraceNotification; } }));
Object.defineProperty(exports, "LogTraceNotification", ({ enumerable: true, get: function () { return connection_1.LogTraceNotification; } }));
Object.defineProperty(exports, "ConnectionErrors", ({ enumerable: true, get: function () { return connection_1.ConnectionErrors; } }));
Object.defineProperty(exports, "ConnectionError", ({ enumerable: true, get: function () { return connection_1.ConnectionError; } }));
Object.defineProperty(exports, "CancellationReceiverStrategy", ({ enumerable: true, get: function () { return connection_1.CancellationReceiverStrategy; } }));
Object.defineProperty(exports, "CancellationSenderStrategy", ({ enumerable: true, get: function () { return connection_1.CancellationSenderStrategy; } }));
Object.defineProperty(exports, "CancellationStrategy", ({ enumerable: true, get: function () { return connection_1.CancellationStrategy; } }));
Object.defineProperty(exports, "MessageStrategy", ({ enumerable: true, get: function () { return connection_1.MessageStrategy; } }));
const ral_1 = __webpack_require__(9590);
exports.RAL = ral_1.default;


/***/ },

/***/ 9850
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
__webpack_unused_export__ = ({ value: true });
exports.CancellationTokenSource = exports.CancellationToken = void 0;
const ral_1 = __webpack_require__(9590);
const Is = __webpack_require__(8585);
const events_1 = __webpack_require__(2676);
var CancellationToken;
(function (CancellationToken) {
    CancellationToken.None = Object.freeze({
        isCancellationRequested: false,
        onCancellationRequested: events_1.Event.None
    });
    CancellationToken.Cancelled = Object.freeze({
        isCancellationRequested: true,
        onCancellationRequested: events_1.Event.None
    });
    function is(value) {
        const candidate = value;
        return candidate && (candidate === CancellationToken.None
            || candidate === CancellationToken.Cancelled
            || (Is.boolean(candidate.isCancellationRequested) && !!candidate.onCancellationRequested));
    }
    CancellationToken.is = is;
})(CancellationToken || (exports.CancellationToken = CancellationToken = {}));
const shortcutEvent = Object.freeze(function (callback, context) {
    const handle = (0, ral_1.default)().timer.setTimeout(callback.bind(context), 0);
    return { dispose() { handle.dispose(); } };
});
class MutableToken {
    constructor() {
        this._isCancelled = false;
    }
    cancel() {
        if (!this._isCancelled) {
            this._isCancelled = true;
            if (this._emitter) {
                this._emitter.fire(undefined);
                this.dispose();
            }
        }
    }
    get isCancellationRequested() {
        return this._isCancelled;
    }
    get onCancellationRequested() {
        if (this._isCancelled) {
            return shortcutEvent;
        }
        if (!this._emitter) {
            this._emitter = new events_1.Emitter();
        }
        return this._emitter.event;
    }
    dispose() {
        if (this._emitter) {
            this._emitter.dispose();
            this._emitter = undefined;
        }
    }
}
class CancellationTokenSource {
    get token() {
        if (!this._token) {
            // be lazy and create the token only when
            // actually needed
            this._token = new MutableToken();
        }
        return this._token;
    }
    cancel() {
        if (!this._token) {
            // save an object by returning the default
            // cancelled token when cancellation happens
            // before someone asks for the token
            this._token = CancellationToken.Cancelled;
        }
        else {
            this._token.cancel();
        }
    }
    dispose() {
        if (!this._token) {
            // ensure to initialize with an empty token if we had none
            this._token = CancellationToken.None;
        }
        else if (this._token instanceof MutableToken) {
            // actually dispose
            this._token.dispose();
        }
    }
}
exports.CancellationTokenSource = CancellationTokenSource;


/***/ },

/***/ 577
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
exports.createMessageConnection = exports.ConnectionOptions = exports.MessageStrategy = exports.CancellationStrategy = exports.CancellationSenderStrategy = exports.CancellationReceiverStrategy = __webpack_unused_export__ = __webpack_unused_export__ = exports.ConnectionStrategy = exports.ConnectionError = exports.ConnectionErrors = exports.LogTraceNotification = exports.SetTraceNotification = exports.TraceFormat = exports.TraceValues = exports.Trace = exports.NullLogger = exports.ProgressType = exports.ProgressToken = void 0;
const ral_1 = __webpack_require__(9590);
const Is = __webpack_require__(8585);
const messages_1 = __webpack_require__(6177);
const linkedMap_1 = __webpack_require__(3352);
const events_1 = __webpack_require__(2676);
const cancellation_1 = __webpack_require__(9850);
var CancelNotification;
(function (CancelNotification) {
    CancelNotification.type = new messages_1.NotificationType('$/cancelRequest');
})(CancelNotification || (CancelNotification = {}));
var ProgressToken;
(function (ProgressToken) {
    function is(value) {
        return typeof value === 'string' || typeof value === 'number';
    }
    ProgressToken.is = is;
})(ProgressToken || (exports.ProgressToken = ProgressToken = {}));
var ProgressNotification;
(function (ProgressNotification) {
    ProgressNotification.type = new messages_1.NotificationType('$/progress');
})(ProgressNotification || (ProgressNotification = {}));
class ProgressType {
    constructor() {
    }
}
exports.ProgressType = ProgressType;
var StarRequestHandler;
(function (StarRequestHandler) {
    function is(value) {
        return Is.func(value);
    }
    StarRequestHandler.is = is;
})(StarRequestHandler || (StarRequestHandler = {}));
exports.NullLogger = Object.freeze({
    error: () => { },
    warn: () => { },
    info: () => { },
    log: () => { }
});
var Trace;
(function (Trace) {
    Trace[Trace["Off"] = 0] = "Off";
    Trace[Trace["Messages"] = 1] = "Messages";
    Trace[Trace["Compact"] = 2] = "Compact";
    Trace[Trace["Verbose"] = 3] = "Verbose";
})(Trace || (exports.Trace = Trace = {}));
var TraceValues;
(function (TraceValues) {
    /**
     * Turn tracing off.
     */
    TraceValues.Off = 'off';
    /**
     * Trace messages only.
     */
    TraceValues.Messages = 'messages';
    /**
     * Compact message tracing.
     */
    TraceValues.Compact = 'compact';
    /**
     * Verbose message tracing.
     */
    TraceValues.Verbose = 'verbose';
})(TraceValues || (exports.TraceValues = TraceValues = {}));
(function (Trace) {
    function fromString(value) {
        if (!Is.string(value)) {
            return Trace.Off;
        }
        value = value.toLowerCase();
        switch (value) {
            case 'off':
                return Trace.Off;
            case 'messages':
                return Trace.Messages;
            case 'compact':
                return Trace.Compact;
            case 'verbose':
                return Trace.Verbose;
            default:
                return Trace.Off;
        }
    }
    Trace.fromString = fromString;
    function toString(value) {
        switch (value) {
            case Trace.Off:
                return 'off';
            case Trace.Messages:
                return 'messages';
            case Trace.Compact:
                return 'compact';
            case Trace.Verbose:
                return 'verbose';
            default:
                return 'off';
        }
    }
    Trace.toString = toString;
})(Trace || (exports.Trace = Trace = {}));
var TraceFormat;
(function (TraceFormat) {
    TraceFormat["Text"] = "text";
    TraceFormat["JSON"] = "json";
})(TraceFormat || (exports.TraceFormat = TraceFormat = {}));
(function (TraceFormat) {
    function fromString(value) {
        if (!Is.string(value)) {
            return TraceFormat.Text;
        }
        value = value.toLowerCase();
        if (value === 'json') {
            return TraceFormat.JSON;
        }
        else {
            return TraceFormat.Text;
        }
    }
    TraceFormat.fromString = fromString;
})(TraceFormat || (exports.TraceFormat = TraceFormat = {}));
var SetTraceNotification;
(function (SetTraceNotification) {
    SetTraceNotification.type = new messages_1.NotificationType('$/setTrace');
})(SetTraceNotification || (exports.SetTraceNotification = SetTraceNotification = {}));
var LogTraceNotification;
(function (LogTraceNotification) {
    LogTraceNotification.type = new messages_1.NotificationType('$/logTrace');
})(LogTraceNotification || (exports.LogTraceNotification = LogTraceNotification = {}));
var ConnectionErrors;
(function (ConnectionErrors) {
    /**
     * The connection is closed.
     */
    ConnectionErrors[ConnectionErrors["Closed"] = 1] = "Closed";
    /**
     * The connection got disposed.
     */
    ConnectionErrors[ConnectionErrors["Disposed"] = 2] = "Disposed";
    /**
     * The connection is already in listening mode.
     */
    ConnectionErrors[ConnectionErrors["AlreadyListening"] = 3] = "AlreadyListening";
})(ConnectionErrors || (exports.ConnectionErrors = ConnectionErrors = {}));
class ConnectionError extends Error {
    constructor(code, message) {
        super(message);
        this.code = code;
        Object.setPrototypeOf(this, ConnectionError.prototype);
    }
}
exports.ConnectionError = ConnectionError;
var ConnectionStrategy;
(function (ConnectionStrategy) {
    function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.cancelUndispatched);
    }
    ConnectionStrategy.is = is;
})(ConnectionStrategy || (exports.ConnectionStrategy = ConnectionStrategy = {}));
var IdCancellationReceiverStrategy;
(function (IdCancellationReceiverStrategy) {
    function is(value) {
        const candidate = value;
        return candidate && (candidate.kind === undefined || candidate.kind === 'id') && Is.func(candidate.createCancellationTokenSource) && (candidate.dispose === undefined || Is.func(candidate.dispose));
    }
    IdCancellationReceiverStrategy.is = is;
})(IdCancellationReceiverStrategy || (__webpack_unused_export__ = IdCancellationReceiverStrategy = {}));
var RequestCancellationReceiverStrategy;
(function (RequestCancellationReceiverStrategy) {
    function is(value) {
        const candidate = value;
        return candidate && candidate.kind === 'request' && Is.func(candidate.createCancellationTokenSource) && (candidate.dispose === undefined || Is.func(candidate.dispose));
    }
    RequestCancellationReceiverStrategy.is = is;
})(RequestCancellationReceiverStrategy || (__webpack_unused_export__ = RequestCancellationReceiverStrategy = {}));
var CancellationReceiverStrategy;
(function (CancellationReceiverStrategy) {
    CancellationReceiverStrategy.Message = Object.freeze({
        createCancellationTokenSource(_) {
            return new cancellation_1.CancellationTokenSource();
        }
    });
    function is(value) {
        return IdCancellationReceiverStrategy.is(value) || RequestCancellationReceiverStrategy.is(value);
    }
    CancellationReceiverStrategy.is = is;
})(CancellationReceiverStrategy || (exports.CancellationReceiverStrategy = CancellationReceiverStrategy = {}));
var CancellationSenderStrategy;
(function (CancellationSenderStrategy) {
    CancellationSenderStrategy.Message = Object.freeze({
        sendCancellation(conn, id) {
            return conn.sendNotification(CancelNotification.type, { id });
        },
        cleanup(_) { }
    });
    function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.sendCancellation) && Is.func(candidate.cleanup);
    }
    CancellationSenderStrategy.is = is;
})(CancellationSenderStrategy || (exports.CancellationSenderStrategy = CancellationSenderStrategy = {}));
var CancellationStrategy;
(function (CancellationStrategy) {
    CancellationStrategy.Message = Object.freeze({
        receiver: CancellationReceiverStrategy.Message,
        sender: CancellationSenderStrategy.Message
    });
    function is(value) {
        const candidate = value;
        return candidate && CancellationReceiverStrategy.is(candidate.receiver) && CancellationSenderStrategy.is(candidate.sender);
    }
    CancellationStrategy.is = is;
})(CancellationStrategy || (exports.CancellationStrategy = CancellationStrategy = {}));
var MessageStrategy;
(function (MessageStrategy) {
    function is(value) {
        const candidate = value;
        return candidate && Is.func(candidate.handleMessage);
    }
    MessageStrategy.is = is;
})(MessageStrategy || (exports.MessageStrategy = MessageStrategy = {}));
var ConnectionOptions;
(function (ConnectionOptions) {
    function is(value) {
        const candidate = value;
        return candidate && (CancellationStrategy.is(candidate.cancellationStrategy) || ConnectionStrategy.is(candidate.connectionStrategy) || MessageStrategy.is(candidate.messageStrategy));
    }
    ConnectionOptions.is = is;
})(ConnectionOptions || (exports.ConnectionOptions = ConnectionOptions = {}));
var ConnectionState;
(function (ConnectionState) {
    ConnectionState[ConnectionState["New"] = 1] = "New";
    ConnectionState[ConnectionState["Listening"] = 2] = "Listening";
    ConnectionState[ConnectionState["Closed"] = 3] = "Closed";
    ConnectionState[ConnectionState["Disposed"] = 4] = "Disposed";
})(ConnectionState || (ConnectionState = {}));
function createMessageConnection(messageReader, messageWriter, _logger, options) {
    const logger = _logger !== undefined ? _logger : exports.NullLogger;
    let sequenceNumber = 0;
    let notificationSequenceNumber = 0;
    let unknownResponseSequenceNumber = 0;
    const version = '2.0';
    let starRequestHandler = undefined;
    const requestHandlers = new Map();
    let starNotificationHandler = undefined;
    const notificationHandlers = new Map();
    const progressHandlers = new Map();
    let timer;
    let messageQueue = new linkedMap_1.LinkedMap();
    let responsePromises = new Map();
    let knownCanceledRequests = new Set();
    let requestTokens = new Map();
    let trace = Trace.Off;
    let traceFormat = TraceFormat.Text;
    let tracer;
    let state = ConnectionState.New;
    const errorEmitter = new events_1.Emitter();
    const closeEmitter = new events_1.Emitter();
    const unhandledNotificationEmitter = new events_1.Emitter();
    const unhandledProgressEmitter = new events_1.Emitter();
    const disposeEmitter = new events_1.Emitter();
    const cancellationStrategy = (options && options.cancellationStrategy) ? options.cancellationStrategy : CancellationStrategy.Message;
    function createRequestQueueKey(id) {
        if (id === null) {
            throw new Error(`Can't send requests with id null since the response can't be correlated.`);
        }
        return 'req-' + id.toString();
    }
    function createResponseQueueKey(id) {
        if (id === null) {
            return 'res-unknown-' + (++unknownResponseSequenceNumber).toString();
        }
        else {
            return 'res-' + id.toString();
        }
    }
    function createNotificationQueueKey() {
        return 'not-' + (++notificationSequenceNumber).toString();
    }
    function addMessageToQueue(queue, message) {
        if (messages_1.Message.isRequest(message)) {
            queue.set(createRequestQueueKey(message.id), message);
        }
        else if (messages_1.Message.isResponse(message)) {
            queue.set(createResponseQueueKey(message.id), message);
        }
        else {
            queue.set(createNotificationQueueKey(), message);
        }
    }
    function cancelUndispatched(_message) {
        return undefined;
    }
    function isListening() {
        return state === ConnectionState.Listening;
    }
    function isClosed() {
        return state === ConnectionState.Closed;
    }
    function isDisposed() {
        return state === ConnectionState.Disposed;
    }
    function closeHandler() {
        if (state === ConnectionState.New || state === ConnectionState.Listening) {
            state = ConnectionState.Closed;
            closeEmitter.fire(undefined);
        }
        // If the connection is disposed don't sent close events.
    }
    function readErrorHandler(error) {
        errorEmitter.fire([error, undefined, undefined]);
    }
    function writeErrorHandler(data) {
        errorEmitter.fire(data);
    }
    messageReader.onClose(closeHandler);
    messageReader.onError(readErrorHandler);
    messageWriter.onClose(closeHandler);
    messageWriter.onError(writeErrorHandler);
    function triggerMessageQueue() {
        if (timer || messageQueue.size === 0) {
            return;
        }
        timer = (0, ral_1.default)().timer.setImmediate(() => {
            timer = undefined;
            processMessageQueue();
        });
    }
    function handleMessage(message) {
        if (messages_1.Message.isRequest(message)) {
            handleRequest(message);
        }
        else if (messages_1.Message.isNotification(message)) {
            handleNotification(message);
        }
        else if (messages_1.Message.isResponse(message)) {
            handleResponse(message);
        }
        else {
            handleInvalidMessage(message);
        }
    }
    function processMessageQueue() {
        if (messageQueue.size === 0) {
            return;
        }
        const message = messageQueue.shift();
        try {
            const messageStrategy = options?.messageStrategy;
            if (MessageStrategy.is(messageStrategy)) {
                messageStrategy.handleMessage(message, handleMessage);
            }
            else {
                handleMessage(message);
            }
        }
        finally {
            triggerMessageQueue();
        }
    }
    const callback = (message) => {
        try {
            // We have received a cancellation message. Check if the message is still in the queue
            // and cancel it if allowed to do so.
            if (messages_1.Message.isNotification(message) && message.method === CancelNotification.type.method) {
                const cancelId = message.params.id;
                const key = createRequestQueueKey(cancelId);
                const toCancel = messageQueue.get(key);
                if (messages_1.Message.isRequest(toCancel)) {
                    const strategy = options?.connectionStrategy;
                    const response = (strategy && strategy.cancelUndispatched) ? strategy.cancelUndispatched(toCancel, cancelUndispatched) : cancelUndispatched(toCancel);
                    if (response && (response.error !== undefined || response.result !== undefined)) {
                        messageQueue.delete(key);
                        requestTokens.delete(cancelId);
                        response.id = toCancel.id;
                        traceSendingResponse(response, message.method, Date.now());
                        messageWriter.write(response).catch(() => logger.error(`Sending response for canceled message failed.`));
                        return;
                    }
                }
                const cancellationToken = requestTokens.get(cancelId);
                // The request is already running. Cancel the token
                if (cancellationToken !== undefined) {
                    cancellationToken.cancel();
                    traceReceivedNotification(message);
                    return;
                }
                else {
                    // Remember the cancel but still queue the message to
                    // clean up state in process message.
                    knownCanceledRequests.add(cancelId);
                }
            }
            addMessageToQueue(messageQueue, message);
        }
        finally {
            triggerMessageQueue();
        }
    };
    function handleRequest(requestMessage) {
        if (isDisposed()) {
            // we return here silently since we fired an event when the
            // connection got disposed.
            return;
        }
        function reply(resultOrError, method, startTime) {
            const message = {
                jsonrpc: version,
                id: requestMessage.id
            };
            if (resultOrError instanceof messages_1.ResponseError) {
                message.error = resultOrError.toJson();
            }
            else {
                message.result = resultOrError === undefined ? null : resultOrError;
            }
            traceSendingResponse(message, method, startTime);
            messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
        }
        function replyError(error, method, startTime) {
            const message = {
                jsonrpc: version,
                id: requestMessage.id,
                error: error.toJson()
            };
            traceSendingResponse(message, method, startTime);
            messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
        }
        function replySuccess(result, method, startTime) {
            // The JSON RPC defines that a response must either have a result or an error
            // So we can't treat undefined as a valid response result.
            if (result === undefined) {
                result = null;
            }
            const message = {
                jsonrpc: version,
                id: requestMessage.id,
                result: result
            };
            traceSendingResponse(message, method, startTime);
            messageWriter.write(message).catch(() => logger.error(`Sending response failed.`));
        }
        traceReceivedRequest(requestMessage);
        const element = requestHandlers.get(requestMessage.method);
        let type;
        let requestHandler;
        if (element) {
            type = element.type;
            requestHandler = element.handler;
        }
        const startTime = Date.now();
        if (requestHandler || starRequestHandler) {
            const tokenKey = requestMessage.id ?? String(Date.now()); //
            const cancellationSource = IdCancellationReceiverStrategy.is(cancellationStrategy.receiver)
                ? cancellationStrategy.receiver.createCancellationTokenSource(tokenKey)
                : cancellationStrategy.receiver.createCancellationTokenSource(requestMessage);
            if (requestMessage.id !== null && knownCanceledRequests.has(requestMessage.id)) {
                cancellationSource.cancel();
            }
            if (requestMessage.id !== null) {
                requestTokens.set(tokenKey, cancellationSource);
            }
            try {
                let handlerResult;
                if (requestHandler) {
                    if (requestMessage.params === undefined) {
                        if (type !== undefined && type.numberOfParams !== 0) {
                            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines ${type.numberOfParams} params but received none.`), requestMessage.method, startTime);
                            return;
                        }
                        handlerResult = requestHandler(cancellationSource.token);
                    }
                    else if (Array.isArray(requestMessage.params)) {
                        if (type !== undefined && type.parameterStructures === messages_1.ParameterStructures.byName) {
                            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by name but received parameters by position`), requestMessage.method, startTime);
                            return;
                        }
                        handlerResult = requestHandler(...requestMessage.params, cancellationSource.token);
                    }
                    else {
                        if (type !== undefined && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InvalidParams, `Request ${requestMessage.method} defines parameters by position but received parameters by name`), requestMessage.method, startTime);
                            return;
                        }
                        handlerResult = requestHandler(requestMessage.params, cancellationSource.token);
                    }
                }
                else if (starRequestHandler) {
                    handlerResult = starRequestHandler(requestMessage.method, requestMessage.params, cancellationSource.token);
                }
                const promise = handlerResult;
                if (!handlerResult) {
                    requestTokens.delete(tokenKey);
                    replySuccess(handlerResult, requestMessage.method, startTime);
                }
                else if (promise.then) {
                    promise.then((resultOrError) => {
                        requestTokens.delete(tokenKey);
                        reply(resultOrError, requestMessage.method, startTime);
                    }, error => {
                        requestTokens.delete(tokenKey);
                        if (error instanceof messages_1.ResponseError) {
                            replyError(error, requestMessage.method, startTime);
                        }
                        else if (error && Is.string(error.message)) {
                            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
                        }
                        else {
                            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
                        }
                    });
                }
                else {
                    requestTokens.delete(tokenKey);
                    reply(handlerResult, requestMessage.method, startTime);
                }
            }
            catch (error) {
                requestTokens.delete(tokenKey);
                if (error instanceof messages_1.ResponseError) {
                    reply(error, requestMessage.method, startTime);
                }
                else if (error && Is.string(error.message)) {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed with message: ${error.message}`), requestMessage.method, startTime);
                }
                else {
                    replyError(new messages_1.ResponseError(messages_1.ErrorCodes.InternalError, `Request ${requestMessage.method} failed unexpectedly without providing any details.`), requestMessage.method, startTime);
                }
            }
        }
        else {
            replyError(new messages_1.ResponseError(messages_1.ErrorCodes.MethodNotFound, `Unhandled method ${requestMessage.method}`), requestMessage.method, startTime);
        }
    }
    function handleResponse(responseMessage) {
        if (isDisposed()) {
            // See handle request.
            return;
        }
        if (responseMessage.id === null) {
            if (responseMessage.error) {
                logger.error(`Received response message without id: Error is: \n${JSON.stringify(responseMessage.error, undefined, 4)}`);
            }
            else {
                logger.error(`Received response message without id. No further error information provided.`);
            }
        }
        else {
            const key = responseMessage.id;
            const responsePromise = responsePromises.get(key);
            traceReceivedResponse(responseMessage, responsePromise);
            if (responsePromise !== undefined) {
                responsePromises.delete(key);
                try {
                    if (responseMessage.error) {
                        const error = responseMessage.error;
                        responsePromise.reject(new messages_1.ResponseError(error.code, error.message, error.data));
                    }
                    else if (responseMessage.result !== undefined) {
                        responsePromise.resolve(responseMessage.result);
                    }
                    else {
                        throw new Error('Should never happen.');
                    }
                }
                catch (error) {
                    if (error.message) {
                        logger.error(`Response handler '${responsePromise.method}' failed with message: ${error.message}`);
                    }
                    else {
                        logger.error(`Response handler '${responsePromise.method}' failed unexpectedly.`);
                    }
                }
            }
        }
    }
    function handleNotification(message) {
        if (isDisposed()) {
            // See handle request.
            return;
        }
        let type = undefined;
        let notificationHandler;
        if (message.method === CancelNotification.type.method) {
            const cancelId = message.params.id;
            knownCanceledRequests.delete(cancelId);
            traceReceivedNotification(message);
            return;
        }
        else {
            const element = notificationHandlers.get(message.method);
            if (element) {
                notificationHandler = element.handler;
                type = element.type;
            }
        }
        if (notificationHandler || starNotificationHandler) {
            try {
                traceReceivedNotification(message);
                if (notificationHandler) {
                    if (message.params === undefined) {
                        if (type !== undefined) {
                            if (type.numberOfParams !== 0 && type.parameterStructures !== messages_1.ParameterStructures.byName) {
                                logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received none.`);
                            }
                        }
                        notificationHandler();
                    }
                    else if (Array.isArray(message.params)) {
                        // There are JSON-RPC libraries that send progress message as positional params although
                        // specified as named. So convert them if this is the case.
                        const params = message.params;
                        if (message.method === ProgressNotification.type.method && params.length === 2 && ProgressToken.is(params[0])) {
                            notificationHandler({ token: params[0], value: params[1] });
                        }
                        else {
                            if (type !== undefined) {
                                if (type.parameterStructures === messages_1.ParameterStructures.byName) {
                                    logger.error(`Notification ${message.method} defines parameters by name but received parameters by position`);
                                }
                                if (type.numberOfParams !== message.params.length) {
                                    logger.error(`Notification ${message.method} defines ${type.numberOfParams} params but received ${params.length} arguments`);
                                }
                            }
                            notificationHandler(...params);
                        }
                    }
                    else {
                        if (type !== undefined && type.parameterStructures === messages_1.ParameterStructures.byPosition) {
                            logger.error(`Notification ${message.method} defines parameters by position but received parameters by name`);
                        }
                        notificationHandler(message.params);
                    }
                }
                else if (starNotificationHandler) {
                    starNotificationHandler(message.method, message.params);
                }
            }
            catch (error) {
                if (error.message) {
                    logger.error(`Notification handler '${message.method}' failed with message: ${error.message}`);
                }
                else {
                    logger.error(`Notification handler '${message.method}' failed unexpectedly.`);
                }
            }
        }
        else {
            unhandledNotificationEmitter.fire(message);
        }
    }
    function handleInvalidMessage(message) {
        if (!message) {
            logger.error('Received empty message.');
            return;
        }
        logger.error(`Received message which is neither a response nor a notification message:\n${JSON.stringify(message, null, 4)}`);
        // Test whether we find an id to reject the promise
        const responseMessage = message;
        if (Is.string(responseMessage.id) || Is.number(responseMessage.id)) {
            const key = responseMessage.id;
            const responseHandler = responsePromises.get(key);
            if (responseHandler) {
                responseHandler.reject(new Error('The received response has neither a result nor an error property.'));
            }
        }
    }
    function stringifyTrace(params) {
        if (params === undefined || params === null) {
            return undefined;
        }
        switch (trace) {
            case Trace.Verbose:
                return JSON.stringify(params, null, 4);
            case Trace.Compact:
                return JSON.stringify(params);
            default:
                return undefined;
        }
    }
    function traceSendingRequest(message) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if ((trace === Trace.Verbose || trace === Trace.Compact) && message.params) {
                data = `Params: ${stringifyTrace(message.params)}\n\n`;
            }
            tracer.log(`Sending request '${message.method} - (${message.id})'.`, data);
        }
        else {
            logLSPMessage('send-request', message);
        }
    }
    function traceSendingNotification(message) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose || trace === Trace.Compact) {
                if (message.params) {
                    data = `Params: ${stringifyTrace(message.params)}\n\n`;
                }
                else {
                    data = 'No parameters provided.\n\n';
                }
            }
            tracer.log(`Sending notification '${message.method}'.`, data);
        }
        else {
            logLSPMessage('send-notification', message);
        }
    }
    function traceSendingResponse(message, method, startTime) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose || trace === Trace.Compact) {
                if (message.error && message.error.data) {
                    data = `Error data: ${stringifyTrace(message.error.data)}\n\n`;
                }
                else {
                    if (message.result) {
                        data = `Result: ${stringifyTrace(message.result)}\n\n`;
                    }
                    else if (message.error === undefined) {
                        data = 'No result returned.\n\n';
                    }
                }
            }
            tracer.log(`Sending response '${method} - (${message.id})'. Processing request took ${Date.now() - startTime}ms`, data);
        }
        else {
            logLSPMessage('send-response', message);
        }
    }
    function traceReceivedRequest(message) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if ((trace === Trace.Verbose || trace === Trace.Compact) && message.params) {
                data = `Params: ${stringifyTrace(message.params)}\n\n`;
            }
            tracer.log(`Received request '${message.method} - (${message.id})'.`, data);
        }
        else {
            logLSPMessage('receive-request', message);
        }
    }
    function traceReceivedNotification(message) {
        if (trace === Trace.Off || !tracer || message.method === LogTraceNotification.type.method) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose || trace === Trace.Compact) {
                if (message.params) {
                    data = `Params: ${stringifyTrace(message.params)}\n\n`;
                }
                else {
                    data = 'No parameters provided.\n\n';
                }
            }
            tracer.log(`Received notification '${message.method}'.`, data);
        }
        else {
            logLSPMessage('receive-notification', message);
        }
    }
    function traceReceivedResponse(message, responsePromise) {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        if (traceFormat === TraceFormat.Text) {
            let data = undefined;
            if (trace === Trace.Verbose || trace === Trace.Compact) {
                if (message.error && message.error.data) {
                    data = `Error data: ${stringifyTrace(message.error.data)}\n\n`;
                }
                else {
                    if (message.result) {
                        data = `Result: ${stringifyTrace(message.result)}\n\n`;
                    }
                    else if (message.error === undefined) {
                        data = 'No result returned.\n\n';
                    }
                }
            }
            if (responsePromise) {
                const error = message.error ? ` Request failed: ${message.error.message} (${message.error.code}).` : '';
                tracer.log(`Received response '${responsePromise.method} - (${message.id})' in ${Date.now() - responsePromise.timerStart}ms.${error}`, data);
            }
            else {
                tracer.log(`Received response ${message.id} without active response promise.`, data);
            }
        }
        else {
            logLSPMessage('receive-response', message);
        }
    }
    function logLSPMessage(type, message) {
        if (!tracer || trace === Trace.Off) {
            return;
        }
        const lspMessage = {
            isLSPMessage: true,
            type,
            message,
            timestamp: Date.now()
        };
        tracer.log(lspMessage);
    }
    function throwIfClosedOrDisposed() {
        if (isClosed()) {
            throw new ConnectionError(ConnectionErrors.Closed, 'Connection is closed.');
        }
        if (isDisposed()) {
            throw new ConnectionError(ConnectionErrors.Disposed, 'Connection is disposed.');
        }
    }
    function throwIfListening() {
        if (isListening()) {
            throw new ConnectionError(ConnectionErrors.AlreadyListening, 'Connection is already listening');
        }
    }
    function throwIfNotListening() {
        if (!isListening()) {
            throw new Error('Call listen() first.');
        }
    }
    function undefinedToNull(param) {
        if (param === undefined) {
            return null;
        }
        else {
            return param;
        }
    }
    function nullToUndefined(param) {
        if (param === null) {
            return undefined;
        }
        else {
            return param;
        }
    }
    function isNamedParam(param) {
        return param !== undefined && param !== null && !Array.isArray(param) && typeof param === 'object';
    }
    function computeSingleParam(parameterStructures, param) {
        switch (parameterStructures) {
            case messages_1.ParameterStructures.auto:
                if (isNamedParam(param)) {
                    return nullToUndefined(param);
                }
                else {
                    return [undefinedToNull(param)];
                }
            case messages_1.ParameterStructures.byName:
                if (!isNamedParam(param)) {
                    throw new Error(`Received parameters by name but param is not an object literal.`);
                }
                return nullToUndefined(param);
            case messages_1.ParameterStructures.byPosition:
                return [undefinedToNull(param)];
            default:
                throw new Error(`Unknown parameter structure ${parameterStructures.toString()}`);
        }
    }
    function computeMessageParams(type, params) {
        let result;
        const numberOfParams = type.numberOfParams;
        switch (numberOfParams) {
            case 0:
                result = undefined;
                break;
            case 1:
                result = computeSingleParam(type.parameterStructures, params[0]);
                break;
            default:
                result = [];
                for (let i = 0; i < params.length && i < numberOfParams; i++) {
                    result.push(undefinedToNull(params[i]));
                }
                if (params.length < numberOfParams) {
                    for (let i = params.length; i < numberOfParams; i++) {
                        result.push(null);
                    }
                }
                break;
        }
        return result;
    }
    const connection = {
        sendNotification: (type, ...args) => {
            throwIfClosedOrDisposed();
            let method;
            let messageParams;
            if (Is.string(type)) {
                method = type;
                const first = args[0];
                let paramStart = 0;
                let parameterStructures = messages_1.ParameterStructures.auto;
                if (messages_1.ParameterStructures.is(first)) {
                    paramStart = 1;
                    parameterStructures = first;
                }
                let paramEnd = args.length;
                const numberOfParams = paramEnd - paramStart;
                switch (numberOfParams) {
                    case 0:
                        messageParams = undefined;
                        break;
                    case 1:
                        messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                        break;
                    default:
                        if (parameterStructures === messages_1.ParameterStructures.byName) {
                            throw new Error(`Received ${numberOfParams} parameters for 'by Name' notification parameter structure.`);
                        }
                        messageParams = args.slice(paramStart, paramEnd).map(value => undefinedToNull(value));
                        break;
                }
            }
            else {
                const params = args;
                method = type.method;
                messageParams = computeMessageParams(type, params);
            }
            const notificationMessage = {
                jsonrpc: version,
                method: method,
                params: messageParams
            };
            traceSendingNotification(notificationMessage);
            return messageWriter.write(notificationMessage).catch((error) => {
                logger.error(`Sending notification failed.`);
                throw error;
            });
        },
        onNotification: (type, handler) => {
            throwIfClosedOrDisposed();
            let method;
            if (Is.func(type)) {
                starNotificationHandler = type;
            }
            else if (handler) {
                if (Is.string(type)) {
                    method = type;
                    notificationHandlers.set(type, { type: undefined, handler });
                }
                else {
                    method = type.method;
                    notificationHandlers.set(type.method, { type, handler });
                }
            }
            return {
                dispose: () => {
                    if (method !== undefined) {
                        notificationHandlers.delete(method);
                    }
                    else {
                        starNotificationHandler = undefined;
                    }
                }
            };
        },
        onProgress: (_type, token, handler) => {
            if (progressHandlers.has(token)) {
                throw new Error(`Progress handler for token ${token} already registered`);
            }
            progressHandlers.set(token, handler);
            return {
                dispose: () => {
                    progressHandlers.delete(token);
                }
            };
        },
        sendProgress: (_type, token, value) => {
            // This should not await but simple return to ensure that we don't have another
            // async scheduling. Otherwise one send could overtake another send.
            return connection.sendNotification(ProgressNotification.type, { token, value });
        },
        onUnhandledProgress: unhandledProgressEmitter.event,
        sendRequest: (type, ...args) => {
            throwIfClosedOrDisposed();
            throwIfNotListening();
            let method;
            let messageParams;
            let token = undefined;
            if (Is.string(type)) {
                method = type;
                const first = args[0];
                const last = args[args.length - 1];
                let paramStart = 0;
                let parameterStructures = messages_1.ParameterStructures.auto;
                if (messages_1.ParameterStructures.is(first)) {
                    paramStart = 1;
                    parameterStructures = first;
                }
                let paramEnd = args.length;
                if (cancellation_1.CancellationToken.is(last)) {
                    paramEnd = paramEnd - 1;
                    token = last;
                }
                const numberOfParams = paramEnd - paramStart;
                switch (numberOfParams) {
                    case 0:
                        messageParams = undefined;
                        break;
                    case 1:
                        messageParams = computeSingleParam(parameterStructures, args[paramStart]);
                        break;
                    default:
                        if (parameterStructures === messages_1.ParameterStructures.byName) {
                            throw new Error(`Received ${numberOfParams} parameters for 'by Name' request parameter structure.`);
                        }
                        messageParams = args.slice(paramStart, paramEnd).map(value => undefinedToNull(value));
                        break;
                }
            }
            else {
                const params = args;
                method = type.method;
                messageParams = computeMessageParams(type, params);
                const numberOfParams = type.numberOfParams;
                token = cancellation_1.CancellationToken.is(params[numberOfParams]) ? params[numberOfParams] : undefined;
            }
            const id = sequenceNumber++;
            let disposable;
            if (token) {
                disposable = token.onCancellationRequested(() => {
                    const p = cancellationStrategy.sender.sendCancellation(connection, id);
                    if (p === undefined) {
                        logger.log(`Received no promise from cancellation strategy when cancelling id ${id}`);
                        return Promise.resolve();
                    }
                    else {
                        return p.catch(() => {
                            logger.log(`Sending cancellation messages for id ${id} failed`);
                        });
                    }
                });
            }
            const requestMessage = {
                jsonrpc: version,
                id: id,
                method: method,
                params: messageParams
            };
            traceSendingRequest(requestMessage);
            if (typeof cancellationStrategy.sender.enableCancellation === 'function') {
                cancellationStrategy.sender.enableCancellation(requestMessage);
            }
            return new Promise(async (resolve, reject) => {
                const resolveWithCleanup = (r) => {
                    resolve(r);
                    cancellationStrategy.sender.cleanup(id);
                    disposable?.dispose();
                };
                const rejectWithCleanup = (r) => {
                    reject(r);
                    cancellationStrategy.sender.cleanup(id);
                    disposable?.dispose();
                };
                const responsePromise = { method: method, timerStart: Date.now(), resolve: resolveWithCleanup, reject: rejectWithCleanup };
                try {
                    responsePromises.set(id, responsePromise);
                    await messageWriter.write(requestMessage);
                }
                catch (error) {
                    // Writing the message failed. So we need to delete it from the response promises and
                    // reject it.
                    responsePromises.delete(id);
                    responsePromise.reject(new messages_1.ResponseError(messages_1.ErrorCodes.MessageWriteError, error.message ? error.message : 'Unknown reason'));
                    logger.error(`Sending request failed.`);
                    throw error;
                }
            });
        },
        onRequest: (type, handler) => {
            throwIfClosedOrDisposed();
            let method = null;
            if (StarRequestHandler.is(type)) {
                method = undefined;
                starRequestHandler = type;
            }
            else if (Is.string(type)) {
                method = null;
                if (handler !== undefined) {
                    method = type;
                    requestHandlers.set(type, { handler: handler, type: undefined });
                }
            }
            else {
                if (handler !== undefined) {
                    method = type.method;
                    requestHandlers.set(type.method, { type, handler });
                }
            }
            return {
                dispose: () => {
                    if (method === null) {
                        return;
                    }
                    if (method !== undefined) {
                        requestHandlers.delete(method);
                    }
                    else {
                        starRequestHandler = undefined;
                    }
                }
            };
        },
        hasPendingResponse: () => {
            return responsePromises.size > 0;
        },
        trace: async (_value, _tracer, sendNotificationOrTraceOptions) => {
            let _sendNotification = false;
            let _traceFormat = TraceFormat.Text;
            if (sendNotificationOrTraceOptions !== undefined) {
                if (Is.boolean(sendNotificationOrTraceOptions)) {
                    _sendNotification = sendNotificationOrTraceOptions;
                }
                else {
                    _sendNotification = sendNotificationOrTraceOptions.sendNotification || false;
                    _traceFormat = sendNotificationOrTraceOptions.traceFormat || TraceFormat.Text;
                }
            }
            trace = _value;
            traceFormat = _traceFormat;
            if (trace === Trace.Off) {
                tracer = undefined;
            }
            else {
                tracer = _tracer;
            }
            if (_sendNotification && !isClosed() && !isDisposed()) {
                await connection.sendNotification(SetTraceNotification.type, { value: Trace.toString(_value) });
            }
        },
        onError: errorEmitter.event,
        onClose: closeEmitter.event,
        onUnhandledNotification: unhandledNotificationEmitter.event,
        onDispose: disposeEmitter.event,
        end: () => {
            messageWriter.end();
        },
        dispose: () => {
            if (isDisposed()) {
                return;
            }
            state = ConnectionState.Disposed;
            disposeEmitter.fire(undefined);
            const error = new messages_1.ResponseError(messages_1.ErrorCodes.PendingResponseRejected, 'Pending response rejected since connection got disposed');
            for (const promise of responsePromises.values()) {
                promise.reject(error);
            }
            responsePromises = new Map();
            requestTokens = new Map();
            knownCanceledRequests = new Set();
            messageQueue = new linkedMap_1.LinkedMap();
            // Test for backwards compatibility
            if (Is.func(messageWriter.dispose)) {
                messageWriter.dispose();
            }
            if (Is.func(messageReader.dispose)) {
                messageReader.dispose();
            }
        },
        listen: () => {
            throwIfClosedOrDisposed();
            throwIfListening();
            state = ConnectionState.Listening;
            messageReader.listen(callback);
        },
        inspect: () => {
            // eslint-disable-next-line no-console
            (0, ral_1.default)().console.log('inspect');
        }
    };
    connection.onNotification(LogTraceNotification.type, (params) => {
        if (trace === Trace.Off || !tracer) {
            return;
        }
        const verbose = trace === Trace.Verbose || trace === Trace.Compact;
        tracer.log(params.message, verbose ? params.verbose : undefined);
    });
    connection.onNotification(ProgressNotification.type, (params) => {
        const handler = progressHandlers.get(params.token);
        if (handler) {
            handler(params.value);
        }
        else {
            unhandledProgressEmitter.fire(params);
        }
    });
    return connection;
}
exports.createMessageConnection = createMessageConnection;


/***/ },

/***/ 4019
(__unused_webpack_module, exports) {

var __webpack_unused_export__;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
__webpack_unused_export__ = ({ value: true });
exports.Disposable = void 0;
var Disposable;
(function (Disposable) {
    function create(func) {
        return {
            dispose: func
        };
    }
    Disposable.create = create;
})(Disposable || (exports.Disposable = Disposable = {}));


/***/ },

/***/ 2676
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
exports.Emitter = exports.Event = void 0;
const ral_1 = __webpack_require__(9590);
var Event;
(function (Event) {
    const _disposable = { dispose() { } };
    Event.None = function () { return _disposable; };
})(Event || (exports.Event = Event = {}));
class CallbackList {
    add(callback, context = null, bucket) {
        if (!this._callbacks) {
            this._callbacks = [];
            this._contexts = [];
        }
        this._callbacks.push(callback);
        this._contexts.push(context);
        if (Array.isArray(bucket)) {
            bucket.push({ dispose: () => this.remove(callback, context) });
        }
    }
    remove(callback, context = null) {
        if (!this._callbacks) {
            return;
        }
        let foundCallbackWithDifferentContext = false;
        for (let i = 0, len = this._callbacks.length; i < len; i++) {
            if (this._callbacks[i] === callback) {
                if (this._contexts[i] === context) {
                    // callback & context match => remove it
                    this._callbacks.splice(i, 1);
                    this._contexts.splice(i, 1);
                    return;
                }
                else {
                    foundCallbackWithDifferentContext = true;
                }
            }
        }
        if (foundCallbackWithDifferentContext) {
            throw new Error('When adding a listener with a context, you should remove it with the same context');
        }
    }
    invoke(...args) {
        if (!this._callbacks) {
            return [];
        }
        const ret = [], callbacks = this._callbacks.slice(0), contexts = this._contexts.slice(0);
        for (let i = 0, len = callbacks.length; i < len; i++) {
            try {
                ret.push(callbacks[i].apply(contexts[i], args));
            }
            catch (e) {
                // eslint-disable-next-line no-console
                (0, ral_1.default)().console.error(e);
            }
        }
        return ret;
    }
    isEmpty() {
        return !this._callbacks || this._callbacks.length === 0;
    }
    dispose() {
        this._callbacks = undefined;
        this._contexts = undefined;
    }
}
class Emitter {
    constructor(_options) {
        this._options = _options;
    }
    /**
     * For the public to allow to subscribe
     * to events from this Emitter
     */
    get event() {
        if (!this._event) {
            this._event = (listener, thisArgs, disposables) => {
                if (!this._callbacks) {
                    this._callbacks = new CallbackList();
                }
                if (this._options && this._options.onFirstListenerAdd && this._callbacks.isEmpty()) {
                    this._options.onFirstListenerAdd(this);
                }
                this._callbacks.add(listener, thisArgs);
                const result = {
                    dispose: () => {
                        if (!this._callbacks) {
                            // disposable is disposed after emitter is disposed.
                            return;
                        }
                        this._callbacks.remove(listener, thisArgs);
                        result.dispose = Emitter._noop;
                        if (this._options && this._options.onLastListenerRemove && this._callbacks.isEmpty()) {
                            this._options.onLastListenerRemove(this);
                        }
                    }
                };
                if (Array.isArray(disposables)) {
                    disposables.push(result);
                }
                return result;
            };
        }
        return this._event;
    }
    /**
     * To be kept private to fire an event to
     * subscribers
     */
    fire(event) {
        if (this._callbacks) {
            this._callbacks.invoke.call(this._callbacks, event);
        }
    }
    dispose() {
        if (this._callbacks) {
            this._callbacks.dispose();
            this._callbacks = undefined;
        }
    }
}
exports.Emitter = Emitter;
Emitter._noop = function () { };


/***/ },

/***/ 8585
(__unused_webpack_module, exports) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = __webpack_unused_export__ = exports.func = __webpack_unused_export__ = exports.number = exports.string = exports.boolean = void 0;
function boolean(value) {
    return value === true || value === false;
}
exports.boolean = boolean;
function string(value) {
    return typeof value === 'string' || value instanceof String;
}
exports.string = string;
function number(value) {
    return typeof value === 'number' || value instanceof Number;
}
exports.number = number;
function error(value) {
    return value instanceof Error;
}
__webpack_unused_export__ = error;
function func(value) {
    return typeof value === 'function';
}
exports.func = func;
function array(value) {
    return Array.isArray(value);
}
__webpack_unused_export__ = array;
function stringArray(value) {
    return array(value) && value.every(elem => string(elem));
}
__webpack_unused_export__ = stringArray;


/***/ },

/***/ 3352
(__unused_webpack_module, exports) {

var __webpack_unused_export__;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var _a;
__webpack_unused_export__ = ({ value: true });
exports.LRUCache = exports.LinkedMap = exports.Touch = void 0;
var Touch;
(function (Touch) {
    Touch.None = 0;
    Touch.First = 1;
    Touch.AsOld = Touch.First;
    Touch.Last = 2;
    Touch.AsNew = Touch.Last;
})(Touch || (exports.Touch = Touch = {}));
class LinkedMap {
    constructor() {
        this[_a] = 'LinkedMap';
        this._map = new Map();
        this._head = undefined;
        this._tail = undefined;
        this._size = 0;
        this._state = 0;
    }
    clear() {
        this._map.clear();
        this._head = undefined;
        this._tail = undefined;
        this._size = 0;
        this._state++;
    }
    isEmpty() {
        return !this._head && !this._tail;
    }
    get size() {
        return this._size;
    }
    get first() {
        return this._head?.value;
    }
    get last() {
        return this._tail?.value;
    }
    has(key) {
        return this._map.has(key);
    }
    get(key, touch = Touch.None) {
        const item = this._map.get(key);
        if (!item) {
            return undefined;
        }
        if (touch !== Touch.None) {
            this.touch(item, touch);
        }
        return item.value;
    }
    set(key, value, touch = Touch.None) {
        let item = this._map.get(key);
        if (item) {
            item.value = value;
            if (touch !== Touch.None) {
                this.touch(item, touch);
            }
        }
        else {
            item = { key, value, next: undefined, previous: undefined };
            switch (touch) {
                case Touch.None:
                    this.addItemLast(item);
                    break;
                case Touch.First:
                    this.addItemFirst(item);
                    break;
                case Touch.Last:
                    this.addItemLast(item);
                    break;
                default:
                    this.addItemLast(item);
                    break;
            }
            this._map.set(key, item);
            this._size++;
        }
        return this;
    }
    delete(key) {
        return !!this.remove(key);
    }
    remove(key) {
        const item = this._map.get(key);
        if (!item) {
            return undefined;
        }
        this._map.delete(key);
        this.removeItem(item);
        this._size--;
        return item.value;
    }
    shift() {
        if (!this._head && !this._tail) {
            return undefined;
        }
        if (!this._head || !this._tail) {
            throw new Error('Invalid list');
        }
        const item = this._head;
        this._map.delete(item.key);
        this.removeItem(item);
        this._size--;
        return item.value;
    }
    forEach(callbackfn, thisArg) {
        const state = this._state;
        let current = this._head;
        while (current) {
            if (thisArg) {
                callbackfn.bind(thisArg)(current.value, current.key, this);
            }
            else {
                callbackfn(current.value, current.key, this);
            }
            if (this._state !== state) {
                throw new Error(`LinkedMap got modified during iteration.`);
            }
            current = current.next;
        }
    }
    keys() {
        const state = this._state;
        let current = this._head;
        const iterator = {
            [Symbol.iterator]: () => {
                return iterator;
            },
            next: () => {
                if (this._state !== state) {
                    throw new Error(`LinkedMap got modified during iteration.`);
                }
                if (current) {
                    const result = { value: current.key, done: false };
                    current = current.next;
                    return result;
                }
                else {
                    return { value: undefined, done: true };
                }
            }
        };
        return iterator;
    }
    values() {
        const state = this._state;
        let current = this._head;
        const iterator = {
            [Symbol.iterator]: () => {
                return iterator;
            },
            next: () => {
                if (this._state !== state) {
                    throw new Error(`LinkedMap got modified during iteration.`);
                }
                if (current) {
                    const result = { value: current.value, done: false };
                    current = current.next;
                    return result;
                }
                else {
                    return { value: undefined, done: true };
                }
            }
        };
        return iterator;
    }
    entries() {
        const state = this._state;
        let current = this._head;
        const iterator = {
            [Symbol.iterator]: () => {
                return iterator;
            },
            next: () => {
                if (this._state !== state) {
                    throw new Error(`LinkedMap got modified during iteration.`);
                }
                if (current) {
                    const result = { value: [current.key, current.value], done: false };
                    current = current.next;
                    return result;
                }
                else {
                    return { value: undefined, done: true };
                }
            }
        };
        return iterator;
    }
    [(_a = Symbol.toStringTag, Symbol.iterator)]() {
        return this.entries();
    }
    trimOld(newSize) {
        if (newSize >= this.size) {
            return;
        }
        if (newSize === 0) {
            this.clear();
            return;
        }
        let current = this._head;
        let currentSize = this.size;
        while (current && currentSize > newSize) {
            this._map.delete(current.key);
            current = current.next;
            currentSize--;
        }
        this._head = current;
        this._size = currentSize;
        if (current) {
            current.previous = undefined;
        }
        this._state++;
    }
    addItemFirst(item) {
        // First time Insert
        if (!this._head && !this._tail) {
            this._tail = item;
        }
        else if (!this._head) {
            throw new Error('Invalid list');
        }
        else {
            item.next = this._head;
            this._head.previous = item;
        }
        this._head = item;
        this._state++;
    }
    addItemLast(item) {
        // First time Insert
        if (!this._head && !this._tail) {
            this._head = item;
        }
        else if (!this._tail) {
            throw new Error('Invalid list');
        }
        else {
            item.previous = this._tail;
            this._tail.next = item;
        }
        this._tail = item;
        this._state++;
    }
    removeItem(item) {
        if (item === this._head && item === this._tail) {
            this._head = undefined;
            this._tail = undefined;
        }
        else if (item === this._head) {
            // This can only happened if size === 1 which is handle
            // by the case above.
            if (!item.next) {
                throw new Error('Invalid list');
            }
            item.next.previous = undefined;
            this._head = item.next;
        }
        else if (item === this._tail) {
            // This can only happened if size === 1 which is handle
            // by the case above.
            if (!item.previous) {
                throw new Error('Invalid list');
            }
            item.previous.next = undefined;
            this._tail = item.previous;
        }
        else {
            const next = item.next;
            const previous = item.previous;
            if (!next || !previous) {
                throw new Error('Invalid list');
            }
            next.previous = previous;
            previous.next = next;
        }
        item.next = undefined;
        item.previous = undefined;
        this._state++;
    }
    touch(item, touch) {
        if (!this._head || !this._tail) {
            throw new Error('Invalid list');
        }
        if ((touch !== Touch.First && touch !== Touch.Last)) {
            return;
        }
        if (touch === Touch.First) {
            if (item === this._head) {
                return;
            }
            const next = item.next;
            const previous = item.previous;
            // Unlink the item
            if (item === this._tail) {
                // previous must be defined since item was not head but is tail
                // So there are more than on item in the map
                previous.next = undefined;
                this._tail = previous;
            }
            else {
                // Both next and previous are not undefined since item was neither head nor tail.
                next.previous = previous;
                previous.next = next;
            }
            // Insert the node at head
            item.previous = undefined;
            item.next = this._head;
            this._head.previous = item;
            this._head = item;
            this._state++;
        }
        else if (touch === Touch.Last) {
            if (item === this._tail) {
                return;
            }
            const next = item.next;
            const previous = item.previous;
            // Unlink the item.
            if (item === this._head) {
                // next must be defined since item was not tail but is head
                // So there are more than on item in the map
                next.previous = undefined;
                this._head = next;
            }
            else {
                // Both next and previous are not undefined since item was neither head nor tail.
                next.previous = previous;
                previous.next = next;
            }
            item.next = undefined;
            item.previous = this._tail;
            this._tail.next = item;
            this._tail = item;
            this._state++;
        }
    }
    toJSON() {
        const data = [];
        this.forEach((value, key) => {
            data.push([key, value]);
        });
        return data;
    }
    fromJSON(data) {
        this.clear();
        for (const [key, value] of data) {
            this.set(key, value);
        }
    }
}
exports.LinkedMap = LinkedMap;
class LRUCache extends LinkedMap {
    constructor(limit, ratio = 1) {
        super();
        this._limit = limit;
        this._ratio = Math.min(Math.max(0, ratio), 1);
    }
    get limit() {
        return this._limit;
    }
    set limit(limit) {
        this._limit = limit;
        this.checkTrim();
    }
    get ratio() {
        return this._ratio;
    }
    set ratio(ratio) {
        this._ratio = Math.min(Math.max(0, ratio), 1);
        this.checkTrim();
    }
    get(key, touch = Touch.AsNew) {
        return super.get(key, touch);
    }
    peek(key) {
        return super.get(key, Touch.None);
    }
    set(key, value) {
        super.set(key, value, Touch.Last);
        this.checkTrim();
        return this;
    }
    checkTrim() {
        if (this.size > this._limit) {
            this.trimOld(Math.round(this._limit * this._ratio));
        }
    }
}
exports.LRUCache = LRUCache;


/***/ },

/***/ 9244
(__unused_webpack_module, exports) {

var __webpack_unused_export__;

/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
__webpack_unused_export__ = ({ value: true });
exports.AbstractMessageBuffer = void 0;
const CR = 13;
const LF = 10;
const CRLF = '\r\n';
class AbstractMessageBuffer {
    constructor(encoding = 'utf-8') {
        this._encoding = encoding;
        this._chunks = [];
        this._totalLength = 0;
    }
    get encoding() {
        return this._encoding;
    }
    append(chunk) {
        const toAppend = typeof chunk === 'string' ? this.fromString(chunk, this._encoding) : chunk;
        this._chunks.push(toAppend);
        this._totalLength += toAppend.byteLength;
    }
    tryReadHeaders(lowerCaseKeys = false) {
        if (this._chunks.length === 0) {
            return undefined;
        }
        let state = 0;
        let chunkIndex = 0;
        let offset = 0;
        let chunkBytesRead = 0;
        row: while (chunkIndex < this._chunks.length) {
            const chunk = this._chunks[chunkIndex];
            offset = 0;
            column: while (offset < chunk.length) {
                const value = chunk[offset];
                switch (value) {
                    case CR:
                        switch (state) {
                            case 0:
                                state = 1;
                                break;
                            case 2:
                                state = 3;
                                break;
                            default:
                                state = 0;
                        }
                        break;
                    case LF:
                        switch (state) {
                            case 1:
                                state = 2;
                                break;
                            case 3:
                                state = 4;
                                offset++;
                                break row;
                            default:
                                state = 0;
                        }
                        break;
                    default:
                        state = 0;
                }
                offset++;
            }
            chunkBytesRead += chunk.byteLength;
            chunkIndex++;
        }
        if (state !== 4) {
            return undefined;
        }
        // The buffer contains the two CRLF at the end. So we will
        // have two empty lines after the split at the end as well.
        const buffer = this._read(chunkBytesRead + offset);
        const result = new Map();
        const headers = this.toString(buffer, 'ascii').split(CRLF);
        if (headers.length < 2) {
            return result;
        }
        for (let i = 0; i < headers.length - 2; i++) {
            const header = headers[i];
            const index = header.indexOf(':');
            if (index === -1) {
                throw new Error(`Message header must separate key and value using ':'\n${header}`);
            }
            const key = header.substr(0, index);
            const value = header.substr(index + 1).trim();
            result.set(lowerCaseKeys ? key.toLowerCase() : key, value);
        }
        return result;
    }
    tryReadBody(length) {
        if (this._totalLength < length) {
            return undefined;
        }
        return this._read(length);
    }
    get numberOfBytes() {
        return this._totalLength;
    }
    _read(byteCount) {
        if (byteCount === 0) {
            return this.emptyBuffer();
        }
        if (byteCount > this._totalLength) {
            throw new Error(`Cannot read so many bytes!`);
        }
        if (this._chunks[0].byteLength === byteCount) {
            // super fast path, precisely first chunk must be returned
            const chunk = this._chunks[0];
            this._chunks.shift();
            this._totalLength -= byteCount;
            return this.asNative(chunk);
        }
        if (this._chunks[0].byteLength > byteCount) {
            // fast path, the reading is entirely within the first chunk
            const chunk = this._chunks[0];
            const result = this.asNative(chunk, byteCount);
            this._chunks[0] = chunk.slice(byteCount);
            this._totalLength -= byteCount;
            return result;
        }
        const result = this.allocNative(byteCount);
        let resultOffset = 0;
        let chunkIndex = 0;
        while (byteCount > 0) {
            const chunk = this._chunks[chunkIndex];
            if (chunk.byteLength > byteCount) {
                // this chunk will survive
                const chunkPart = chunk.slice(0, byteCount);
                result.set(chunkPart, resultOffset);
                resultOffset += byteCount;
                this._chunks[chunkIndex] = chunk.slice(byteCount);
                this._totalLength -= byteCount;
                byteCount -= byteCount;
            }
            else {
                // this chunk will be entirely read
                result.set(chunk, resultOffset);
                resultOffset += chunk.byteLength;
                this._chunks.shift();
                this._totalLength -= chunk.byteLength;
                byteCount -= chunk.byteLength;
            }
        }
        return result;
    }
}
exports.AbstractMessageBuffer = AbstractMessageBuffer;


/***/ },

/***/ 9085
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
exports.ReadableStreamMessageReader = exports.AbstractMessageReader = exports.MessageReader = void 0;
const ral_1 = __webpack_require__(9590);
const Is = __webpack_require__(8585);
const events_1 = __webpack_require__(2676);
const semaphore_1 = __webpack_require__(4323);
var MessageReader;
(function (MessageReader) {
    function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.listen) && Is.func(candidate.dispose) &&
            Is.func(candidate.onError) && Is.func(candidate.onClose) && Is.func(candidate.onPartialMessage);
    }
    MessageReader.is = is;
})(MessageReader || (exports.MessageReader = MessageReader = {}));
class AbstractMessageReader {
    constructor() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
        this.partialMessageEmitter = new events_1.Emitter();
    }
    dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
    }
    get onError() {
        return this.errorEmitter.event;
    }
    fireError(error) {
        this.errorEmitter.fire(this.asError(error));
    }
    get onClose() {
        return this.closeEmitter.event;
    }
    fireClose() {
        this.closeEmitter.fire(undefined);
    }
    get onPartialMessage() {
        return this.partialMessageEmitter.event;
    }
    firePartialMessage(info) {
        this.partialMessageEmitter.fire(info);
    }
    asError(error) {
        if (error instanceof Error) {
            return error;
        }
        else {
            return new Error(`Reader received error. Reason: ${Is.string(error.message) ? error.message : 'unknown'}`);
        }
    }
}
exports.AbstractMessageReader = AbstractMessageReader;
var ResolvedMessageReaderOptions;
(function (ResolvedMessageReaderOptions) {
    function fromOptions(options) {
        let charset;
        let result;
        let contentDecoder;
        const contentDecoders = new Map();
        let contentTypeDecoder;
        const contentTypeDecoders = new Map();
        if (options === undefined || typeof options === 'string') {
            charset = options ?? 'utf-8';
        }
        else {
            charset = options.charset ?? 'utf-8';
            if (options.contentDecoder !== undefined) {
                contentDecoder = options.contentDecoder;
                contentDecoders.set(contentDecoder.name, contentDecoder);
            }
            if (options.contentDecoders !== undefined) {
                for (const decoder of options.contentDecoders) {
                    contentDecoders.set(decoder.name, decoder);
                }
            }
            if (options.contentTypeDecoder !== undefined) {
                contentTypeDecoder = options.contentTypeDecoder;
                contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
            }
            if (options.contentTypeDecoders !== undefined) {
                for (const decoder of options.contentTypeDecoders) {
                    contentTypeDecoders.set(decoder.name, decoder);
                }
            }
        }
        if (contentTypeDecoder === undefined) {
            contentTypeDecoder = (0, ral_1.default)().applicationJson.decoder;
            contentTypeDecoders.set(contentTypeDecoder.name, contentTypeDecoder);
        }
        return { charset, contentDecoder, contentDecoders, contentTypeDecoder, contentTypeDecoders };
    }
    ResolvedMessageReaderOptions.fromOptions = fromOptions;
})(ResolvedMessageReaderOptions || (ResolvedMessageReaderOptions = {}));
class ReadableStreamMessageReader extends AbstractMessageReader {
    constructor(readable, options) {
        super();
        this.readable = readable;
        this.options = ResolvedMessageReaderOptions.fromOptions(options);
        this.buffer = (0, ral_1.default)().messageBuffer.create(this.options.charset);
        this._partialMessageTimeout = 10000;
        this.nextMessageLength = -1;
        this.messageToken = 0;
        this.readSemaphore = new semaphore_1.Semaphore(1);
    }
    set partialMessageTimeout(timeout) {
        this._partialMessageTimeout = timeout;
    }
    get partialMessageTimeout() {
        return this._partialMessageTimeout;
    }
    listen(callback) {
        this.nextMessageLength = -1;
        this.messageToken = 0;
        this.partialMessageTimer = undefined;
        this.callback = callback;
        const result = this.readable.onData((data) => {
            this.onData(data);
        });
        this.readable.onError((error) => this.fireError(error));
        this.readable.onClose(() => this.fireClose());
        return result;
    }
    onData(data) {
        try {
            this.buffer.append(data);
            while (true) {
                if (this.nextMessageLength === -1) {
                    const headers = this.buffer.tryReadHeaders(true);
                    if (!headers) {
                        return;
                    }
                    const contentLength = headers.get('content-length');
                    if (!contentLength) {
                        this.fireError(new Error(`Header must provide a Content-Length property.\n${JSON.stringify(Object.fromEntries(headers))}`));
                        return;
                    }
                    const length = parseInt(contentLength);
                    if (isNaN(length)) {
                        this.fireError(new Error(`Content-Length value must be a number. Got ${contentLength}`));
                        return;
                    }
                    this.nextMessageLength = length;
                }
                const body = this.buffer.tryReadBody(this.nextMessageLength);
                if (body === undefined) {
                    /** We haven't received the full message yet. */
                    this.setPartialMessageTimer();
                    return;
                }
                this.clearPartialMessageTimer();
                this.nextMessageLength = -1;
                // Make sure that we convert one received message after the
                // other. Otherwise it could happen that a decoding of a second
                // smaller message finished before the decoding of a first larger
                // message and then we would deliver the second message first.
                this.readSemaphore.lock(async () => {
                    const bytes = this.options.contentDecoder !== undefined
                        ? await this.options.contentDecoder.decode(body)
                        : body;
                    const message = await this.options.contentTypeDecoder.decode(bytes, this.options);
                    this.callback(message);
                }).catch((error) => {
                    this.fireError(error);
                });
            }
        }
        catch (error) {
            this.fireError(error);
        }
    }
    clearPartialMessageTimer() {
        if (this.partialMessageTimer) {
            this.partialMessageTimer.dispose();
            this.partialMessageTimer = undefined;
        }
    }
    setPartialMessageTimer() {
        this.clearPartialMessageTimer();
        if (this._partialMessageTimeout <= 0) {
            return;
        }
        this.partialMessageTimer = (0, ral_1.default)().timer.setTimeout((token, timeout) => {
            this.partialMessageTimer = undefined;
            if (token === this.messageToken) {
                this.firePartialMessage({ messageToken: token, waitingTime: timeout });
                this.setPartialMessageTimer();
            }
        }, this._partialMessageTimeout, this.messageToken, this._partialMessageTimeout);
    }
}
exports.ReadableStreamMessageReader = ReadableStreamMessageReader;


/***/ },

/***/ 3193
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
exports.WriteableStreamMessageWriter = exports.AbstractMessageWriter = exports.MessageWriter = void 0;
const ral_1 = __webpack_require__(9590);
const Is = __webpack_require__(8585);
const semaphore_1 = __webpack_require__(4323);
const events_1 = __webpack_require__(2676);
const ContentLength = 'Content-Length: ';
const CRLF = '\r\n';
var MessageWriter;
(function (MessageWriter) {
    function is(value) {
        let candidate = value;
        return candidate && Is.func(candidate.dispose) && Is.func(candidate.onClose) &&
            Is.func(candidate.onError) && Is.func(candidate.write);
    }
    MessageWriter.is = is;
})(MessageWriter || (exports.MessageWriter = MessageWriter = {}));
class AbstractMessageWriter {
    constructor() {
        this.errorEmitter = new events_1.Emitter();
        this.closeEmitter = new events_1.Emitter();
    }
    dispose() {
        this.errorEmitter.dispose();
        this.closeEmitter.dispose();
    }
    get onError() {
        return this.errorEmitter.event;
    }
    fireError(error, message, count) {
        this.errorEmitter.fire([this.asError(error), message, count]);
    }
    get onClose() {
        return this.closeEmitter.event;
    }
    fireClose() {
        this.closeEmitter.fire(undefined);
    }
    asError(error) {
        if (error instanceof Error) {
            return error;
        }
        else {
            return new Error(`Writer received error. Reason: ${Is.string(error.message) ? error.message : 'unknown'}`);
        }
    }
}
exports.AbstractMessageWriter = AbstractMessageWriter;
var ResolvedMessageWriterOptions;
(function (ResolvedMessageWriterOptions) {
    function fromOptions(options) {
        if (options === undefined || typeof options === 'string') {
            return { charset: options ?? 'utf-8', contentTypeEncoder: (0, ral_1.default)().applicationJson.encoder };
        }
        else {
            return { charset: options.charset ?? 'utf-8', contentEncoder: options.contentEncoder, contentTypeEncoder: options.contentTypeEncoder ?? (0, ral_1.default)().applicationJson.encoder };
        }
    }
    ResolvedMessageWriterOptions.fromOptions = fromOptions;
})(ResolvedMessageWriterOptions || (ResolvedMessageWriterOptions = {}));
class WriteableStreamMessageWriter extends AbstractMessageWriter {
    constructor(writable, options) {
        super();
        this.writable = writable;
        this.options = ResolvedMessageWriterOptions.fromOptions(options);
        this.errorCount = 0;
        this.writeSemaphore = new semaphore_1.Semaphore(1);
        this.writable.onError((error) => this.fireError(error));
        this.writable.onClose(() => this.fireClose());
    }
    async write(msg) {
        return this.writeSemaphore.lock(async () => {
            const payload = this.options.contentTypeEncoder.encode(msg, this.options).then((buffer) => {
                if (this.options.contentEncoder !== undefined) {
                    return this.options.contentEncoder.encode(buffer);
                }
                else {
                    return buffer;
                }
            });
            return payload.then((buffer) => {
                const headers = [];
                headers.push(ContentLength, buffer.byteLength.toString(), CRLF);
                headers.push(CRLF);
                return this.doWrite(msg, headers, buffer);
            }, (error) => {
                this.fireError(error);
                throw error;
            });
        });
    }
    async doWrite(msg, headers, data) {
        try {
            await this.writable.write(headers.join(''), 'ascii');
            return this.writable.write(data);
        }
        catch (error) {
            this.handleError(error, msg);
            return Promise.reject(error);
        }
    }
    handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
    }
    end() {
        this.writable.end();
    }
}
exports.WriteableStreamMessageWriter = WriteableStreamMessageWriter;


/***/ },

/***/ 6177
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
exports.Message = exports.NotificationType9 = exports.NotificationType8 = exports.NotificationType7 = exports.NotificationType6 = exports.NotificationType5 = exports.NotificationType4 = exports.NotificationType3 = exports.NotificationType2 = exports.NotificationType1 = exports.NotificationType0 = exports.NotificationType = exports.RequestType9 = exports.RequestType8 = exports.RequestType7 = exports.RequestType6 = exports.RequestType5 = exports.RequestType4 = exports.RequestType3 = exports.RequestType2 = exports.RequestType1 = exports.RequestType = exports.RequestType0 = __webpack_unused_export__ = exports.ParameterStructures = exports.ResponseError = exports.ErrorCodes = void 0;
const is = __webpack_require__(8585);
/**
 * Predefined error codes.
 */
var ErrorCodes;
(function (ErrorCodes) {
    // Defined by JSON RPC
    ErrorCodes.ParseError = -32700;
    ErrorCodes.InvalidRequest = -32600;
    ErrorCodes.MethodNotFound = -32601;
    ErrorCodes.InvalidParams = -32602;
    ErrorCodes.InternalError = -32603;
    /**
     * This is the start range of JSON RPC reserved error codes.
     * It doesn't denote a real error code. No application error codes should
     * be defined between the start and end range. For backwards
     * compatibility the `ServerNotInitialized` and the `UnknownErrorCode`
     * are left in the range.
     *
     * @since 3.16.0
    */
    ErrorCodes.jsonrpcReservedErrorRangeStart = -32099;
    /** @deprecated use  jsonrpcReservedErrorRangeStart */
    ErrorCodes.serverErrorStart = -32099;
    /**
     * An error occurred when write a message to the transport layer.
     */
    ErrorCodes.MessageWriteError = -32099;
    /**
     * An error occurred when reading a message from the transport layer.
     */
    ErrorCodes.MessageReadError = -32098;
    /**
     * The connection got disposed or lost and all pending responses got
     * rejected.
     */
    ErrorCodes.PendingResponseRejected = -32097;
    /**
     * The connection is inactive and a use of it failed.
     */
    ErrorCodes.ConnectionInactive = -32096;
    /**
     * Error code indicating that a server received a notification or
     * request before the server has received the `initialize` request.
     */
    ErrorCodes.ServerNotInitialized = -32002;
    ErrorCodes.UnknownErrorCode = -32001;
    /**
     * This is the end range of JSON RPC reserved error codes.
     * It doesn't denote a real error code.
     *
     * @since 3.16.0
    */
    ErrorCodes.jsonrpcReservedErrorRangeEnd = -32000;
    /** @deprecated use  jsonrpcReservedErrorRangeEnd */
    ErrorCodes.serverErrorEnd = -32000;
})(ErrorCodes || (exports.ErrorCodes = ErrorCodes = {}));
/**
 * An error object return in a response in case a request
 * has failed.
 */
class ResponseError extends Error {
    constructor(code, message, data) {
        super(message);
        this.code = is.number(code) ? code : ErrorCodes.UnknownErrorCode;
        this.data = data;
        Object.setPrototypeOf(this, ResponseError.prototype);
    }
    toJson() {
        const result = {
            code: this.code,
            message: this.message
        };
        if (this.data !== undefined) {
            result.data = this.data;
        }
        return result;
    }
}
exports.ResponseError = ResponseError;
class ParameterStructures {
    constructor(kind) {
        this.kind = kind;
    }
    static is(value) {
        return value === ParameterStructures.auto || value === ParameterStructures.byName || value === ParameterStructures.byPosition;
    }
    toString() {
        return this.kind;
    }
}
exports.ParameterStructures = ParameterStructures;
/**
 * The parameter structure is automatically inferred on the number of parameters
 * and the parameter type in case of a single param.
 */
ParameterStructures.auto = new ParameterStructures('auto');
/**
 * Forces `byPosition` parameter structure. This is useful if you have a single
 * parameter which has a literal type.
 */
ParameterStructures.byPosition = new ParameterStructures('byPosition');
/**
 * Forces `byName` parameter structure. This is only useful when having a single
 * parameter. The library will report errors if used with a different number of
 * parameters.
 */
ParameterStructures.byName = new ParameterStructures('byName');
/**
 * An abstract implementation of a MessageType.
 */
class AbstractMessageSignature {
    constructor(method, numberOfParams) {
        this.method = method;
        this.numberOfParams = numberOfParams;
    }
    get parameterStructures() {
        return ParameterStructures.auto;
    }
}
__webpack_unused_export__ = AbstractMessageSignature;
/**
 * Classes to type request response pairs
 */
class RequestType0 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 0);
    }
}
exports.RequestType0 = RequestType0;
class RequestType extends AbstractMessageSignature {
    constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
    }
    get parameterStructures() {
        return this._parameterStructures;
    }
}
exports.RequestType = RequestType;
class RequestType1 extends AbstractMessageSignature {
    constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
    }
    get parameterStructures() {
        return this._parameterStructures;
    }
}
exports.RequestType1 = RequestType1;
class RequestType2 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 2);
    }
}
exports.RequestType2 = RequestType2;
class RequestType3 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 3);
    }
}
exports.RequestType3 = RequestType3;
class RequestType4 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 4);
    }
}
exports.RequestType4 = RequestType4;
class RequestType5 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 5);
    }
}
exports.RequestType5 = RequestType5;
class RequestType6 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 6);
    }
}
exports.RequestType6 = RequestType6;
class RequestType7 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 7);
    }
}
exports.RequestType7 = RequestType7;
class RequestType8 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 8);
    }
}
exports.RequestType8 = RequestType8;
class RequestType9 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 9);
    }
}
exports.RequestType9 = RequestType9;
class NotificationType extends AbstractMessageSignature {
    constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
    }
    get parameterStructures() {
        return this._parameterStructures;
    }
}
exports.NotificationType = NotificationType;
class NotificationType0 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 0);
    }
}
exports.NotificationType0 = NotificationType0;
class NotificationType1 extends AbstractMessageSignature {
    constructor(method, _parameterStructures = ParameterStructures.auto) {
        super(method, 1);
        this._parameterStructures = _parameterStructures;
    }
    get parameterStructures() {
        return this._parameterStructures;
    }
}
exports.NotificationType1 = NotificationType1;
class NotificationType2 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 2);
    }
}
exports.NotificationType2 = NotificationType2;
class NotificationType3 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 3);
    }
}
exports.NotificationType3 = NotificationType3;
class NotificationType4 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 4);
    }
}
exports.NotificationType4 = NotificationType4;
class NotificationType5 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 5);
    }
}
exports.NotificationType5 = NotificationType5;
class NotificationType6 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 6);
    }
}
exports.NotificationType6 = NotificationType6;
class NotificationType7 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 7);
    }
}
exports.NotificationType7 = NotificationType7;
class NotificationType8 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 8);
    }
}
exports.NotificationType8 = NotificationType8;
class NotificationType9 extends AbstractMessageSignature {
    constructor(method) {
        super(method, 9);
    }
}
exports.NotificationType9 = NotificationType9;
var Message;
(function (Message) {
    /**
     * Tests if the given message is a request message
     */
    function isRequest(message) {
        const candidate = message;
        return candidate && is.string(candidate.method) && (is.string(candidate.id) || is.number(candidate.id));
    }
    Message.isRequest = isRequest;
    /**
     * Tests if the given message is a notification message
     */
    function isNotification(message) {
        const candidate = message;
        return candidate && is.string(candidate.method) && message.id === void 0;
    }
    Message.isNotification = isNotification;
    /**
     * Tests if the given message is a response message
     */
    function isResponse(message) {
        const candidate = message;
        return candidate && (candidate.result !== void 0 || !!candidate.error) && (is.string(candidate.id) || is.number(candidate.id) || candidate.id === null);
    }
    Message.isResponse = isResponse;
})(Message || (exports.Message = Message = {}));


/***/ },

/***/ 9590
(__unused_webpack_module, exports) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
let _ral;
function RAL() {
    if (_ral === undefined) {
        throw new Error(`No runtime abstraction layer installed`);
    }
    return _ral;
}
(function (RAL) {
    function install(ral) {
        if (ral === undefined) {
            throw new Error(`No runtime abstraction layer provided`);
        }
        _ral = ral;
    }
    RAL.install = install;
})(RAL || (RAL = {}));
exports["default"] = RAL;


/***/ },

/***/ 4323
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
exports.Semaphore = void 0;
const ral_1 = __webpack_require__(9590);
class Semaphore {
    constructor(capacity = 1) {
        if (capacity <= 0) {
            throw new Error('Capacity must be greater than 0');
        }
        this._capacity = capacity;
        this._active = 0;
        this._waiting = [];
    }
    lock(thunk) {
        return new Promise((resolve, reject) => {
            this._waiting.push({ thunk, resolve, reject });
            this.runNext();
        });
    }
    get active() {
        return this._active;
    }
    runNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
            return;
        }
        (0, ral_1.default)().timer.setImmediate(() => this.doRunNext());
    }
    doRunNext() {
        if (this._waiting.length === 0 || this._active === this._capacity) {
            return;
        }
        const next = this._waiting.shift();
        this._active++;
        if (this._active > this._capacity) {
            throw new Error(`To many thunks active`);
        }
        try {
            const result = next.thunk();
            if (result instanceof Promise) {
                result.then((value) => {
                    this._active--;
                    next.resolve(value);
                    this.runNext();
                }, (err) => {
                    this._active--;
                    next.reject(err);
                    this.runNext();
                });
            }
            else {
                this._active--;
                next.resolve(result);
                this.runNext();
            }
        }
        catch (err) {
            this._active--;
            next.reject(err);
            this.runNext();
        }
    }
}
exports.Semaphore = Semaphore;


/***/ },

/***/ 4996
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
exports.SharedArrayReceiverStrategy = exports.SharedArraySenderStrategy = void 0;
const cancellation_1 = __webpack_require__(9850);
var CancellationState;
(function (CancellationState) {
    CancellationState.Continue = 0;
    CancellationState.Cancelled = 1;
})(CancellationState || (CancellationState = {}));
class SharedArraySenderStrategy {
    constructor() {
        this.buffers = new Map();
    }
    enableCancellation(request) {
        if (request.id === null) {
            return;
        }
        const buffer = new SharedArrayBuffer(4);
        const data = new Int32Array(buffer, 0, 1);
        data[0] = CancellationState.Continue;
        this.buffers.set(request.id, buffer);
        request.$cancellationData = buffer;
    }
    async sendCancellation(_conn, id) {
        const buffer = this.buffers.get(id);
        if (buffer === undefined) {
            return;
        }
        const data = new Int32Array(buffer, 0, 1);
        Atomics.store(data, 0, CancellationState.Cancelled);
    }
    cleanup(id) {
        this.buffers.delete(id);
    }
    dispose() {
        this.buffers.clear();
    }
}
exports.SharedArraySenderStrategy = SharedArraySenderStrategy;
class SharedArrayBufferCancellationToken {
    constructor(buffer) {
        this.data = new Int32Array(buffer, 0, 1);
    }
    get isCancellationRequested() {
        return Atomics.load(this.data, 0) === CancellationState.Cancelled;
    }
    get onCancellationRequested() {
        throw new Error(`Cancellation over SharedArrayBuffer doesn't support cancellation events`);
    }
}
class SharedArrayBufferCancellationTokenSource {
    constructor(buffer) {
        this.token = new SharedArrayBufferCancellationToken(buffer);
    }
    cancel() {
    }
    dispose() {
    }
}
class SharedArrayReceiverStrategy {
    constructor() {
        this.kind = 'request';
    }
    createCancellationTokenSource(request) {
        const buffer = request.$cancellationData;
        if (buffer === undefined) {
            return new cancellation_1.CancellationTokenSource();
        }
        return new SharedArrayBufferCancellationTokenSource(buffer);
    }
}
exports.SharedArrayReceiverStrategy = SharedArrayReceiverStrategy;


/***/ },

/***/ 7123
(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createMessageConnection = exports.createServerSocketTransport = exports.createClientSocketTransport = exports.createServerPipeTransport = exports.createClientPipeTransport = exports.generateRandomPipeName = exports.StreamMessageWriter = exports.StreamMessageReader = exports.SocketMessageWriter = exports.SocketMessageReader = exports.PortMessageWriter = exports.PortMessageReader = exports.IPCMessageWriter = exports.IPCMessageReader = void 0;
/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ----------------------------------------------------------------------------------------- */
const ril_1 = __webpack_require__(9571);
// Install the node runtime abstract.
ril_1.default.install();
const path = __webpack_require__(6928);
const os = __webpack_require__(857);
const crypto_1 = __webpack_require__(6982);
const net_1 = __webpack_require__(9278);
const api_1 = __webpack_require__(3281);
__exportStar(__webpack_require__(3281), exports);
class IPCMessageReader extends api_1.AbstractMessageReader {
    constructor(process) {
        super();
        this.process = process;
        let eventEmitter = this.process;
        eventEmitter.on('error', (error) => this.fireError(error));
        eventEmitter.on('close', () => this.fireClose());
    }
    listen(callback) {
        this.process.on('message', callback);
        return api_1.Disposable.create(() => this.process.off('message', callback));
    }
}
exports.IPCMessageReader = IPCMessageReader;
class IPCMessageWriter extends api_1.AbstractMessageWriter {
    constructor(process) {
        super();
        this.process = process;
        this.errorCount = 0;
        const eventEmitter = this.process;
        eventEmitter.on('error', (error) => this.fireError(error));
        eventEmitter.on('close', () => this.fireClose);
    }
    write(msg) {
        try {
            if (typeof this.process.send === 'function') {
                this.process.send(msg, undefined, undefined, (error) => {
                    if (error) {
                        this.errorCount++;
                        this.handleError(error, msg);
                    }
                    else {
                        this.errorCount = 0;
                    }
                });
            }
            return Promise.resolve();
        }
        catch (error) {
            this.handleError(error, msg);
            return Promise.reject(error);
        }
    }
    handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
    }
    end() {
    }
}
exports.IPCMessageWriter = IPCMessageWriter;
class PortMessageReader extends api_1.AbstractMessageReader {
    constructor(port) {
        super();
        this.onData = new api_1.Emitter;
        port.on('close', () => this.fireClose);
        port.on('error', (error) => this.fireError(error));
        port.on('message', (message) => {
            this.onData.fire(message);
        });
    }
    listen(callback) {
        return this.onData.event(callback);
    }
}
exports.PortMessageReader = PortMessageReader;
class PortMessageWriter extends api_1.AbstractMessageWriter {
    constructor(port) {
        super();
        this.port = port;
        this.errorCount = 0;
        port.on('close', () => this.fireClose());
        port.on('error', (error) => this.fireError(error));
    }
    write(msg) {
        try {
            this.port.postMessage(msg);
            return Promise.resolve();
        }
        catch (error) {
            this.handleError(error, msg);
            return Promise.reject(error);
        }
    }
    handleError(error, msg) {
        this.errorCount++;
        this.fireError(error, msg, this.errorCount);
    }
    end() {
    }
}
exports.PortMessageWriter = PortMessageWriter;
class SocketMessageReader extends api_1.ReadableStreamMessageReader {
    constructor(socket, encoding = 'utf-8') {
        super((0, ril_1.default)().stream.asReadableStream(socket), encoding);
    }
}
exports.SocketMessageReader = SocketMessageReader;
class SocketMessageWriter extends api_1.WriteableStreamMessageWriter {
    constructor(socket, options) {
        super((0, ril_1.default)().stream.asWritableStream(socket), options);
        this.socket = socket;
    }
    dispose() {
        super.dispose();
        this.socket.destroy();
    }
}
exports.SocketMessageWriter = SocketMessageWriter;
class StreamMessageReader extends api_1.ReadableStreamMessageReader {
    constructor(readable, encoding) {
        super((0, ril_1.default)().stream.asReadableStream(readable), encoding);
    }
}
exports.StreamMessageReader = StreamMessageReader;
class StreamMessageWriter extends api_1.WriteableStreamMessageWriter {
    constructor(writable, options) {
        super((0, ril_1.default)().stream.asWritableStream(writable), options);
    }
}
exports.StreamMessageWriter = StreamMessageWriter;
const XDG_RUNTIME_DIR = process.env['XDG_RUNTIME_DIR'];
const safeIpcPathLengths = new Map([
    ['linux', 107],
    ['darwin', 103]
]);
function generateRandomPipeName() {
    const randomSuffix = (0, crypto_1.randomBytes)(21).toString('hex');
    if (process.platform === 'win32') {
        return `\\\\.\\pipe\\vscode-jsonrpc-${randomSuffix}-sock`;
    }
    let result;
    if (XDG_RUNTIME_DIR) {
        result = path.join(XDG_RUNTIME_DIR, `vscode-ipc-${randomSuffix}.sock`);
    }
    else {
        result = path.join(os.tmpdir(), `vscode-${randomSuffix}.sock`);
    }
    const limit = safeIpcPathLengths.get(process.platform);
    if (limit !== undefined && result.length > limit) {
        (0, ril_1.default)().console.warn(`WARNING: IPC handle "${result}" is longer than ${limit} characters.`);
    }
    return result;
}
exports.generateRandomPipeName = generateRandomPipeName;
function createClientPipeTransport(pipeName, encoding = 'utf-8') {
    let connectResolve;
    const connected = new Promise((resolve, _reject) => {
        connectResolve = resolve;
    });
    return new Promise((resolve, reject) => {
        let server = (0, net_1.createServer)((socket) => {
            server.close();
            connectResolve([
                new SocketMessageReader(socket, encoding),
                new SocketMessageWriter(socket, encoding)
            ]);
        });
        server.on('error', reject);
        server.listen(pipeName, () => {
            server.removeListener('error', reject);
            resolve({
                onConnected: () => { return connected; }
            });
        });
    });
}
exports.createClientPipeTransport = createClientPipeTransport;
function createServerPipeTransport(pipeName, encoding = 'utf-8') {
    const socket = (0, net_1.createConnection)(pipeName);
    return [
        new SocketMessageReader(socket, encoding),
        new SocketMessageWriter(socket, encoding)
    ];
}
exports.createServerPipeTransport = createServerPipeTransport;
function createClientSocketTransport(port, encoding = 'utf-8') {
    let connectResolve;
    const connected = new Promise((resolve, _reject) => {
        connectResolve = resolve;
    });
    return new Promise((resolve, reject) => {
        const server = (0, net_1.createServer)((socket) => {
            server.close();
            connectResolve([
                new SocketMessageReader(socket, encoding),
                new SocketMessageWriter(socket, encoding)
            ]);
        });
        server.on('error', reject);
        server.listen(port, '127.0.0.1', () => {
            server.removeListener('error', reject);
            resolve({
                onConnected: () => { return connected; }
            });
        });
    });
}
exports.createClientSocketTransport = createClientSocketTransport;
function createServerSocketTransport(port, encoding = 'utf-8') {
    const socket = (0, net_1.createConnection)(port, '127.0.0.1');
    return [
        new SocketMessageReader(socket, encoding),
        new SocketMessageWriter(socket, encoding)
    ];
}
exports.createServerSocketTransport = createServerSocketTransport;
function isReadableStream(value) {
    const candidate = value;
    return candidate.read !== undefined && candidate.addListener !== undefined;
}
function isWritableStream(value) {
    const candidate = value;
    return candidate.write !== undefined && candidate.addListener !== undefined;
}
function createMessageConnection(input, output, logger, options) {
    if (!logger) {
        logger = api_1.NullLogger;
    }
    const reader = isReadableStream(input) ? new StreamMessageReader(input) : input;
    const writer = isWritableStream(output) ? new StreamMessageWriter(output) : output;
    if (api_1.ConnectionStrategy.is(options)) {
        options = { connectionStrategy: options };
    }
    return (0, api_1.createMessageConnection)(reader, writer, logger, options);
}
exports.createMessageConnection = createMessageConnection;


/***/ },

/***/ 9571
(__unused_webpack_module, exports, __webpack_require__) {

var __webpack_unused_export__;

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
__webpack_unused_export__ = ({ value: true });
const util_1 = __webpack_require__(9023);
const api_1 = __webpack_require__(3281);
class MessageBuffer extends api_1.AbstractMessageBuffer {
    constructor(encoding = 'utf-8') {
        super(encoding);
    }
    emptyBuffer() {
        return MessageBuffer.emptyBuffer;
    }
    fromString(value, encoding) {
        return Buffer.from(value, encoding);
    }
    toString(value, encoding) {
        if (value instanceof Buffer) {
            return value.toString(encoding);
        }
        else {
            return new util_1.TextDecoder(encoding).decode(value);
        }
    }
    asNative(buffer, length) {
        if (length === undefined) {
            return buffer instanceof Buffer ? buffer : Buffer.from(buffer);
        }
        else {
            return buffer instanceof Buffer ? buffer.slice(0, length) : Buffer.from(buffer, 0, length);
        }
    }
    allocNative(length) {
        return Buffer.allocUnsafe(length);
    }
}
MessageBuffer.emptyBuffer = Buffer.allocUnsafe(0);
class ReadableStreamWrapper {
    constructor(stream) {
        this.stream = stream;
    }
    onClose(listener) {
        this.stream.on('close', listener);
        return api_1.Disposable.create(() => this.stream.off('close', listener));
    }
    onError(listener) {
        this.stream.on('error', listener);
        return api_1.Disposable.create(() => this.stream.off('error', listener));
    }
    onEnd(listener) {
        this.stream.on('end', listener);
        return api_1.Disposable.create(() => this.stream.off('end', listener));
    }
    onData(listener) {
        this.stream.on('data', listener);
        return api_1.Disposable.create(() => this.stream.off('data', listener));
    }
}
class WritableStreamWrapper {
    constructor(stream) {
        this.stream = stream;
    }
    onClose(listener) {
        this.stream.on('close', listener);
        return api_1.Disposable.create(() => this.stream.off('close', listener));
    }
    onError(listener) {
        this.stream.on('error', listener);
        return api_1.Disposable.create(() => this.stream.off('error', listener));
    }
    onEnd(listener) {
        this.stream.on('end', listener);
        return api_1.Disposable.create(() => this.stream.off('end', listener));
    }
    write(data, encoding) {
        return new Promise((resolve, reject) => {
            const callback = (error) => {
                if (error === undefined || error === null) {
                    resolve();
                }
                else {
                    reject(error);
                }
            };
            if (typeof data === 'string') {
                this.stream.write(data, encoding, callback);
            }
            else {
                this.stream.write(data, callback);
            }
        });
    }
    end() {
        this.stream.end();
    }
}
const _ril = Object.freeze({
    messageBuffer: Object.freeze({
        create: (encoding) => new MessageBuffer(encoding)
    }),
    applicationJson: Object.freeze({
        encoder: Object.freeze({
            name: 'application/json',
            encode: (msg, options) => {
                try {
                    return Promise.resolve(Buffer.from(JSON.stringify(msg, undefined, 0), options.charset));
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }
        }),
        decoder: Object.freeze({
            name: 'application/json',
            decode: (buffer, options) => {
                try {
                    if (buffer instanceof Buffer) {
                        return Promise.resolve(JSON.parse(buffer.toString(options.charset)));
                    }
                    else {
                        return Promise.resolve(JSON.parse(new util_1.TextDecoder(options.charset).decode(buffer)));
                    }
                }
                catch (err) {
                    return Promise.reject(err);
                }
            }
        })
    }),
    stream: Object.freeze({
        asReadableStream: (stream) => new ReadableStreamWrapper(stream),
        asWritableStream: (stream) => new WritableStreamWrapper(stream)
    }),
    console: console,
    timer: Object.freeze({
        setTimeout(callback, ms, ...args) {
            const handle = setTimeout(callback, ms, ...args);
            return { dispose: () => clearTimeout(handle) };
        },
        setImmediate(callback, ...args) {
            const handle = setImmediate(callback, ...args);
            return { dispose: () => clearImmediate(handle) };
        },
        setInterval(callback, ms, ...args) {
            const handle = setInterval(callback, ms, ...args);
            return { dispose: () => clearInterval(handle) };
        }
    })
});
function RIL() {
    return _ril;
}
(function (RIL) {
    function install() {
        api_1.RAL.install(_ril);
    }
    RIL.install = install;
})(RIL || (RIL = {}));
exports["default"] = RIL;


/***/ },

/***/ 2067
(module, __unused_webpack_exports, __webpack_require__) {

/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ----------------------------------------------------------------------------------------- */


module.exports = __webpack_require__(7123);

/***/ },

/***/ 4579
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["AsyncLocalStorage"]: () => (__WEBPACK_EXTERNAL_MODULE_node_async_hooks_1fa35564__.AsyncLocalStorage) });

/***/ },

/***/ 6564
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["exec"]: () => (__WEBPACK_EXTERNAL_MODULE_node_child_process_7aa195c7__.exec), ["execFile"]: () => (__WEBPACK_EXTERNAL_MODULE_node_child_process_7aa195c7__.execFile), ["spawn"]: () => (__WEBPACK_EXTERNAL_MODULE_node_child_process_7aa195c7__.spawn) });

/***/ },

/***/ 2561
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["createHash"]: () => (__WEBPACK_EXTERNAL_MODULE_node_crypto_803ecaf5__.createHash), ["randomUUID"]: () => (__WEBPACK_EXTERNAL_MODULE_node_crypto_803ecaf5__.randomUUID) });

/***/ },

/***/ 9627
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["chmodSync"]: () => (__WEBPACK_EXTERNAL_MODULE_node_fs_75ed2103__.chmodSync), ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_node_fs_75ed2103__["default"]), ["existsSync"]: () => (__WEBPACK_EXTERNAL_MODULE_node_fs_75ed2103__.existsSync) });

/***/ },

/***/ 8298
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_node_fs_promises_4a3ebc43__["default"]) });

/***/ },

/***/ 8299
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["Socket"]: () => (__WEBPACK_EXTERNAL_MODULE_node_net_4372f4b2__.Socket) });

/***/ },

/***/ 6674
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_node_os_e12349cb__["default"]), ["tmpdir"]: () => (__WEBPACK_EXTERNAL_MODULE_node_os_e12349cb__.tmpdir) });

/***/ },

/***/ 5663
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_node_path_02319fef__["default"]), ["dirname"]: () => (__WEBPACK_EXTERNAL_MODULE_node_path_02319fef__.dirname), ["isAbsolute"]: () => (__WEBPACK_EXTERNAL_MODULE_node_path_02319fef__.isAbsolute), ["join"]: () => (__WEBPACK_EXTERNAL_MODULE_node_path_02319fef__.join), ["resolve"]: () => (__WEBPACK_EXTERNAL_MODULE_node_path_02319fef__.resolve), ["sep"]: () => (__WEBPACK_EXTERNAL_MODULE_node_path_02319fef__.sep) });

/***/ },

/***/ 9182
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_node_readline_153c82ca__["default"]) });

/***/ },

/***/ 9068
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["PassThrough"]: () => (__WEBPACK_EXTERNAL_MODULE_node_stream_62980834__.PassThrough), ["Writable"]: () => (__WEBPACK_EXTERNAL_MODULE_node_stream_62980834__.Writable) });

/***/ },

/***/ 9061
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["fileURLToPath"]: () => (__WEBPACK_EXTERNAL_MODULE_node_url_da953c0c__.fileURLToPath), ["pathToFileURL"]: () => (__WEBPACK_EXTERNAL_MODULE_node_url_da953c0c__.pathToFileURL) });

/***/ },

/***/ 4472
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["promisify"]: () => (__WEBPACK_EXTERNAL_MODULE_node_util_1f093676__.promisify) });

/***/ },

/***/ 6982
(module) {

module.exports = __WEBPACK_EXTERNAL_createRequire_require("crypto");

/***/ },

/***/ 9278
(module) {

module.exports = __WEBPACK_EXTERNAL_createRequire_require("net");

/***/ },

/***/ 857
(module) {

module.exports = __WEBPACK_EXTERNAL_createRequire_require("os");

/***/ },

/***/ 6928
(module) {

module.exports = __WEBPACK_EXTERNAL_createRequire_require("path");

/***/ },

/***/ 9023
(module) {

module.exports = __WEBPACK_EXTERNAL_createRequire_require("util");

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ const __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	const cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	const module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/******/ // expose the module cache
/******/ __webpack_require__.c = __webpack_module_cache__;
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/compat get default export */
/******/ // getDefaultExport function for compatibility with non-harmony modules
/******/ __webpack_require__.n = (module) => {
/******/ 	const getter = module && module.__esModule ?
/******/ 		() => (module['default']) :
/******/ 		() => (module);
/******/ 	__webpack_require__.d(getter, { a: getter });
/******/ 	return getter;
/******/ };
/******/ 
/******/ /* webpack/runtime/define property getters */
/******/ // define getter/value functions for harmony exports
/******/ __webpack_require__.d = (exports, definition) => {
/******/ 	if(Array.isArray(definition)) {
/******/ 		var i = 0;
/******/ 		while(i < definition.length) {
/******/ 			var key = definition[i++];
/******/ 			var binding = definition[i++];
/******/ 			var descriptor = binding === 0 ? { enumerable: true, value: definition[i++] } : { enumerable: true, get: binding };
/******/ 			if(!__webpack_require__.o(exports, key)) Object.defineProperty(exports, key, descriptor);
/******/ 		}
/******/ 	} else {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	}
/******/ };
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ __webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
/******/ 
/************************************************************************/
/******/ 
/******/ // module cache are used so entry inlining is disabled
/******/ // startup
/******/ // Load entry module and return exports
/******/ let __webpack_exports__ = __webpack_require__(__webpack_require__.s = 5913);
/******/ const __webpack_exports__default = __webpack_exports__.Ay;
/******/ const __webpack_exports__init = __webpack_exports__.Ts;
/******/ const __webpack_exports__prepareCopilotCli = __webpack_exports__.si;
/******/ export { __webpack_exports__default as default, __webpack_exports__init as init, __webpack_exports__prepareCopilotCli as prepareCopilotCli };
/******/ 
