const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

async function pdfInvoice(data, pdfPath) {
  // Define the HTML content for the invoice
  const companyName = "TaxDown Co.";

  let htmlContent = `
     <html>
    <head>
        <title>Tax Invoice</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
        </style>
    </head>
    <body>
    <div style=" display: flex ; justify-content: flex-start; gap: 30px ; padding: 10px; align-items: center;">
        <img src="https://github.com/user-attachments/assets/09be03c9-b0ae-42e7-90e8-d3b6c02ba61e" alt="Company Logo" style="width: 50px; height: auto;">
        <h1>${companyName}</h1>
    </div>
    
        <h2 style="width:100% ; text-align:center; ">Tax Invoice</h2>
     
        <table>
                <tr>
                    <td style="width:20%; border: none;">Customer Name</td>
                    <td style="width:5%; border: none;">:</td>
                    <td style="width:75%; border: none;">${data.name}</td>
                
                    
                </tr>
                
        
  `;

  if (data.address != "none") {
    htmlContent += `
  
  <tr>
                    <td style="width:20%; border: none;">Customer Address</td>
                    <td style="width:5%; border: none;">:</td>
                    <td style="width:75%; border: none;">${data.address}</td>
                    
                </tr>
  
  `;
  }
  htmlContent += `
  </table>
       
        <table>
            <thead>
                <tr>
                    <th style="width:20%;">Quantity</th>
                    <th style="width:40%;">Item</th>
                    <th style="width:40%;">Price</th>
                    
                </tr>
            </thead>
            <tbody>
                
                <tr>
                    <td>${data.quantity}</td>
                    <td>${data.item}</td>
                    <td>${data.currency}${data.price}</td>
                
                </tr>
                <tr>
                <td colspan = "3" style="border-right: none; border-left:none;"></td>
                </tr>

                 <tr>
                    <td colspan = "2">Subtotal</td>
                    <td >${data.currency}${data.quantity * data.price}</td>
                   
                    
                </tr>
               
                <tr>
                    <td colspan = "2">Tax (${data.tax}%)</td>
                    <td >${data.currency}${
    (data.quantity * data.price * data.tax) / 100
  }</td>
                </tr>
               
                 <tr>
                  
                    <td colspan = "2" style="font-weight: bold">Total Amount Due</td>
                    <td style="font-weight: bold">${data.currency}${
    (data.quantity * data.price * data.tax) / 100 + data.quantity * data.price
  }</td>
                </tr>
               
               
            </tbody>
        </table>
       
        
   
    `;

  if (data.notes != "none") {
    htmlContent += `
      
      <p style="margin-top:40px;">Note: ${data.notes}</p>
      
      `;
  }

  htmlContent += `
      
       </body>
         </html>
      
      
      
      `;

  // Set the path for the output PDF
  const outputPath = path.join(__dirname, "invoice.pdf");

  // Launch a headless browser using Puppeteer
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Set the content of the page to the HTML content
  await page.setContent(htmlContent);

  // Generate the PDF and save it to the specified path
  await page.pdf({ path: outputPath, format: "A4" });

  // Close the browser
  await browser.close();

  console.log(`PDF generated and saved to ${outputPath}`);
}

// Export the pdfInvoice function for compatibility with the rest of the project
module.exports = { pdfInvoice };
