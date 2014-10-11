var LRU = require("./index.js"),
    assert = require("assert");

var lru = new LRU(3);

var a = { name: 'Adam' };
var b = { name: 'Betty' };
var c = { name: 'Carla' };
var d = { name: 'David' };
var e = { name: 'Edgar' };

function status() {
  console.log("cache", lru.full ? "is" : "is not", "full, oldest is now", lru.oldest().name);
}

console.log("putting", a.name);
lru.put(a.name, a);
status();
assert(lru.oldest() == a);
assert(lru.get(a.name) == a); // make sure we can get him back out
console.log("putting", b.name);
lru.put(b.name, b);
status();
assert(lru.oldest() == a); // Adam should still be the oldest
console.log("putting", c.name);
lru.put(c.name, c);
status();
assert(lru.oldest() == a); // Adam should still be the oldest
console.log("putting", d.name);
lru.put(d.name, d);
status();
assert(lru.get(a.name) == null); // at this point we're full so should have ejected Adam 

// run this next bit in 10 milliseconds to ensure we don't have timestamp collisions
setTimeout(function () {
   assert(lru.oldest() == b); 
   console.log("getting", b.name);
   lru.get(b.name); // touch Betty so she's newer than Carla
   status();
   assert(lru.oldest() == c); // Carla should now be the oldest
   console.log("putting", e.name);
   lru.put(e.name, e); // add Edgar, should eject Carla
   status();
   assert(lru.get(c.name) == null);
   console.log("done.");
   process.exit();
}, 10);
