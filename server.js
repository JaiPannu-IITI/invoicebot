const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;
const { practical } = require("./practical");
const path = require("path");
const fs = require("fs").promises;
const svggenerator = require("../texttosvg/loop");
const extractText = require("../textextraction/local-lembda");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const userProgress = {};

const data = {
  name: ""
};



app.post("/whatsapp", async (req, res) => {
  
  const twiml = new MessagingResponse();
  const messageBody = req.body.Body.trim().toLowerCase();
  const fromNumber = req.body.From;

  if (!userProgress[fromNumber]) {
    userProgress[fromNumber] = "none";
  }

  let progress = userProgress[fromNumber];

  console.log("Message Body: ", messageBody);

  if (messageBody === "hi" && progress === "none") {
    twiml.message(
      "Welcome to practical file generator.Please enter text to generate practical file."
    );
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "name";
  } else if (progress === "name") {
    data.name = messageBody;
    
    twiml.message(
      `Generating your practical file.`
    );


    try {
    
      await fs.writeFile(
        path.join(__dirname, "../textextraction/experiment.txt"), 
        data.name
      );
      await extractText();
      await sleep(10000);
      await svggenerator();
      const pdfPath = path.join(__dirname, "practical.pdf");
      await practical(data, pdfPath);
      await sleep(10000);
    } catch (error) {
      console.error("Error during file write or text extraction: ", error);
      twiml.message("Error generating the practical file. Please try again.");
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
      return;
    }


    const message = twiml.message("Here is your practical:");
    message.media(`https://${req.headers.host}/practical.pdf`);

    twiml.message(`Thank you for using Practical file generator!`);
    twiml.message(
      `Would you like to create another practical file? Type "Hi" to start a new conversation.`
    );

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "none";
  } else {
    twiml.message('Please type "Hi" to start conversation');
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "none";
  }

  console.log("finished");
  console.log("Progress: ", progress);
});

app.use("/practical.pdf", express.static(path.join(__dirname, "practical.pdf")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
