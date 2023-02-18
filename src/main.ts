import fs from "fs";
const OleDoc = require('ole-doc').OleCompoundDoc;

// Read binary from ./example.IntLib
const buffer = fs.readFileSync("./example.IntLib");

// The first 8 bytes contain the Compound Document identifier
const compoundDocumentIdentifier = buffer.subarray(0, 8).toString("hex");

if (compoundDocumentIdentifier !== "d0cf11e0a1b11ae1") {
  throw new Error("Invalid Compound Document File");
} else {
  const doc = new OleDoc("./example.IntLib");

  doc.on("error", (err) => {
    console.error(err);
  });

  doc.on("ready", () => {
    let chunks = [];

    let IntLibJSON = {};

    let parameters: object = {};

    //const stream = doc._rootStorage._dirEntry.streams['Version.Txt'];
    const stream = doc.stream('Parameters   .bin')
    stream.on('data', function(chunk) { chunks.push(chunk); });
    stream.on('error', function(error) { console.error(error); });

    stream.on('end', function() {
      const buffer = Buffer.concat(chunks);

      // Remove all null bytes
      const nonNullBuffer = Buffer.from(buffer.filter(byte => byte !== 0));

      parameters = {};
      nonNullBuffer.toString("utf8").slice(2).split('|').forEach(parameter => {
        const parameterDict = parameter.split('=');
        parameters[parameterDict[0]] = parameterDict[1];
      });

      // Remove the trailing "\x16Height" from the Pin Count
      parameters['Pin Count'] = parameters['Pin Count'].slice(0, -7);

      console.log(parameters);

      IntLibJSON['Parameters'] = parameters;

      // Write the JSON to a file
      //fs.writeFileSync("./output.json", JSON.stringify(IntLibJSON, null, 2));
    });
  });

  doc.read();
}