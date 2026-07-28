import mongoose from "mongoose";
import { AppLogger } from "#sg/lib/app-logger";
import { isDev } from "#shared/constants/base";

export default async () => {
  const log = AppLogger("mongoose");
  const { MONGO_URI, MONGO_DB_NAME } = useRuntimeConfig();
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: MONGO_DB_NAME,
      autoIndex: isDev,
      autoCreate: isDev,
    });
    log.info("Connected to MongoDB");
  } catch (e) {
    log.error(e);
  }
};
