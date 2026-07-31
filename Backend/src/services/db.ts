import { MongoClient } from "mongodb";

let client: MongoClient | null = null;
let connected = false;

function getUri() {
  return process.env.MONGO_URI;
}

async function resolveSrvViaDoH(uri: string) {
  const base = uri.replace(/^mongodb\+srv:\/\//, "").split("/")[0];

  const [srvRes, txtRes] = await Promise.all([
    fetch(`https://dns.google/resolve?name=_mongodb._tcp.${base}&type=SRV`).then((r) => r.json()),
    fetch(`https://dns.google/resolve?name=${base}&type=TXT`).then((r) => r.json()),
  ]);

  const srvHosts = (srvRes.Answer ?? [])
    .map((a: { data: string }) => {
      const [prio, weight, port, host] = a.data.trim().split(/\s+/);
      return { priority: Number(prio), weight: Number(weight), port: Number(port), host: host.replace(/\.$/, "") };
    })
    .sort((a: { priority: number }, b: { priority: number }) => a.priority - b.priority);

  if (srvHosts.length === 0) throw new Error("No SRV records found via DoH");

  const txtData = (txtRes.Answer ?? [])
    .flatMap((a: { data: string }) => a.data.replace(/"/g, "").split("&"))
    .reduce((acc: Record<string, string>, pair: string) => {
      const [k, v] = pair.split("=");
      if (k) acc[k] = v ?? "";
      return acc;
    }, {});

  const replicaSet = txtData.replicaSet ? `&replicaSet=${txtData.replicaSet}` : "";
  const authSource = txtData.authSource ?? "admin";
  const hosts = srvHosts.map((s: { host: string; port: number }) => `${s.host}:${s.port}`).join(",");

  const creds = uri.split("//")[1].split("@")[0];
  const dbName = uri.includes("/") ? uri.split("//")[1].split("/")[1]?.split("?")[0] : undefined;

  return `mongodb://${creds}@${hosts}/${dbName ?? ""}?tls=true&authSource=${authSource}${replicaSet}&retryWrites=true`;
}

async function connectMongo(connectionUri: string) {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const c = new MongoClient(connectionUri, { serverSelectionTimeoutMS: 12000 });
      await c.connect();
      await c.db().command({ ping: 1 });
      return c;
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }
  throw lastErr;
}

export async function connectDb() {
  const uri = getUri();
  if (!uri) {
    console.log("[portfolio-api] MONGO_URI not set — running without a database");
    return;
  }
  try {
    client = await connectMongo(uri);
    connected = true;
    console.log("[portfolio-api] MongoDB connected (SRV)");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("querySrv") || msg.includes("getaddrinfo") || msg.includes("ECONNREFUSED") || msg.includes("ENOTFOUND")) {
      console.warn("[portfolio-api] SRV lookup failed (" + msg.split(" ")[0] + ") — retrying via DNS-over-HTTPS");
      try {
        const directUri = await resolveSrvViaDoH(uri);
        client = await connectMongo(directUri);
        connected = true;
        console.log("[portfolio-api] MongoDB connected (DoH fallback)");
      } catch (err2) {
        console.warn("[portfolio-api] MongoDB DoH fallback failed (continuing without db):", err2);
        client = null;
        connected = false;
      }
    } else {
      console.warn("[portfolio-api] MongoDB connection failed (continuing without db):", msg);
      client = null;
      connected = false;
    }
  }
}

export function isDbConnected() {
  return connected;
}

export function getDb() {
  if (!client || !connected) return null;
  return client.db();
}
