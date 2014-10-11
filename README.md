# lru-cache 

This module implements a simple, fixed-size\*, least-recently-used (LRU) cache.

\*Note that this is a fixed number of items, not a fixed amount of memory, so it
really only makes sense to use with relatively homogenous objects.

This module was developed as part of a programming exercise, and hasn't been tested in production,
so use with appropriate caution.

## Install

```bash
git clone https://github.com/femto113/node-lru-cache
cd node-lru-cache
npm link
```

## Usage

This module exports an object constructor for an LRU object, which takes
the maximum number of items to hold in the cache as an argument.

```javascript
var LRU = require("lru-cache");

var lru = new LRU(3);
```

The LRU object offers just a few methods:

`put(key, value)`

Add an new item to the cache, or replace an existing item's
value.  If the cache is full it will eject the oldest item.

`get(key)`

Retrieve an item from the cache.  If not found (either because
it wasn't added or because it was ejected) will return null.
If found will update the timestamp of the item.

`oldest()`

Retrieve the oldest item in the cache (without updating
its timestamp).  Useful to see what's about to be ejected.

`full`

Boolean property indicating whether the cache is full.

## Design Notes

This cache uses two complementary datastructures to provide fast
performance of each operation.  A standard Javascript object is used
as a hash table for O(1) lookup by key, and a min-heap (provided by
the [heap module](https://www.npmjs.org/package/heap) is used to maintain
the LRU sort.  The get and put operations are both O(log N) in theory but due to the 
[magical performance properties of heaps](http://en.wikipedia.org/wiki/Binary_heap#Heap_operations)
will be close to O(1) in practice.

## License

MIT
