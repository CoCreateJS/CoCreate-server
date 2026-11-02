# @cocreate/server

A highly scalable, multi-tenant server infrastructure architecture. As the master entry point wrapper for the CoCreate ecosystem, `@cocreate/server` orchestrates a modular cluster matrix capable of auto-scaling, reactive data synchronization, dynamic routing, and pluggable cross-database architectures.

By binding isolated microservices together under a unified cluster mesh, this engine allows developers to build elastic, distributed applications that scale seamlessly from a single container up to enterprise-grade server infrastructure.

---

## Table of Contents

- [Documentation](#documentation)
- [System Topology](#system-topology)
- [Features](#features)
- [System Architecture Overview](#system-architecture-overview)
- [Installation](#installation)
- [Usage](#usage)
- [Core Cluster Mechanics](#core-cluster-mechanics)
- [Ecosystem Component Blueprint](#ecosystem-component-blueprint)
- [How to Contribute](#how-to-contribute)
- [License](#license)

---

## System Topology

The cluster scales down to zero on passive loads and scales vertically or horizontally into distributed sub-process meshes across regions during massive traffic bursts.

```
                         [ GLOBAL TRAFFIC INBOUND ]
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
     ┌───────────────────────┐               ┌───────────────────────┐
     │   AWS REGION (US-EAST)│               │  GCP REGION (EU-WEST) │
     │ ┌───────────────────┐ │               │ ┌───────────────────┐ │
     │ │  CoCreate Proxy   │ │               │ │  CoCreate Proxy   │ │
     │ └─────────┬─────────┘ │               │ └─────────┬─────────┘ │
     │           ▼           │               │           ▼           │
     │ ┌───────────────────┐ │  Mesh Sync    │ ┌───────────────────┐ │
     │ │   CoCreate Node   │◄────────────────┼►│   CoCreate Node   │ │
     │ │  (Master/Worker)  │ │  Cross-Cloud  │ │  (Master/Worker)  │ │
     │ └─────────┬─────────┘ │               │ └─────────┬─────────┘ │
     └───────────┼───────────┘               └───────────┼───────────┘
                 │                                       │
                 └───────────────────┬───────────────────┘
                                     ▼
                        ┌──────────────────────────┐
                        │   Cross-DB CRUD Bridge   │ (Unified Command Pattern)
                        └────────────┬─────────────┘
                                     │
                ┌────────────────────┴────────────────────┐
                ▼                                         ▼
          ┌───────────┐                             ┌───────────┐
          │ MongoDB   │                             │ IndexedDB │
          │  Cluster  │                             │  (Edge)   │
          └───────────┘                             └───────────┘

```

---

## Features

* **Symmetric Master/Worker Topology:** Eliminates single points of failure by making every single node a fully functioning, autonomous container running local master orchestration loops alongside active worker processes.
* **Cross-Cloud & Multi-Region Resiliency:** Seamlessly links server instances running across completely disparate cloud providers (e.g., AWS, GCP, DigitalOcean) and global regions into a highly unified, cooperative runtime mesh.
* **Autonomous Self-Healing Fabric:** Continuously assesses peer node vitals; if an entire region or cloud provider drops offline, the remaining nodes instantly elect new routing boundaries, handle cluster reconciliation, and auto-scale to absorb shifted traffic loops.
* **Unified Cross-Database Bridge:** Decouples business logic from storage engines entirely via an event-driven CRUD protocol payload framework capable of writing to MongoDB, IndexedDB, or custom local/cloud data systems concurrently.
* **Distributed State Synchronization:** Implements an atomic WebSocket/PubSub bus ensuring data mutations, cache invalidations, and session parameters broadcast instantly across all active node layers.
* **Zero-Downtime Pipeline Failovers:** Isolates faulty runtime threads, crashing sub-processes, or timed-out worker frames transparently, auto-spawning replacement pipelines instantly to prevent message drops.

---

## System Architecture Overview

CoCreate represents a shift away from traditional, monolithic server apps toward a reactive, multi-tenant state mesh.

Instead of treating server logic, routing, data layers, and certificate tracking as tightly coupled subcomponents, CoCreate separates them into dedicated, isolated functional wrappers.

```
  ┌────────────────────────────────────────────────────────────────────────┐
  │                           @cocreate/server                         │
  │                     (Unified Global Entry Wrapper)                     │
  └───────────────────────────────────┬────────────────────────────────────┘
                                      │
                                      ▼
                    ┌───────────────────────────────────┐
                    │          @cocreate/cluster         │
                    │      (Master Execution Core)      │
                    └─────────────────┬─────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
┌──────────────────┐        ┌──────────────────┐        ┌──────────────────┐
│  @cocreate/certificates  │        │ @cocreate/auth   │        │ @cocreate/author │
│ (SSL Provision)  │        │ (Session Engine) │        │ (Access Firewall)│
└──────────────────┘        └──────────────────┘        └──────────────────┘

```

At its core, `@cocreate/server` loads `@cocreate/cluster`, bootstrapping the core networking loops. Every server node instance spins up as a lightweight runner. The true intelligence of the cluster lies within its pluggable state engines, allowing distributed worker threads to process calculations concurrently while remaining synchronized.

---

## Installation

```bash
npm install @cocreate/server

```

## Preparing the Node Runtime Bundle

Storage and plugin distributions are generated and tested separately from the server bundle. When their sources or configured lists change, run `yarn build:storages` and `yarn build:plugins`, test the server with those outputs, and commit the generated `storages/` and `plugins/` files. `yarn package:node` verifies those committed artifacts and packages them without rebuilding them. Copilot executables are tracked with Git LFS.

---

## Usage

### Orchestrating the Master Infrastructure Core

Bootstrapping the master workspace mesh is streamlined down to a single instantiation lifecycle. The wrapper takes care of configuring underlying environments, pulling server boundaries, and connecting ecosystem plugins under the hood:

```javascript
const CoCreateServer = require('@cocreate/server');

/**
 * Configure global cluster attributes
 * Configs can be driven via process environments, storage variables, or local files
 */
const clusterConfig = {
  ports: {
    http: 80,
    https: 443,
    ws: 8080
  },
  databaseBridges: [
    { type: 'mongodb', uri: 'mongodb://cluster-shard-00-01:27017/prod' },
    { type: 'indexeddb', syncEdge: true }
  ],
  scaling: {
    maxWorkers: 'auto',
    cpuThresholdPercent: 75
  }
};

// Initializes the entire CoCreate server-side topology
const infrastructureMesh = new CoCreateServer(clusterConfig);

infrastructureMesh.on('cluster.ready', ({ nodes, workers }) => {
  console.log(`CoCreate infrastructure cluster online. Managed workers: ${workers}`);
});

infrastructureMesh.on('node.scaleUp', ({ workerId, load }) => {
  console.log(`Resource load peaked at ${load}%. Elastic cluster spawned worker process: ${workerId}`);
});

```

---

## Core Cluster Mechanics

### 1. Symmetric Master/Worker Mesh & Self-Healing

Traditional clusters depend on central coordinator processes or explicit controller nodes. CoCreate implements a shared-nothing, symmetric model:

* **Dual Roles:** Each node runs both a control plane loop (Master orchestration) and an execution threadpool (Workers handling WebSocket load).
* **Self-Healing Mechanics:** If an individual worker thread crashes, the local node master hot-spawns a replacement instantly. If an entire node vanishes due to a cloud infrastructure failure, peer instances running in separate global datacenters recognize the dropped heartbeat, re-route messaging lines, and scale up local workers to normalize system capacity automatically.

### 2. Multi-Cloud & Multi-Region Elastic Auto-Scaling

Because communication passes over an optimized network transport protocol, nodes can be distributed across various cloud vendor ecosystems (AWS, GCP, Azure, bare-metal) and different geographical boundaries seamlessly:

* **Scale-Up Phase:** The control plane monitors local latency, thread saturation, and event-loop lag. When thresholds are crossed, new child clusters spawn locally while signaling sister regions to expand throughput parameters.
* **Scale-Down Phase:** When passive windows open and resource strain subsides, the platform uses a graceful draining technique to safely close idle nodes without dropping active user web sockets.

### 3. Multi-Database Architecture & Data Federation

CoCreate decouples persistence by processing queries using a normalized, vendor-agnostic data protocol layout. Storage interactions pass through a central database router:

* **Federated Writes:** A write operation can simultaneously update a highly performant cloud-backed Document DB (like MongoDB) for primary data retention, and instantly broadcast transaction streams down to local system buffers or client edge indices (like IndexedDB).
* **Network Agility:** Storage drivers can be injected dynamically at runtime. If a database goes offline or undergoes maintenance, the CRUD gateway intercepts failed promises and redirects data operations to failover shards seamlessly.

### 4. Distributed Network State Synchronization

Rather than utilizing heavy external message brokers that introduce latency, the architecture couples state synchronization directly to reactive PubSub events. When a tenant updates an object parameter:

1. The mutation runs through field-level compliance checks locally.
2. The delta event is wrapped in an atomic network envelope (`object.update`).
3. It instantly broadcasts across IPC channels to sister process threads on the local machine and fires across distributed network sockets to all active servers, keeping thousands of concurrent connections instantly synchronized.

---

## Ecosystem Component Blueprint

The modular architecture of CoCreate isolates critical system concerns into distinct, pluggable open-source components:

* **[@cocreate/cluster](https://github.com/CoCreateJS/cluster):** The core server framework that manages raw HTTP/HTTPS routing pipelines, socket upgrades, lifecycle events, and basic message loops.
* **[@cocreate/authorization](https://github.com/CoCreateJS/authorization):** A data sanitization firewall and hierarchical permission evaluation engine that handles role inheritance, dot-notation action checks, and dynamic query filtering.
* **[@cocreate/authentication](https://github.com/CoCreateJS/authentication):** A secure RS256 JWT session management layer that utilizes native crypto keypair generation and rotation to validate user credentials without extra dependencies.
* **[@cocreate/certificates](https://github.com/CoCreateJS/certificates):** An automated Let's Encrypt certificate client that stores validation challenge tokens in the cluster-wide database, enabling any node to satisfy domain challenges on the fly.

---

## How to Contribute

We encourage contribution to our libraries (you might even score some nifty swag), please see our [CONTRIBUTING.md](https://github.com/CoCreateJS/CoCreate-server/blob/master/CONTRIBUTING.md) guide for details. If you encounter any bugs or wish to make feature requests, please submit an issue on our [GitHub Issues](https://github.com/CoCreateJS/CoCreate-server/issues) tracker. We want this library to be community-driven, and CoCreate led. We need your help to realize this goal.

For broader system configurations and API guides, please visit our [CoCreate WS Infrastructure Documentation](https://cocreatejs.com/docs/).

---

## License

This software is dual-licensed under the GNU Affero General Public License version 3 (AGPLv3) and a commercial license.

* **Open Source Use:** For open-source projects and non-commercial use, this software is available under the AGPLv3. For the full license text, see the LICENSE file.
* **Commercial Use:** For-profit companies and individuals intending to use this software for commercial purposes must obtain a commercial license. The commercial license is available when you sign up for an API key on our website.
