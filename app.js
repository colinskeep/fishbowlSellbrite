const availableQty = require('./availableQty.js');  //make async
const lastModified = require('./lastModified2.js');
const asyncSendInventory = require('./asyncSendInventory.js');
const ordersToImport = require('./ordersToImport.js');
const insertOrder = require('./fbInsertOrder.js');
const chunkArray = require('./chunkArray.js');
const formCycleArray = require('./formCycleArray.js');
const mapCycleSku = require('./mapCycleSku.js');
const mapSalesOrder = require('./mapSalesOrder4.js');
const openFbOrders = require('./openFbOrders2.js');
const shippedSbOrders = require('./shippedSbOrders.js');
const quickFulfill = require('./quickFulfill.js');
const express = require('express');
const app = require('./express.js');
const mysql = require('./maintainDb.js');
const scanz0r = require('./scanz0r.js');
const fnsku = require('./fnsku.js');
//const app = express();

async function syncInv(){
  try{
    const data = await availableQty.get();
    const mapped = await mapCycleSku.get(data);
    const result = await chunkArray.chunk(mapped, 50);
    const final = await asyncSendInventory.send(result);
  }catch(error){return(error)}
}
setInterval(syncInv, 20000);
//syncInv();

async function syncLastModified(){
  try{
    const data = await lastModified.get();
    const mapped = await mapCycleSku.get(data);
    const result = await chunkArray.chunk(mapped, 50);
    const final = await asyncSendInventory.send(result);
  }catch(error){return(error)}
}
setInterval(syncLastModified, 150000);
//syncLastModified();

async function syncOrders(){
  try {
    const data = await ordersToImport.get();
    const mappedso = await mapSalesOrder.get(data);
    if (mappedso) {
      const final = await insertOrder.send(mappedso);
    }
  }catch(error){return(error)}
}
setInterval(syncOrders, 180000);
syncOrders();

async function quickFulfillCycle(){
  try{
    const data = await openFbOrders.get();
    const quickFulfillOrders = await shippedSbOrders.get(data);
    const final = await quickFulfill.send(data);
  }catch(error){return(error)}
}
setInterval(quickFulfillCycle, 60000);
//quickFulfillCycle();

app.listen(process.env.API_PORT, () => {
  console.info('Listening on port 9000');
});

app.post('/values', async function(req, res) {
  try {
    const updateFba = await mysql.update(req);
    console.log(updateFba);
    res.send('true');
  } catch(err) {throw err}
});

app.post('/scanzor', async function(req, res) {
  const updateScanzor = await scanz0r.update(req);
  res.send('true');
})

app.post('/fnsku', async function(req, res) {
  const updateFnsku = await fnsku.update(req);
  res.send('true');
})

setTimeout(function(){
  process.exit(0);
}, 60 * 60 * 1000);
