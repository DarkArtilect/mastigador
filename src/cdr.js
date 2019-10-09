const chalk = require("chalk");
const fs = require("fs");
const csvjson = require("csvjson");

const database = require("./mongodb");

const process = (serverType, cdrFile) => {
  console.log("Reading " + cdrFile + " file from " + serverType + " server");

  loadCDRFile(cdrFile, cdrFileContent => {
    console.log(chalk.green.inverse("CDR file loaded"));

    const convertToObjOptions = {
      delimiter: ",",
      quote: '"' // remove " caracter from original file field names (e.g. "SessionID")
    };

    const jsonObj = csvjson.toObject(cdrFileContent, convertToObjOptions);

    // create a list with all CDRs with only fields necessary to CGRateS
    const cdrsArray = []; // List containing all CDRs parsed from parseJSONCDR function
    jsonObj.forEach(element => {
      const cdrData = parseJSONCDR(serverType, element);

      if (cdrData) {
        cdrsArray.push(cdrData);
      }
    });

    // set options for csvjson.toCSV
    const convertToCsvOptions = {
      delimiter: ",",
      wrap: false
    };

    // test
    const collection = "SBC-test";

    // insert parsed CDRs to MongoDB for future searches
    database.saveCDRtoDatabase(collection, cdrsArray);

    const cdrFinal = csvjson.toCSV(cdrsArray, convertToCsvOptions);
    saveCDRtoFile(cdrFinal);
    //console.log(chalk.green.inverse("Parsed CDR written to file"));
  });
};

// Load CSV file and convert it into a JSON object
const loadCDRFile = (cdrFile, callback) => {
  fs.readFile(cdrFile, "utf-8", (error, cdrFileContent) => {
    if (error) {
      console.log(error);
      throw new Error(error); // TODO: return an empty array
    }
    callback(cdrFileContent);
  });
};

// this function receives the full CDR and gives back only the fields necessary to CGRateS
const parseJSONCDR = (serverType, element) => {
  if (serverType === "SBC") {
    const cdrTemplate = {
      callID: element.SessionID,
      caller: element.From,
      callee: element.To,
      initialRingTime: element.SetupTime,
      answerTime: element.ConnectTime,
      callDuration: element.Duration,
      sipCarrier: element.TermGW,
      callDirection: element.callType
    };
    return cdrTemplate;
  }

  return;
};

const saveCDRtoFile = cdrs => {
  fs.writeFileSync("cdrs.final", cdrs);
};

module.exports = {
  process: process
};
