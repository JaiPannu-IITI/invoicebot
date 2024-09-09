const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");
const images = require("../svggenerator/download.json")

async function practical(data, pdfPath) {
  

  let htmlContent = `
     <html>
      <head>
        <title>Practicle File</title>
        <style>
            img {
              width: 70%; 
              height: 3.33%;
              position: relative;
              left: 0;
              margin-bottom: 10px;
            }
        </style>
    </head>
    <body>
   <div style="">
        
  `;

  images.forEach((image) => {
    // Use the server URL (e.g., http://localhost:8080) instead of file://
    const imageUrl = `http://localhost:8080/svggenerator/downloads/${image}`;

    htmlContent += `
    <img src="${imageUrl}" alt="Image" />
    `;
});


    htmlContent += `
    </div>
    </body>
    </html>
  `;
  




  // Set the path for the output PDF
  const outputPath = path.join(__dirname, "practical.pdf");

  // Launch a headless browser using Puppeteer
  const browser = await puppeteer.launch({
    args: ['--allow-file-access-from-files'],
  });
  const page = await browser.newPage();

  // Set the content of the page to the HTML content
  await page.setContent(htmlContent);

  // Generate the PDF and save it to the specified path
  await page.pdf({ path: outputPath, format: "A4" });

  

  // Close the browser
  await browser.close();

  console.log(`Practical generated and saved to ${outputPath}`);
}

const pdfPath = path.join(__dirname, "practical.pdf");
practical(pdfPath);
// Export the pdfInvoice function for compatibility with the rest of the project
module.exports = { practical };
