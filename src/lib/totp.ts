const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function generateTotpSecret(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(20));
  return base32Encode(bytes);
}

function base32Encode(bytes: Uint8Array): string {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32Decode(secret: string): Uint8Array {
  const cleaned = secret.replace(/=+$/, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of cleaned) {
    const idx = BASE32.indexOf(char);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return new Uint8Array(bytes);
}

async function hotp(secret: string, counter: number): Promise<string> {
  const keyBytes = base32Decode(secret);
  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes as BufferSource,
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );
  const buf = new ArrayBuffer(8);
  const view = new DataView(buf);
  view.setUint32(4, counter);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, buf));
  const offset = sig[sig.length - 1] & 0x0f;
  const code =
    ((sig[offset] & 0x7f) << 24) |
    ((sig[offset + 1] & 0xff) << 16) |
    ((sig[offset + 2] & 0xff) << 8) |
    (sig[offset + 3] & 0xff);
  return String(code % 1_000_000).padStart(6, "0");
}

export async function currentTotp(secret: string): Promise<string> {
  const counter = Math.floor(Date.now() / 1000 / 30);
  return hotp(secret, counter);
}

export async function verifyTotp(secret: string, code: string): Promise<boolean> {
  const trimmed = code.replace(/\s/g, "");
  if (!/^\d{6}$/.test(trimmed)) return false;
  const counter = Math.floor(Date.now() / 1000 / 30);
  for (let i = -1; i <= 1; i += 1) {
    if ((await hotp(secret, counter + i)) === trimmed) return true;
  }
  return false;
}

export function otpauthUri(secret: string, account: string): string {
  const label = encodeURIComponent(`Kisan Setu:${account}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent("Kisan Setu")}&digits=6&period=30`;
}
