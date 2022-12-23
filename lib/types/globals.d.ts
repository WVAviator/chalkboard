import { MongoClient } from 'mongodb';
declare global {
  var mongoose = {
    conn: typeof mongoose,
  };
  var _mongoClientPromise: Promise<MongoClient>;
}
