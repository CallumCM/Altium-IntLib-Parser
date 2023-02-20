# main.ts
- `main.ts` includes functions for managing and reading .IntLib files

# How to run
- `npm start` will do nothing at the because everything in main.ts is abstracted to a function
- `npm test` will run through each .IntLib file, and use a pre-extracted version from 7zip to compare data
- The `readIntLib()` function returns `Parameters` and `RawParameters`. `RawParameters` is for testing, and contains the raw contents of Parameters.bin, whereas Parameters contains a JSON representation of Parameters.bin

#readIntLib()
Returns an object that resembles this: ```json
{
    "Parameters": parameters,
    "RawParameters": "",
    "PCBLib": await readFileFromOLE('/PCBLib/0.pcblib', doc),
    "SchLib": await readFileFromOLE('/SchLib/0.schlib', doc)
}
```