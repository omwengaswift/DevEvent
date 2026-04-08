import mongoose from 'mongoose';

// Define the shape of the cache we keep on globalThis to avoid creating
// multiple connections during development (Next.js hot reloads can re-run code).
type MongooseCache = {
  // The active connection object (null until connected)
  conn: mongoose.Connection | null;
  // The promise for an in-flight connection attempt (so parallel callers share it)
  promise: Promise<typeof mongoose> | null;
};

// Augment globalThis with a typed cache property so we don't use `any`.
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Name of the environment variable that holds the MongoDB connection string.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Fail fast with a clear error if the environment variable is missing.
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Initialize the cache on the global object in a safe, typed way.
if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = { conn: null, promise: null };
}

/**
 * Connects to MongoDB using Mongoose and returns the active Connection.
 *
 * - Caches both the connection and an in-flight Promise on `globalThis` so that
 *   during development (when modules can be re-evaluated) we don't open
 *   duplicate connections.
 * - Uses typed values; does not use `any`.
 *
 * Usage:
 *   import connectToDatabase from '@/lib/mongodb';
 *   const db = await connectToDatabase();
 *   // use db (a mongoose.Connection) or rely on mongoose.models / mongoose.model
 */
export default async function connectToDatabase(): Promise<mongoose.Connection> {
  // Use a local reference to the cache to keep TypeScript happy across
  // await boundaries. This avoids "possibly undefined" errors because the
  // local `cache` stays non-undefined for the lifetime of the function.
  const cache: MongooseCache = globalThis.mongooseCache ?? (globalThis.mongooseCache = { conn: null, promise: null });

  // Fast path: return existing connection if present.
  if (cache.conn) {
    return cache.conn;
  }

  // Ensure TypeScript knows the URI is a string. We validated at module
  // initialization above and threw if it was missing; assert here to satisfy
  // the compiler without changing runtime behavior.
  const uri: string = MONGODB_URI as string;

  // If there's no in-flight connection attempt, start one and cache the promise.
  if (!cache.promise) {
    // Use mongoose.connect which returns a Promise<typeof mongoose>
    cache.promise = mongoose
      .connect(uri, {
        // Recommended option: don't buffer commands when not connected. Adjust as needed.
        bufferCommands: false,
      })
      .then((m) => m);
  }

  // Await the in-flight connection attempt and store the resulting connection.
  const mongooseInstance = await cache.promise;
  cache.conn = mongooseInstance.connection;

  // Return the live connection object.
  return cache.conn;
}
