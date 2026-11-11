import { Redis } from "@upstash/redis";

const KEY = "quejas:rodrigo";

// Vercel's Upstash integration may expose KV_* or UPSTASH_* variables; accept both.
function client() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function guardarQueja(queja) {
  const redis = client();
  if (!redis) throw new Error("Base de datos no configurada");
  await redis.lpush(KEY, JSON.stringify(queja));
  return await redis.llen(KEY);
}

export async function leerQuejas() {
  const redis = client();
  if (!redis) throw new Error("Base de datos no configurada");
  const items = await redis.lrange(KEY, 0, -1);
  return items.map((i) => (typeof i === "string" ? JSON.parse(i) : i));
}

export async function contarQuejas() {
  const redis = client();
  if (!redis) return 0;
  return await redis.llen(KEY);
}

export async function borrarQueja(id) {
  const redis = client();
  if (!redis) throw new Error("Base de datos no configurada");
  const items = await redis.lrange(KEY, 0, -1);
  for (const raw of items) {
    const q = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (q.id === id) {
      await redis.lrem(KEY, 1, typeof raw === "string" ? raw : JSON.stringify(raw));
      return true;
    }
  }
  return false;
}
