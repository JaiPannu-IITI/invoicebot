<div style="display: flex; justify-content: center; width: 100%; text-align:center;">
        <div><img src="https://github.com/user-attachments/assets/09be03c9-b0ae-42e7-90e8-d3b6c02ba61e" alt="Company Logo" style="width: 200px;"></div>
        <h1>TaxDownCo.</h1>
</div>

A Simple Tax Invoice Generator Bot that assists small businesses or freelancers in generating
tax invoices for sales transactions. The bot will guide the user through entering necessary invoice
details and generate a PDF invoice that includes tax information, which can be shared with customers
via WhatsApp.

<h2>Setup Bot</h2>
1. Clone repository

2. Install modules

   <div>

        npm install
   </div>

3. Create .env with following details:
 <div>

         TWILIO_ACCOUNT_SID= [account_sid]        
         TWILIO_AUTH_TOKEN= [auth_token]
         TWILIO_WHATSAPP_NUMBER=whatsapp: [botwhatsappnumber]
         PORT=3000
 </div>

 4. Run ngrok
<div>

        ngrok http 3000
</div>

5. Configure twilio sandbox to post incoming message to
<div>

        https://[ngrok].ngrok-free.app/whatsapp
</div>

6. Scan the QR code and send the default connection message to sandbox before starting to connect to bot

<img width="200px" alt="image" src="https://github.com/user-attachments/assets/1fa4c1c7-55c8-4560-b785-ee00a2db70da">


<h1>Previews:</h1>

<h2>1. Create New Invoice</h2>
        
![image](https://github.com/user-attachments/assets/00ea7ac2-e234-4d8e-9e23-1864c3a1e452)

![image](https://github.com/user-attachments/assets/30bae91c-6745-4c77-9639-9a5470d86611)

![image](https://github.com/user-attachments/assets/8362ba1c-8537-4544-8430-768bae70d25d)

![image](https://github.com/user-attachments/assets/7c1ad024-5a45-4109-b636-d0fc63ab5288)

<h2>Generated invoice:</h2>

![image](https://github.com/user-attachments/assets/9f3735b4-f452-44ac-a058-c0aa567f2004)

<h2>2. View Last Invoice</h2>

![image](https://github.com/user-attachments/assets/c0839784-efb8-4311-bb91-390905c58656)

<h2>Last generated invoice:</h2>

![image](https://github.com/user-attachments/assets/9f3735b4-f452-44ac-a058-c0aa567f2004)

