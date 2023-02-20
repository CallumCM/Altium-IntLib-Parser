import fs from "fs";
import { readIntLib } from "./main";

fs.readdirSync("./examples").forEach((file) => {
  if (file.endsWith('.IntLib')) {
    test(`Read ${file} and compare metadata/pcblib/schlib files with the corresponding file in the example-x directory`, async () => {
      const IntLibPath = `./examples/${file}`;
      const output = await readIntLib(IntLibPath);

      // Read the expected output from the pre-extracted example-x directory
      const expectedParameters = fs.readFileSync(`./examples/${file.replace(/\.[^/.]+$/, "")}/Parameters   .bin`, 'utf8');
      const expectedPCBLib = Buffer.from(fs.readFileSync(`./examples/${file.replace(/\.[^/.]+$/, "")}/PCBLib/0.pcblib`));
      const expectedSchLib = Buffer.from(fs.readFileSync(`./examples/${file.replace(/\.[^/.]+$/, "")}/SchLib/0.schlib`));

      // RawParameters is the direct output from the Parameters   .bin file
      // parameters is the processed JSON output from the Parameters   .bin file
      expect(output.RawParameters).toEqual(expectedParameters);
      expect(output.PCBLib).toEqual(expectedPCBLib);
      expect(output.SchLib).toEqual(expectedSchLib);
    });
  }
});