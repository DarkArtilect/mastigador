const mongodb = require("mongodb");
const { MongoClient, ObjectID } = require("mongodb");

const mongodbIP = "127.0.0.1";
const connectionURL = "mongodb://" + mongodbIP + ":27017";
const databaseName = "CDRs";
const collectionName = "SBC";

const jsonObject = {
  name: "Ricardo Santos",
  age: 36
};

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (error, client) => {
    if (error) {
      return console.log("Unable to connect to database"); // if error occours print error message and exit
    }

    const db = client.db(databaseName); // automatically create the collection

    insertCDRtoDatabase(jsonObject, collectionName, (error, result) => {});
  }
);

const insertCDRtoDatabase =
  (jsonObject,
  collectionName,
  callback => {
    //b.collection(collectionName).insertOne(jsonObject);
  });
