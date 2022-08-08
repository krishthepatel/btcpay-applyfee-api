
import CoinGecko from 'coingecko-api';
import express from 'express';
import fetch from 'node-fetch';

// initialize router
const router = express.Router();

router.post('/applyfee', async(req, res) => {
    try {
        const body = req.body

        const { 
            viewstoreauth, 
            modifystoreauth, 
            viewinvoiceauth, 
            invoiceid, 
            fee, 
            destination,
            url
        } = body

        const checkbody = () => {
            if(viewstoreauth && 
                modifystoreauth && 
                viewinvoiceauth && 
                invoiceid && 
                fee && 
                destination &&
                url) {
                    return true
            } else {
                return false
            }
        }

        if(checkbody() == true) {

            const api = {
                stores: [],
                selected_store: null,
                invoice_currency: null,
                invoice_amount: null,
                invoice_amount_btc: null,
                invoice_fee: null,
                invoice_fee_btc: null,
            }

            // Fetch all stores
            await fetch(`${url}/api/v1/stores`, {
                method: 'GET',
                headers: {
                    Authorization: `token ${viewstoreauth}`
                }
            }).then(response => response.json())
            .then(data => {
                for (const iterator of data) {
                    api.stores.push(iterator.id)
                }
            })

            // Loop through all stores
            // Find store with invoice id
            for (const iterator of api.stores) {

                await fetch(`${url}/api/v1/stores/${iterator}/invoices`, {
                    method: 'GET',
                    headers: {
                        Authorization: `token ${viewinvoiceauth}`
                    }
                }).then(response => response.json())
                .then(data => {
    
                    const invoices = []
    
                    for(const iterator of data) 
                        invoices.push(iterator)
    
                    for(const iterator of invoices) 
                        if(iterator.id == invoiceid) 
                            api.selected_store = iterator.storeId
                })
            }

            // Acquire additional data
            // invoice currency, invoice amount, invoice fee
            await fetch(`${url}/api/v1/stores/${api.selected_store}/invoices/${invoiceid}`, {
                method: 'GET',
                headers: {
                    Authorization: `token ${viewinvoiceauth}`
                }
            }).then(response => response.json())
            .then(data => {
                api.invoice_currency = data.currency
                api.invoice_amount = data.amount
                api.invoice_fee = data.amount * fee
            })

            // Convert additional data to Bitcoin currency
            // invoice amount and invoice fee converted to Bitcoin
            const CoinGeckoClient = new CoinGecko()
            api.invoice_currency = api.invoice_currency.toLowerCase()
            const coinprices = await CoinGeckoClient.simple.price({
                ids: ['bitcoin'],
                vs_currencies: [api.invoice_currency]
            })
            const coinrate = coinprices.data.bitcoin
            const coinprice = JSON.stringify(coinrate).replace(/\D/g,'')
            api.invoice_amount_btc = (1 / coinprice) * api.invoice_amount
            api.invoice_fee_btc = (1 / coinprice) * api.invoice_fee

            // Apply fee
            // Sends a transaction in BTC based on invoice information
            await fetch(`${url}/api/v1/stores/${api.selected_store}/payment-methods/onchain/BTC/wallet/transactions`, {
                method: 'POST',
                headers: {
                    Authorization: `token ${modifystoreauth}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    destinations: [
                        {
                            destination: destination,
                            amount: api.invoice_fee_btc
                        }
                    ],
                    proceedWithBroadcast: true
                })
            }).then(res => res.json())
            .then(data => console.log(data))

            res.send({ body, api })

        } else res.send('Please input all parameters in body')

    } catch(error) {
        res.send('Something has went terribly wrong... --- ' + error)
    }
})

export default router;
