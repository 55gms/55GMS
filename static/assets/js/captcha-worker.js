// Solves the signup check off the main thread: finds the number n for which
// SHA-256(`${salt}.${n}`) equals the challenge. The server side is
// utils/captcha.js. Every message tried fits one SHA-256 block, so the hash
// is written out here for that case; it is several times faster than a
// crypto.subtle call per try, and works on pages without a secure context.

const K = new Int32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const W = new Int32Array(64);
const block = new Uint8Array(64);
const digest = new Int32Array(8);

// The longest message that still leaves room for the padding in one block.
const MAX_MESSAGE_LENGTH = 55;

// Hashes the padded message in `block` into `digest`.
function hashBlock() {
  for (let i = 0; i < 16; i++) {
    const at = i * 4;
    W[i] =
      (block[at] << 24) |
      (block[at + 1] << 16) |
      (block[at + 2] << 8) |
      block[at + 3];
  }
  for (let i = 16; i < 64; i++) {
    const x = W[i - 15];
    const y = W[i - 2];
    const s0 = ((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3);
    const s1 = ((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10);
    W[i] = (W[i - 16] + s0 + W[i - 7] + s1) | 0;
  }

  let a = 0x6a09e667;
  let b = 0xbb67ae85 | 0;
  let c = 0x3c6ef372;
  let d = 0xa54ff53a | 0;
  let e = 0x510e527f;
  let f = 0x9b05688c | 0;
  let g = 0x1f83d9ab;
  let h = 0x5be0cd19;

  for (let i = 0; i < 64; i++) {
    const S1 =
      ((e >>> 6) | (e << 26)) ^
      ((e >>> 11) | (e << 21)) ^
      ((e >>> 25) | (e << 7));
    const t1 = (h + S1 + ((e & f) ^ (~e & g)) + K[i] + W[i]) | 0;
    const S0 =
      ((a >>> 2) | (a << 30)) ^
      ((a >>> 13) | (a << 19)) ^
      ((a >>> 22) | (a << 10));
    const t2 = (S0 + ((a & b) ^ (a & c) ^ (b & c))) | 0;
    h = g;
    g = f;
    f = e;
    e = (d + t1) | 0;
    d = c;
    c = b;
    b = a;
    a = (t1 + t2) | 0;
  }

  digest[0] = (0x6a09e667 + a) | 0;
  digest[1] = (0xbb67ae85 + b) | 0;
  digest[2] = (0x3c6ef372 + c) | 0;
  digest[3] = (0xa54ff53a + d) | 0;
  digest[4] = (0x510e527f + e) | 0;
  digest[5] = (0x9b05688c + f) | 0;
  digest[6] = (0x1f83d9ab + g) | 0;
  digest[7] = (0x5be0cd19 + h) | 0;
}

function solve(salt, challenge, max) {
  const prefix = `${salt}.`;
  if (
    !/^[0-9a-f]{64}$/.test(challenge) ||
    prefix.length + String(max).length > MAX_MESSAGE_LENGTH
  ) {
    return null;
  }

  const target = new Int32Array(8);
  for (let i = 0; i < 8; i++) {
    target[i] = parseInt(challenge.slice(i * 8, i * 8 + 8), 16) | 0;
  }
  for (let i = 0; i < prefix.length; i++) block[i] = prefix.charCodeAt(i);

  for (let n = 0; n <= max; n++) {
    const digits = String(n);
    let length = prefix.length;
    for (let i = 0; i < digits.length; i++) {
      block[length++] = digits.charCodeAt(i);
    }
    // Padding: a 1 bit, zeros, then the message length in bits
    block[length] = 0x80;
    block.fill(0, length + 1, 62);
    block[62] = (length * 8) >>> 8;
    block[63] = (length * 8) & 0xff;

    hashBlock();
    if (digest[0] !== target[0]) continue;
    let same = true;
    for (let i = 1; i < 8; i++) {
      if (digest[i] !== target[i]) same = false;
    }
    if (same) return n;
  }
  return null;
}

self.onmessage = (event) => {
  const { salt, challenge, max } = event.data;
  self.postMessage({ number: solve(String(salt), String(challenge), max) });
};
