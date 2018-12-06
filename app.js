const availableQty = require('./availableQty.js');
const asyncSendInventory = require('./asyncSendInventory.js');
const ordersToImport = require('./ordersToImport.js');
const insertOrder = require('./fbInsertOrder.js');
const chunkArray = require('./chunkArray.js');
const formCycleArray = require('./formCycleArray.js');
const mapCycleSku = require('./database.js');
const mapSalesOrder = require('./mapSalesOrder2.js');

async function syncInv(){
  try{
    let data = await availableQty.get();
    let mapped = await mapCycleSku.get(data);
    let result = await chunkArray.chunk(mapped, 50);
    let final = await asyncSendInventory.send(result);
  }catch(error){return(error)}
}
setInterval(syncInv, 10000);

async function syncOrders(){
  try {
    let data = await ordersToImport.get();
    let mappedso = await mapSalesOrder.get(data);
    let final = await insertOrder.send(mappedso);
  }catch(error){return(error)}
}
setInterval(syncOrders, 60000);
