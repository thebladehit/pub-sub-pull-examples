# Message Queueing in Node.js — Pub/Sub and Pull Models

This project demonstrates two abstract message queuing patterns implemented in **pure Node.js**:

1. `Pull Queue` — with acknowledgment (`ack`), timeout, and retry logic.
2.  `Pub/Sub` — based on `EventEmitter` for simple in-process broadcasting.

---

## Project Structure
```
src/
├── pub-sub/
│   └── event-emitter-pub-sub.js        # EventEmitter-based Pub/Sub example
|   └── problem.md
├── pull/
│   └── array-pull.js                   # Pull-based Queue example
|   └── problem.md
```
