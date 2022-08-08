# BTCPay Apply Fee API

## Information
#### This is a NodeJS project
#### API was built using ExpressJS

## How to use
#### Start the project with "npm start" 
#### If you want to run it development mode "npm run dev"
#### To apply a fee based on the invoice run a post request
###### -- '/applyfee'
###### body {
###### -- "viewstoreauth": "xxx", (BTCPay Server API Key)
###### -- "modifystoreauth": "xxx", (BTCPay Server API Key)
###### -- "viewinvoiceauth": "xxx", (BTCPay Server API Key)
###### -- "invoiceid": "xxx", (BTCPay Invoice ID)
###### -- "fee": "xxx", (e.g. "0.01" which equals 1%)
###### -- "destination": "xxx", (Bitcoin wallet recieve address)
###### -- "url": "xxx" (e.g. "store.mypayr.com")
###### }
