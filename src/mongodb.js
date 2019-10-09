const mongodb = require("mongodb");
const { MongoClient, ObjectID } = require("mongodb");

const mongodbIP = "127.0.0.1";
const connectionURL = "mongodb://" + mongodbIP + ":27017";
const databaseName = "CDRs";

const saveCDRtoDatabase = (collection, cdrFinal) => {
  MongoClient.connect(
    connectionURL,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (error, client) => {
      if (error) {
        return console.log("Unable to connect to database"); // if error occours print error message and exit
      }

      const db = client.db(databaseName); // automatically create the collection
      //
      db.collection(collection)
        .insertMany(cdrFinal)
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.log(error);
        });
    }
  );
};

module.exports = {
  saveCDRtoDatabase: saveCDRtoDatabase
};
