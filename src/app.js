const chalk = require("chalk");
const yargs = require("yargs");
const cdr = require("./cdr");

// set CDR Processor version
yargs.version("0.0.1");

yargs.command({
  command: "parse",
  describe: "parse new CDR file",
  builder: {
    serverType: {
      describe: "possible values: SBC, VOICIS, iPBX, MGW or Beronet",
      demandOption: true,
      type: "string"
    },
    cdrFile: {
      describe: "CDR file name",
      demandOption: true,
      type: "string"
    }
  },
  handler(argv) {
    cdr.process(argv.serverType, argv.cdrFile);
  }
});

yargs.parse();
