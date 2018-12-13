require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createPool({
  host     : process.env.DB_HOST,
  port     : process.env.DB_PORT,
  user     : process.env.DB_USER,
  password : process.env.DB_PASS,
  database : process.env.DB_NAME
});

exports.get = () => {
  return new Promise((resolve, reject) =>{
    connection.getConnection((err, connection) => {
      if (err){
        reject(Error(err))
      }else {
          connection.query("SELECT DISTINCT(part.num), (qtyinventory.QTYONHAND - qtyinventory.QTYALLOCATEDSO - qtyinventory.QTYALLOCATEDTO - qtyinventory.QTYNOTAVAILABLE) AS available FROM inventorylog JOIN part on part.id = inventorylog.partid JOIN qtyinventory on part.id = qtyinventory.partid WHERE inventorylog.locationgroupid = 1 AND qtyinventory.locationgroupid = 1 ORDER BY inventorylog.id DESC LIMIT 100",
          function (error, results, fields) {
            if (error) throw error;
            resolve(results);
          });
          connection.release();
      };
    });
  });
};
