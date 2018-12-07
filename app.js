const availableQty = require('./availableQty.js');  //make async
const asyncSendInventory = require('./asyncSendInventory.js');
const ordersToImport = require('./ordersToImport.js');
const insertOrder = require('./fbInsertOrder.js');
const chunkArray = require('./chunkArray.js');
const formCycleArray = require('./formCycleArray.js');
const mapCycleSku = require('./mapCycleSku.js');
const mapSalesOrder = require('./mapSalesOrder3.js');

async function syncInv(){
  try{
    let data = await availableQty.get();
    let mapped = await mapCycleSku.get(data);
    let result = await chunkArray.chunk(mapped, 50);
    let final = await asyncSendInventory.send(result);
  }catch(error){return(error)}
}
setInterval(syncInv, 12000);

async function syncOrders(){
  try {
    let data = await ordersToImport.get();
    let mappedso = await mapSalesOrder.get(data);
    let final = await insertOrder.send(mappedso);
    state = false;
  }catch(error){return(error)}
}
setInterval(syncOrders, 15000);
