import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string | undefined;
const dbName = process.env.MONGODB_DB as string | undefined;

if (!uri) {
  throw new Error("Missing MONGODB_URI environment variable");
}
if (!dbName) {
  throw new Error("Missing MONGODB_DB environment variable");
}

// Strongly typed global cache to avoid re-instantiating the client in dev
const globalForMongo = globalThis as unknown as {
  _mongoClient?: MongoClient;
  _mongoDb?: Db;
};

let cachedClient: MongoClient | null = globalForMongo._mongoClient ?? null;
let cachedDb: Db | null = globalForMongo._mongoDb ?? null;

export async function getMongoClient(): Promise<MongoClient> {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri as string);
  cachedClient = await client.connect();
  globalForMongo._mongoClient = cachedClient;
  return cachedClient;
}

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;
  const client = await getMongoClient();
  const db = client.db(dbName as string);
  cachedDb = db;
  globalForMongo._mongoDb = cachedDb;
  return db;
}
