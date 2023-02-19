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

    type Parameters = {
      [key: string]: string;
    }

    let parameters: Parameters = {};
    let pcblib: Parameters = {};

    const parameterStream = doc.stream('Parameters   .bin')
    parameterStream.on('data', function(chunk) { chunks.push(chunk); });
    parameterStream.on('error', function(error) { console.error(error); });

    parameterStream.on('end', function() {
      const buffer = Buffer.concat(chunks);

      // Remove null bytes from the buffer
      const cleanBuffer = buffer.filter(byte => byte !== 0);

      cleanBuffer.toString().slice(2).split('|').forEach(parameter => {
        const parameterDict = parameter.split('=');
        parameters[parameterDict[0]] = parameterDict[1];
      });

      if ('Pin Count' in parameters && parameters['Pin Count'].includes("\x16Height")) {

        // Remove the trailing "\x16Height" from the Pin Count
        parameters['Pin Count'] = parameters['Pin Count'].slice(0, -7);
      }

      console.log(parameters);

      IntLibJSON['Parameters'] = parameters;
      console.log(IntLibJSON);
    });

    /*const pcblibStream = doc.storage('PCBLib').stream('0.pcblib');
    pcblibStream.on('data', function(chunk) { chunks.push(chunk); });
    pcblibStream.on('error', function(error) { console.error(error); });
  
    pcblibStream.on('end', function() {
      const buffer = Buffer.concat(chunks);

      // Remove null bytes from the buffer
      const cleanBuffer = buffer.filter(byte => byte !== 0);

      cleanBuffer.toString().forEach(line => {
        const lineDict = line.split('=');
        pcblib[lineDict[0]] = lineDict[1];
      });

      //console.log(pcblib);
    });*/
  });

  doc.read();
}