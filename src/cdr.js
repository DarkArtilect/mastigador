const chalk = require("chalk");
const fs = require("fs");
const csvjson = require("csvjson");
const ArrayList = require("arraylist");

const parseCDRFile = (serverType, cdrFile) => {
  console.log("Reading " + cdrFile + " file from " + serverType + " server");

  loadCDRFile(cdrFile, cdrFileContent => {
    console.log(chalk.green.inverse("CDR file loaded"));

    // convert cdrFileContent to a json object
    const jsonObject = (convertToJSONObject = cdrFileContent => {});

    var options = {
      delimiter: ",",
      quote: '"' // remove " caracter from original file field names (e.g. "SessionID")
    };
    const jsonObj = csvjson.toObject(cdrFileContent, options);

    // create a list with all CDRs with only fields necessary to CGRateS
    var cdrsArray = new ArrayList(); // List containing all CDRs parsed from parseJSONCDR function
    jsonObj.forEach(element => {
      parseJSONCDR(serverType, element, cdrData => {
        cdrsArray.add(cdrData);
      });
    });

    // set options for csvjson.toCSV
    var options = {
      delimiter: ",",
      wrap: false
    };
    const cdrFinal = csvjson.toCSV(cdrsArray, options);

    console.log(cdrFinal);
    saveCDRtoFile(cdrFinal);
    console.log(chalk.green.inverse("Parsed CDR written to file"));
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
const parseJSONCDR = (serverType, element, callback) => {
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
    callback(cdrTemplate);
  }
};

const saveCDRtoFile = cdrs => {
  fs.writeFileSync("cdrs.final", cdrs);
};

module.exports = {
  parseCDRFile: parseCDRFile
};
