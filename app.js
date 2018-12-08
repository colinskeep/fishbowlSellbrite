const availableQty = require('./availableQty.js');  //make async
const asyncSendInventory = require('./asyncSendInventory.js');
const ordersToImport = require('./ordersToImport.js');
const insertOrder = require('./fbInsertOrder.js');
const chunkArray = require('./chunkArray.js');
const formCycleArray = require('./formCycleArray.js');
const mapCycleSku = require('./mapCycleSku.js');
const mapSalesOrder = require('./mapSalesOrder3.js');
const openFbOrders = require('./openFbOrders2.js');
const shippedSbOrders = require('./shippedSbOrders.js');
const quickFulfill = require('./quickFulfill.js');

async function syncInv(){
  try{
    const data = await availableQty.get();
    const mapped = await mapCycleSku.get(data);
    const result = await chunkArray.chunk(mapped, 50);
    const final = await asyncSendInventory.send(result);
  }catch(error){return(error)}
}
setInterval(syncInv, 12000);

async function syncOrders(){
  try {
    const data = await ordersToImport.get();
    const mappedso = await mapSalesOrder.get(data);
    const final = await insertOrder.send(mappedso);
  }catch(error){return(error)}
}
setInterval(syncOrders, 15000);

async function quickFulfillCycle(){
  try{
    const data = await openFbOrders.get();
    const quickFulfillOrders = await shippedSbOrders.get(data);
    const final = await quickFulfill.send(quickFulfillOrders);
  }catch(error){return(error)}
}
//setInterval(quickFulfill(), 300000);
quickFulfillCycle();
