const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const MONGODB_URL =
  "mongodb+srv://inamaslam003:inam_003@clusterone.l9tqz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterOne";

const mongoConnect = (callback) => {
  MongoClient.connect(MONGODB_URL)
    .then((client) => {
      console.log("Connected to MongoDB");
      _db = client.db("homify");
      callback();
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
      throw error;
    });
};

const getDb = () => {
  if (!_db) {
    console.log("No database found!");
  }
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
