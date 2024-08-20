const express = require("express");
const bodyParser = require("body-parser");
const { MessagingResponse } = require("twilio").twiml;
const { pdfInvoice } = require("./pdfInvoice");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const userProgress = {};

const data = {
  name: "",
  address: "",
  item: "",
  quantity: 0,
  price: 0,
  tax: 0,
  notes: "",
};

function capitalizeFirstLetter(string) {
  if (string.length === 0) return string; // Handle empty strings
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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
      "Welcome to the Tax Invoice Generator Bot! How can I assist you today? \n 1. Create New Invoice \n 2. View Last Invoice "
    );
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "options";
  } else if (
    (messageBody === "1" && progress === "options") ||
    (messageBody === "create new invoice" && progress === "options")
  ) {
    twiml.message("Please enter the customer's name. ");
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "name";
  } else if (
    (messageBody === "2" && progress === "options") ||
    (messageBody === "view last invoice" && progress === "options")
  ) {
    const pdfPath = path.join(__dirname, "invoice.pdf");
    const message = twiml.message("Here is your last invoice:");
    message.media(`https://${req.headers.host}/invoice.pdf`);

    twiml.message(`Thank you for using TaxDown Co. Bot`);
    twiml.message(
      `Would you like to create a new invoice? Type "Hi" to start a new conversation.`
    );

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "none";
  } else if (progress === "name") {
    data.name = capitalizeFirstLetter(messageBody);
    twiml.message(
      `Please enter the customer's address (optional) or type "none" `
    );
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "address";
  } else if (progress === "address") {
    data.address = messageBody;
    twiml.message(`Please enter the item description`);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "description";
  } else if (progress === "description") {
    data.item = capitalizeFirstLetter(messageBody);
    twiml.message(`How many units or hours?`);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "quantity";
  } else if (progress === "quantity") {
    data.quantity = parseInt(messageBody, 10);
    twiml.message(`What is the price per unit or hour?`);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "price";
  } else if (progress === "price") {
    data.price = parseInt(messageBody, 10);
    twiml.message(`Please enter the applicable tax rate (e.g., 10%).`);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "tax";
  } else if (progress === "tax") {
    data.tax = parseInt(messageBody, 10);
    twiml.message(
      `Please enter any additional notes (optional) or type "none".`
    );
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "notes";
  } else if (progress === "notes") {
    data.notes = messageBody;
    twiml.message(
      `Generating your invoice for ${data.name}, ${data.item} at ${data.price} per unit, with a ${data.tax}% tax rate, for ${data.quantity} units.`
    );

    // userProgress[fromNumber] = "confirm";

    const pdfPath = path.join(__dirname, "invoice.pdf");
    try {
      await pdfInvoice(data, pdfPath);
    } catch (error) {
      console.error("Error generating PDF: ", error);
      twiml.message("Error generating PDF. Please try again.");
      res.writeHead(200, { "Content-Type": "text/xml" });
      res.end(twiml.toString());
      return;
    }

    const message = twiml.message("Here is your invoice:");
    message.media(`https://${req.headers.host}/invoice.pdf`);

    twiml.message(`Thank you for using TaxDown Co. Bot`);
    twiml.message(
      `Would you like to create another invoice? Type "Hi" to start a new conversation.`
    );

    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
    userProgress[fromNumber] = "none";
  } else {
    twiml.message('Please type "Hi" to start conversation');
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  }

  console.log("finished");
  console.log("Progress: ", progress);
});

app.use("/invoice.pdf", express.static(path.join(__dirname, "invoice.pdf")));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
