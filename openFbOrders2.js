const db = require('./db2.js');

exports.get = async function openFbOrders(data){
    try{
      const [rows,fields] = await db.execute(`SELECT so.customerPO, so.dateCreated FROM SO WHERE so.statusid = '20'`);
      return(rows);
    }catch(error){console.log(error)}
}
