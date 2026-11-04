---
id: "py-les-hash-tables"
type: "theory"
title: "Hash Tables"
moduleId: "py-mod-14-data-structures"
order: 4
status: "draft"
language: "en"
lastUpdated: "2026-11-04"
estimatedMinutes: 15
tags: ["python", "data-structures", "hash-tables", "dict", "hashing"]
---

# Concept Overview

A hash table stores key-value pairs so that a key can be looked up directly, without scanning. It works in two steps: a hash function turns the key into a number, and that number selects a slot in an array where the pair is stored. Python dictionaries and sets are hash tables built on this idea.

A hash function must be consistent: the same key must always produce the same hash. When two different keys produce the same hash, they collide, and the table must store both keys in a way that keeps both findable. The goal is a good hash distribution, so collisions stay rare.

## Key Principles & Frameworks

### Hashing a key

Every hashable object answers `hash(key)` with an integer. The table uses that integer modulo its size to pick a slot:

```python
print(hash("apple"))
print(hash("apple"))
print(hash("banana") == hash("apple"))
```

Output:

```text
3584
3584
False
```

The same string hash matches itself every time. Hashing is also run once per process with a random seed for strings, so the printed numbers change between runs; equality within one run is what matters.

### How `dict` and `set` work

A dictionary stores each key once, at the slot its hash selects, and returns the value stored there. A set stores keys alone, with no values. Adding a duplicate key to a set changes nothing:

```python
counts = {}
for word in ["a", "b", "a"]:
    counts[word] = counts.get(word, 0) + 1
print(counts)

seen = set()
seen.add("x")
seen.add("x")
print(len(seen))
print("x" in seen)
```

Output:

```text
{'a': 2, 'b': 1}
1
True
```

`counts` keeps one entry per word. `seen` keeps one `"x"`. Both rely on the hash to find the existing entry faster than a scan.

### Collisions

Two keys with the same hash want the same slot. The table resolves the collision by keeping multiple entries per slot and comparing keys until it finds the right one. Frequent collisions make lookups slower, approaching `O(n)` in the worst case. Python resizes the table as it grows to keep collisions rare, so expected lookup time stays `O(1)`.

### Hashability and `__hash__`

Only hashable objects can be dictionary keys or set members. Strings, integers, and tuples of hashables qualify. Lists, dictionaries, and sets do not, because they are mutable: their contents can change after insertion, which would leave the entry unreachable:

```python
try:
    d = {}
    d[[1, 2]] = "oops"
except TypeError as error:
    print(error)
```

Output:

```text
unhashable type: 'list'
```

In a class, defining `__eq__` without `__hash__` makes instances unhashable. If a class needs identity-based hashing with value equality, both methods must be defined so that objects that compare equal also share a hash.

## Common Pitfalls & Anti-Patterns
- **Using unhashable dictionary keys**: lists, dicts, and sets cannot be keys. Wrap their contents in a tuple or use strings and numbers instead.
- **Assuming dictionary lookups are always O(1)**: `O(1)` is an expected average, not a guarantee. Many collisions or a pathological hash function can degrade lookups toward `O(n)`.
- **Defining `__eq__` but not `__hash__`**: the class silently becomes unhashable, and lookup-shaped code such as `counts[obj]` starts raising `TypeError`.
- **Relying on specific hash values**: string hashes are randomized per run. Never compare `hash()` results across runs or persist them as data.

## Quick Summary
- A hash function maps each key to a slot number, and the table stores the pair there.
- Python `dict` and `set` are hash tables with average `O(1)` insert, lookup, and delete.
- Collisions store multiple keys together and keep them findable by comparing keys.
- Keys must be hashable; lists, dicts, and sets are not.
