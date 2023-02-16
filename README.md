## Problem Description
I need a parser written in typescript that can load the contents of a **Altium .IntLib file** and turn them into a js object with proper interfaces/types.
<br /><br />
The code need to be able to run in a **webworker** and also **node** context. Therefore **can't depend on browser objects** like document and so on.
<br /><br />
## Acceptance Criteria
Take any *.IntLib file from snapeda.com (you can sign up for a free account) such as this one https://www.snapeda.com/parts/ESP32S2/Espressif%20Systems/view-part/?ref=search&t=ESP32 and parse it properly.
<br /><br />
Provide **jest unit tests** to prove that it works across ~20 different .IntLib files from snapeda (I can provide those)
<br /><br />
## Technical Details
There is a a little info on how to read the binary file here
<br /><br />
1. https://hackaday.com/2014/10/15/reverse-engineering-altium-files/
2. https://hackaday.io/project/3149-reverse-engineering-design-file-formats/details