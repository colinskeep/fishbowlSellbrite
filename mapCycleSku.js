const db = require('./db.js');

exports.get = async function mapCycleSku(data){
  let arr = [];
  for (i = 0; i < data.length; i++){
    try{
      const [rows,fields] = await db.execute(`SELECT sbsku FROM legend WHERE fbsku = '${data[i].PART}' AND isFba = 'FALSE'`);
      for (x = 0; x < rows.length; x++){
        arr.push({
          "sku": rows[x].sbsku,
          "warehouse_uuid": process.env.WUID,
          "on_hand": data[i].Available
        })
      }
      if(i == data.length - 1){
        return(arr);
      }
    }catch(error){console.log(error)}
  }
}
