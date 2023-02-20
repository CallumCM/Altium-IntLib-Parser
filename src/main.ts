import fs from "fs";

// There's an override in package.json changing the dependancy version of underscore
// to patch the security vulnerability
const OleDoc = require('ole-doc').OleCompoundDoc;

interface IntLibFile {
  Parameters: object;
  PCBLib: Buffer;
  SCHLib: Buffer;
  Model: Buffer;
}

async function readFileFromOLE(filepath: string, oledoc): Promise<Buffer> {
  return new Promise((resolve, reject) => {

    // Filepath will be something like '/PCBLib/0.pcblib'
    // Split the filepath into storage(s) and a stream
    const fileArray = filepath.split('/');

    const storages = fileArray.slice(1, -1);
    const stream = fileArray.slice(-1)[0];

    let fileStream;

    if (storages.length === 0) {

      // If the file is in the root directory, we can skip finding the storage
      fileStream = oledoc.stream(stream);
    } else {
      let storage = oledoc.storage(storages[0]);
  
      // If there are multiple storages, recursively loop through them to get the final storage
      if (storages.length > 1) {
        for (let i = 1; i < storages.length; i++) {
          storage = storage.storage(storages[i]);
        }
      }
  
      fileStream = storage.stream(stream);
    }
    const chunks = [];

    fileStream.on('data', function(chunk) { chunks.push(chunk); });
    fileStream.on('error', function(error) { reject(error); });

    fileStream.on('end', function() {
      const buffer = Buffer.concat(chunks);
      resolve(buffer);
    });
  });
}

export async function readIntLib(IntLibPath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    
    // The first 8 bytes contain the Compound Document identifier
    const compoundDocumentIdentifier = fs.readFileSync(
      IntLibPath).subarray(0, 8).toString("hex");
    
    if (compoundDocumentIdentifier !== "d0cf11e0a1b11ae1") {
      throw new Error("Invalid Compound Document File");
    } else {
      const doc = new OleDoc(IntLibPath);
    
      doc.on("error", (err) => {
        reject(err);
      });
    
      doc.on("ready", async () => {
        let parameters: object = {};
    
        // Read the metadata and process it into JSON
        const metadata = await readFileFromOLE('/Parameters   .bin', doc);
    
        // Remove null bytes from the buffer
        const cleanMetadata = metadata.filter(byte => byte !== 0);
  
        // First two characters are not important
        // and Pad Count is repeated at the end of the string, so we can slice it off
        const groupedParams = cleanMetadata.toString().slice(2).split('|').slice(0, -1);
  
        for (let i = 0; i < groupedParams.length; i++) {
          const parameterDict = groupedParams[i].split('=');
          
          if (parameterDict[0] === 'Pin Count' || parameterDict[0] === 'Pad Count') {
  
            // Pin Count and Pad Count will be "Pad Count=15Height=0"
            // We need to split the string into two parts
            const countAndHeight = [parameterDict[1].split('')[0], parameterDict[2]];
    
            // Pin Count or Pad Count
            const name = parameterDict[0]
  
            /*
              {
                "Pin Count": {
                  "Pin Count": "15",
                  "Height": "0"
                }
              }
            */
            parameters[name] = {
              [name]: countAndHeight[0],
              'Height': countAndHeight[1]
            };
  
          } else {
            parameters[parameterDict[0]] = parameterDict[1];
          }
        }

        resolve({
          "Parameters": parameters,
          "PCBLib": await readFileFromOLE('/PCBLib/0.pcblib', doc),
          "SCHLib": await readFileFromOLE('/SchLib/0.schlib', doc)
        });
      });
    
      doc.read();
    }
  });
}

readIntLib("./example3.IntLib").then((result) => {
  console.log(result);
}).catch((err) => { console.error(err); });