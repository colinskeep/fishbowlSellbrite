require('dotenv').config();
exports.form = async function formCycleArray(mapped){
  try{
    let arr = [];
    for (let i = 0; i < data.length; i++){
      arr.push({
        "sku": data[i].PART,
        "warehouse_uuid": process.env.WUID,
        "on_hand": data[i].Available
     })
    }
    return(arr)
  }catch(err){return(err)}
}
