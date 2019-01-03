const fetchSbOrders = require('./fetchSellbriteOrders.js');
const fetchFbOrders = require('./fbOrderList.js');

exports.get = async function syncOrders(){
  try {
    let sbOrder = await fetchSbOrders.get();
    let fbOrder = await fetchFbOrders.get();
    //var errorOrder = sbOrder.findIndex(x => x.display_ref == "111-6591937-9477864"); for debugging
    let arr = [];
    let importOrder = [];
    for (let i = 0; i < fbOrder.length; i++){
      arr.push(fbOrder[i].customerpo);
      if (i == fbOrder.length - 1){
        for (let x = 0; x < sbOrder.length; x++){
          if(sbOrder[x].display_ref.length > 24) {
            sbOrder[x].display_ref = sbOrder[x].display_ref.substring(8);
          }
          if(arr.indexOf(sbOrder[x].display_ref) == -1){
            importOrder.push(sbOrder[x]);
          }
          if(x == sbOrder.length - 1){
            return(importOrder)
          }
        }
      }
    }
  }catch(error){return(error)}
}
