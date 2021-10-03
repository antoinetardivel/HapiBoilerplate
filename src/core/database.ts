import * as mongoose from "mongoose";
import { db } from "../config/config";

const dbURI = encodeURI(
  `mongodb+srv://${db.user}:${db.password}@${db.host}/${db.name}?retryWrites=true&w=majority`
);

const options: mongoose.ConnectOptions = {
  //@ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const initDatabase = async () => {
  return mongoose.connect(dbURI, options);
};

mongoose.connection.on("connected", () => {
  console.info("Connected to ", db.name);
});

mongoose.connection.on("error", (err) => {
  console.error("Mongoose default connection error: " + err);
});

mongoose.connection.on("disconnected", () => {
  console.info("Mongoose default connection disconnected");
});

export default initDatabase;
