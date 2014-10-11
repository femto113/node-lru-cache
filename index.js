var Heap = require('heap');

// comparator for the heap, assumes entries with a u property containing a timestamp,
// and a unique string key property
function lru_cmp(a, b) {
  // NOTE: to ensure deterministic results when the timestamps are the
  // same we do a secondary ordering by key (which are guaranteed to be different,
  // so no test for equality)
  return a.u - b.u || (a.key < b.key ? -1 : 1);
}

function LRU(max_items) {
   Object.defineProperty(this, "heap", { value: new Heap(lru_cmp), writable: false, enumerable: false });
   Object.defineProperty(this, "cache", { value: new Object(), writable: false, enumerable: true });
   Object.defineProperty(this, "max_items", { value: max_items, writable: false, enumerable: true });
   // TODO: heap has a size method, if it's O(1) we can just call it instead of maintaining our own count
   Object.defineProperty(this, "items", { value: 0, writable: true, enumerable: true });
}

Object.defineProperty(LRU.prototype, "full", { get: function () { return this.items >= this.max_items; } });

LRU.prototype.put = function (key, value) {
  // NOTE: we call Object's hasOwnProperty to avoid puking if someone adds a 'hasOwnProperty' key to the cache
  if (Object.hasOwnProperty.call(this.cache, key)) {
    // this key already in cache, so just update it
    var entry = this.cache[key];
    entry.value = value;
    entry.u = Date.now();
    this.heap.updateItem(entry);
  } else {
    // this is a new key, if full make room for it by ejecting oldest item
    if (this.full) {
      var eject = this.heap.pop().key;
      // console.log("ejecting", eject, "to make room for", key);
      delete this.cache[eject];
    }
    var entry = { key: key, u: Date.now(), value: value };
    this.heap.push(entry);
    this.cache[key] = entry;
    this.items++;
  }
}

LRU.prototype.get = function (key) {
  if (Object.hasOwnProperty.call(this.cache, key)) {
    var entry = this.cache[key];
    entry.u = Date.now();
    this.heap.updateItem(entry);
    return entry.value;
  } else {
    // console.log("key", key, "not found in cache", this.cache);
    return null;
  }
}

LRU.prototype.oldest = function () {
  return this.heap.peek().value;
}

module.exports = LRU;
