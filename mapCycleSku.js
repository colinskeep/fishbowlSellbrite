const db = require('./db.js');

exports.get = async function mapCycleSku(data){
  let arr = [];
  for (i = 0; i < data.length; i++){
    arr.push({
      "sku": data[i].PART,
      "warehouse_uuid": process.env.WUID,
      "on_hand": data[i].Available
    })
    if(i == data.length - 1){
      return(arr);
    }
  }
}
