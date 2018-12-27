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
          connection.query("SELECT part.num AS PART, IFNULL((SELECT (qtyinventory.QTYONHAND - qtyinventory.QTYALLOCATEDSO - qtyinventory.QTYALLOCATEDTO - qtyinventory.QTYNOTAVAILABLE) FROM qtyinventory WHERE locationgroupid = 1 and part.id = qtyinventory.partid),0) as Available FROM part WHERE activeFlag = TRUE ORDER BY RAND() LIMIT 300",
          function (error, results, fields) {
            if (error) throw error;
            resolve(results);
          });
          connection.release();
      };
    });
  });
};
