---
name: "Sumo Collector"
ring: "adopt"
quadrant: "infrastructure"
isNew: "false"
---

The Sumo Collector is a host-level program which ships our docker logs to sumo. It is a memory hog -- up to 500MB per instance -- and has caused deployment failures in the past.