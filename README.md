# main.ts
- `main.ts` includes functions for managing and reading .IntLib files

# How to run
- `npm start` will do nothing at the because everything in main.ts is abstracted to a function
- `npm test` will run through each .IntLib file, and use a pre-extracted version from 7zip to compare data
- The `readIntLib()` function returns `Parameters` and `RawParameters`. `RawParameters` is for testing, and contains the raw contents of Parameters.bin, whereas Parameters contains a JSON representation of Parameters.bin

# readIntLib()
Returns an object that resembles this:
```json
{
    "Parameters": {
      "Availability": "Unavailable",
      "Comment": "*",
      "Component Kind": "Standard",
      "Description": "SMD WI-FI IC, ESP32-S2, SINGAL-C",
      "Footprint": "QFN40P700X700X90-57T400N",
      "Library Reference": "ESP32-S2",
      "MF": "Espressif Systems",
      "MP": "ESP32-S2",
      "Package": "None",
      "Price": "None",
      "SnapEDA_Link": "https://www.snapeda.com/parts/ESP32-S2/Espressif%20Systems/view-part/4571535/?ref",
      "Value": "*",
      "Designator": "ESP32-S2",
      "Component Type": "Standard",
      "Pin Count": "57",
      "Height": 0,
      "Pad Count": "57"
    },
    "RawParameters": "",
    "PCBLib": [bytes],
    "SchLib": [bytes]
}
```
