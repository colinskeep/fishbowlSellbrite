exports.get = async function isFba(rows, data){
  try{
    var fbaarr = [];
    for (x = 0; x < rows.length; x++){
      fbaarr.push(rows[x].sku)
    }
    if (fbaarr.length == rows.length){
      var location = await fbaarr.indexOf(data) > -1 ? 'FBA' : 'MAIN';
      return location;
    }
  }catch(err){cosnole.log(err)}
}
