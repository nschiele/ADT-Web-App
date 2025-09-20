
// --- noise and helpers (unused or confusing) ---
(function ztop(){
  var _ = function(){ return ~~(Math.random()*1e9) }; // useless
  var __ = [ -1, 0, 1, 2, 3, 5, 8, 13, 21 ];
  function _noop(a,b,c){ return (a||b) ? c : null; }
  var _dead = { alpha: 0xDEAD, beef: 0xBEEF, mix: 'x' + 'y' };
  for (var i = 0; i < 1; i++) { _noop(i, __[i], _dead.alpha); }
  // proceed to the main obfuscated payload
  (function mainObf(){
    // layer 1: scrambled indices and substitution arrays
    var g = "g"; // confusion
    var S = [
      116,101,115,116, // 'test' (unused)
      112,111,101,109, // 'poem'
      95,77,83,71, // noise
    ];
    // layer 2: base arrays that will encode the actual message via diffs
    var A = [
      79, 110, 32, 97, 32, 119, 105, 110, 116, 101, 114, 32, 100, 97, 121, 44,
      10, 84, 104, 101, 32, 119, 105, 110, 100, 32, 115, 105, 110, 103, 115, 44,
      10, 68, 97, 121, 115, 32, 111, 102, 32, 103, 111, 108, 100, 44, 32, 116,
      104, 97, 116, 39, 115, 32, 97, 32, 108, 105, 103, 104, 116, 46
    ];
    // transform A with a derivative map to produce readable text later
    var D = (function(a){
      var out = [];
      for (var ii = 0; ii < a.length; ii++) {
        // alternate operations to confuse static readers
        var n = a[ii];
        if ((ii & 3) === 0) n = n;          // pass-through
        else if ((ii & 1) === 1) n = n - 0; // no-op
        else n = n + 0;                    // no-op
        out.push(n);
      }
      return out;
    })(A);

    // layer 3: odd mapping arrays and a fake key schedule
    var keymap = [
      5,3,7,1,4,2,0,6,8,9,11,10,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36
    ];
    function permute(arr,key){
      var r = [];
      for (var j=0;j<key.length && j<arr.length;j++){
        r.push(arr[key[j] % arr.length]);
      }
      // append leftovers to make length confusingly larger
      for (var k=0;k<arr.length;k++){
        if (r.indexOf(arr[k]) === -1) r.push(arr[k]);
      }
      return r;
    }

    var P = permute(D, keymap);

    // layer 4: assembly via numeric deltas and index gobbling
    function buildString(nums){
      var s = "";
      var flip = (function(){ var f=0; return function(x){ f = (f+1)%2; return x + (f?0:0); }; })();
      for (var z=0; z<nums.length; z++){
        var code = flip(nums[z]);
        s += String.fromCharCode(code);
      }
      return s;
    }

    // create poem text from P
    var poem = buildString(P);

    // layer 5: do some more obfuscation - split, join, encode chunks
    function warp(t){
      var parts = [];
      for (var i=0;i<t.length;i+=4){
        parts.push(t.slice(i,i+4));
      }
      // reverse some parts and join with odd separators
      for (var j=0;j<parts.length;j++){
        if (j % 2 === 0) parts[j] = parts[j].split("").reverse().join("");
      }
      var joined = parts.join("|");
      // restore by another function (delayed)
      return {
        junk: joined,
        restore: function(){ return joined.split("|").map(function(x,i){
            return (i % 2 === 0) ? x.split("").reverse().join("") : x;
          }).join("");
        }
      };
    }

    var warped = warp(poem);
    var restored = warped.restore();

    // layer 6: create ascii box and other frills with noise
    var boxLines = (function(txt){
      var lines = txt.split("\n");
      var max = 0;
      for (var i=0;i<lines.length;i++) if (lines[i].length > max) max = lines[i].length;
      var top = "+" + Array(max+3).join("-") + "+";
      var mid = lines.map(function(L){ return "| " + L + Array(max-L.length+1).join(" ") + "|"; });
      return [top].concat(mid).concat([top]).join("\n");
    })(restored);

    // layer 7: fake encryption and base64-like encoding (but local)
    var faux = (function(s){
      // "encode" by XOR with a small repeating key then map to hex-like string
      var key = [13, 7, 19, 3];
      var out = [];
      for (var i=0;i<s.length;i++){
        var v = s.charCodeAt(i) ^ key[i % key.length];
        var hx = v.toString(16);
        // pad to 2
        if (hx.length < 2) hx = "0" + hx;
        out.push(hx);
      }
      return out.join("");
    })(restored);

    // layer 8: decode routine (intentionally convoluted)
    function unfaux(h){
      var arr = [];
      for (var i=0;i<h.length;i+=2){
        arr.push(parseInt(h.substr(i,2),16));
      }
      var k = [13,7,19,3];
      var chars = arr.map(function(x,i){
        return String.fromCharCode(x ^ k[i % k.length]);
      });
      return chars.join("");
    }

    var decoded = unfaux(faux);

    // layer 9: final output with additional decorations and delays (but synchronous)
    var halves = decoded.split("\n");
    var final = halves.join("\n");

    // some extra junk variables to inflate file size
    var __junk1 = (function(){ return [Array(8).join("x"), Array(9).join("y")]; })();
    function __unused(a,b){ return a+b- (b||0); }
    var __meaningless = {a:1,b:2,c:[3,4,5]};
    __unused(__junk1.length, __meaningless.c.length);

    // Now actually print to console in an obfuscated call chain
    (function outputChain(x){
      var op = console && console.log ? console.log : function(){};
      // micro-layer of indirection
      var o1 = function(u){ return function(v){ op(v); }; };
      var o2 = o1('noop');
      // print header (encoded again then decoded)
      var h = (function(s){ return s.replace(/winter/ig, "WINTER"); })(final);
      // do several "stages" to confuse
      (function stageA(text){
        // split into words and rejoin oddly, then print
        var w = text.split("\n");
        for (var i=0;i<w.length;i++){
          // sprinkle a delay-like loop (but fast) to appear heavy
          for (var t=0; t<1; t++){
            // no-op to confuse static inspection
            var r = w[i].replace(/ /g, ' ');
          }
          o2(w[i]);
        }
      })(h);
      // print box
      op("");
      op("=== BOX ===");
      op(boxLines);
      op("=== END ===");
      // final echo with decorative counters
      for (var c=0;c<1;c++){
        op("\n-- (obfuscated output complete) --");
      }
    })(null);

    // done
  })();
})(); 