require('dotenv').config();
const mysql = require('mysql2');
const bluebird = require('bluebird');

exports.get = async function mapCycleSku(data){
  let arr = [];
  const pool = mysql.createConnection({host: 'localhost', user: 'root', password: process.env.MY_PW, database: 'mysql'});
  const promisePool = pool.promise();
  for (i = 0; i < data.length; i++){
    try{
      const [rows,fields] = await promisePool.query(`SELECT sbsku FROM legend WHERE fbsku = '${data[i].PART}' AND isFba = 'False' AND sbsku IS NOT NULL`);
      for (x = 0; x < rows.length; x++){
        arr.push({
          "sku": rows[x].sbsku,
          "warehouse_uuid": process.env.WUID,
          "on_hand": data[i].Available
        })
      }
      if(i == data.length - 1){
        pool.end();
        return(arr);
      }
    }catch(error){console.log(error)}
  }
}
