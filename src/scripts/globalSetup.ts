import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";

export = async function globalSetup() {
  // Config to decided if an mongodb-memory-server instance should be used
  // it's needed in global space, because we don't want to create a new instance every test-suite
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  (global as any).__MONGOINSTANCE = instance;
  process.env.MONGO_URI = uri.slice(0, uri.lastIndexOf("/"));

  // The following is to make sure the database is clean before an test starts
  await mongoose.connect(`${process.env.MONGO_URI}/identity-manager`);
  await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
};
