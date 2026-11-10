import * as __WEBPACK_EXTERNAL_MODULE_node_child_process_7aa195c7__ from "node:child_process";
import * as __WEBPACK_EXTERNAL_MODULE_node_fs_75ed2103__ from "node:fs";
import * as __WEBPACK_EXTERNAL_MODULE_node_os_e12349cb__ from "node:os";
import * as __WEBPACK_EXTERNAL_MODULE_node_path_02319fef__ from "node:path";
import * as __WEBPACK_EXTERNAL_MODULE_node_readline_153c82ca__ from "node:readline";
import * as __WEBPACK_EXTERNAL_MODULE_node_url_da953c0c__ from "node:url";
import * as __WEBPACK_EXTERNAL_MODULE_node_util_1f093676__ from "node:util";
/******/ var __webpack_modules__ = ({

/***/ 937
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ZZ: () => (/* binding */ registerAdapter)
/* harmony export */ });
/* unused harmony exports get, set, del, remove, has, clear, prompt, request, query, delete */
/* harmony import */ var _cocreate_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(604);
/* harmony import */ var _cocreate_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(209);

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

/***/ 405
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(627);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(663);
/* harmony import */ var node_os__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(674);
/* harmony import */ var node_readline__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(182);
/* harmony import */ var node_util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(472);
/* harmony import */ var node_child_process__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(564);
/* harmony import */ var _core_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(937);







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
    const value = process.env[key];
    if (value === void 0) return null;
    try {
      const parsed = JSON.parse(value);
      return parsed !== null && typeof parsed === "object" ? parsed : value;
    } catch {
      return value;
    }
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

/***/ 604
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

/***/ 209
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

/***/ 99
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Pw: () => (/* binding */ resolveAIConfig)
/* harmony export */ });
/* unused harmony export defaults */
/* harmony import */ var _cocreate_config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(405);
/* harmony import */ var _cocreate_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(604);


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


/***/ },

/***/ 564
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["exec"]: () => (__WEBPACK_EXTERNAL_MODULE_node_child_process_7aa195c7__.exec) });

/***/ },

/***/ 627
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_node_fs_75ed2103__["default"]), ["existsSync"]: () => (__WEBPACK_EXTERNAL_MODULE_node_fs_75ed2103__.existsSync) });

/***/ },

/***/ 674
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_node_os_e12349cb__["default"]) });

/***/ },

/***/ 663
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_node_path_02319fef__["default"]) });

/***/ },

/***/ 182
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["default"]: () => (__WEBPACK_EXTERNAL_MODULE_node_readline_153c82ca__["default"]) });

/***/ },

/***/ 61
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["fileURLToPath"]: () => (__WEBPACK_EXTERNAL_MODULE_node_url_da953c0c__.fileURLToPath), ["pathToFileURL"]: () => (__WEBPACK_EXTERNAL_MODULE_node_url_da953c0c__.pathToFileURL) });

/***/ },

/***/ 472
(module, __unused_webpack_exports, __webpack_require__) {

const x = (y) => {
	const x = {}; __webpack_require__.d(x, y); return x
} 
const y = (x) => (() => (x))
module.exports = x({ ["promisify"]: () => (__WEBPACK_EXTERNAL_MODULE_node_util_1f093676__.promisify) });

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
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
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
let __webpack_exports__ = {};
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   T: () => (/* binding */ init)
/* harmony export */ });
/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(99);
/* harmony import */ var node_fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(627);
/* harmony import */ var node_path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(663);
/* harmony import */ var node_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(61);




function disabledAI(config) {
  return {
    config,
    async send() {
      throw new Error(
        "[@cocreate/ai] AI is disabled by configuration (ai.enabled=false)."
      );
    },
    async stop() {
    }
  };
}
async function init(server, options = {}) {
  const { pluginDirectory, ...configOptions } = options;
  const aiConfig = await (0,_config_js__WEBPACK_IMPORTED_MODULE_0__/* .resolveAIConfig */ .Pw)(server, configOptions);
  if (!aiConfig.enabled) return disabledAI(aiConfig);
  const pluginDirectories = [
    pluginDirectory,
    node_path__WEBPACK_IMPORTED_MODULE_2__["default"].join(process.cwd(), "plugins", "ai"),
    process.argv[1] ? node_path__WEBPACK_IMPORTED_MODULE_2__["default"].join(
      node_path__WEBPACK_IMPORTED_MODULE_2__["default"].dirname(node_path__WEBPACK_IMPORTED_MODULE_2__["default"].resolve(process.argv[1])),
      "plugins",
      "ai"
    ) : null
  ].filter(Boolean);
  let runtimeUrl;
  let resolvedPluginDirectory;
  for (const directory of pluginDirectories) {
    const directoryPath = directory.startsWith?.("file:") ? (0,node_url__WEBPACK_IMPORTED_MODULE_3__.fileURLToPath)(directory) : directory;
    const runtimePath = node_path__WEBPACK_IMPORTED_MODULE_2__["default"].join(directoryPath, "runtime.js");
    if (!(0,node_fs__WEBPACK_IMPORTED_MODULE_1__.existsSync)(runtimePath)) continue;
    resolvedPluginDirectory = (0,node_url__WEBPACK_IMPORTED_MODULE_3__.pathToFileURL)(
      `${directoryPath}${node_path__WEBPACK_IMPORTED_MODULE_2__["default"].sep}`
    ).href;
    runtimeUrl = (0,node_url__WEBPACK_IMPORTED_MODULE_3__.pathToFileURL)(runtimePath).href;
    break;
  }
  if (!aiConfig.cliPath && !aiConfig.cliDirectory && resolvedPluginDirectory) {
    aiConfig.cliDirectory = resolvedPluginDirectory;
  }
  const runtime = runtimeUrl ? await import(
    /* webpackIgnore: true */
    runtimeUrl
  ) : await import(
    /* webpackIgnore: true */
    "@cocreate/ai/runtime"
  );
  const { init: initRuntime } = runtime;
  return initRuntime(server, {}, aiConfig);
}
/* harmony default export */ const bootstrap = ({ init });

/* harmony export */ __webpack_require__.d(__webpack_exports__, [
/* harmony export */   "A", 0, bootstrap
/* harmony export */ ]);

const __webpack_exports__default = __webpack_exports__.A;
export { __webpack_exports__default as default, init };
