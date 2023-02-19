import fs from "fs";
const OleDoc = require('ole-doc').OleCompoundDoc;

// Read binary from ./example.IntLib
const buffer = fs.readFileSync("./example.IntLib");

// The first 8 bytes contain the Compound Document identifier
const compoundDocumentIdentifier = buffer.subarray(0, 8).toString("hex");

if (compoundDocumentIdentifier !== "d0cf11e0a1b11ae1") {
  throw new Error("Invalid Compound Document File");
} else {
  const doc = new OleDoc("./example3.IntLib");

  doc.on("error", (err) => {
    console.error(err);
  });

  doc.on("ready", () => {

    let IntLibJSON = {};

    let parameters: object = {};
    let pcblib: object = {};

    const parameterStream = doc.stream('Parameters   .bin')
    const parameterChunks = [];

    parameterStream.on('data', function(chunk) { parameterChunks.push(chunk); });
    parameterStream.on('error', function(error) { console.error(error); });

    parameterStream.on('end', function() {
      const buffer = Buffer.concat(parameterChunks);

      // Remove null bytes from the buffer
      const cleanBuffer = buffer.filter(byte => byte !== 0);

      cleanBuffer.toString().slice(2, -14).split('|').forEach(parameter => {
        const parameterDict = parameter.split('=', 1);
        parameters[parameterDict[0]] = parameterDict[1];
      });

      if ('Pin Count' in parameters) {
        const pinCountAndHeight = (parameters['Pin Count'] as string).replace('', '');
        console.log(pinCountAndHeight);
        parameters['Pin Count'] = {
          'Pin Count': pinCountAndHeight[0],
          'Height': pinCountAndHeight[1]
        }
      }

      if ('Pad Count' in parameters) {
        const padCountAndHeight = (parameters['Pad Count'] as string).replace('', '');
        parameters['Pad Count'] = {
          'Pad Count': padCountAndHeight[0],
          'Height': padCountAndHeight[1]
        }
      }

      IntLibJSON['Parameters'] = parameters;
      console.log(IntLibJSON);
    });

    const pcblibStream = doc.storage('PCBLib').stream('0.pcblib');
    const pcblibChunks = [];

    pcblibStream.on('data', function(chunk) { pcblibChunks.push(chunk); });
    pcblibStream.on('error', function(error) { console.error(error); });
  
    pcblibStream.on('end', function() {
      const buffer = Buffer.concat(pcblibChunks);

      // Remove null bytes from the buffer
      const cleanBuffer = buffer.filter(byte => byte !== 0);

      cleanBuffer.toString().split('|').forEach(line => {
        const lineDict = line.split('=');
        pcblib[lineDict[0]] = lineDict[1];
      });

      IntLibJSON['PCBLib'] = pcblib;

      //console.log(IntLibJSON);
    });
  });

  doc.read();
}