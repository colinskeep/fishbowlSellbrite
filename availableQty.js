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
          connection.query("SELECT PART.NUM AS PART, PART.DESCRIPTION, UOM.CODE AS UOMCODE, (SELECT NAME FROM COMPANY WHERE ID = 1) AS COMPANY, COALESCE(INVENTORYTOTALS.TOTALONHAND,0) AS QTY, COALESCE(INVENTORYTOTALS.TOTALNOTAVAILABLE,0) AS UNAVAILABLE, COALESCE(INVENTORYTOTALS.TOTALDROPSHIP,0) AS DROPSHIP, COALESCE(COMMITTED.TOTAL,0) AS QTYCOMMITTED, COALESCE(INVENTORYTOTALS.TOTALALLOCATED,0) AS ALLOCATED, COALESCE(INVENTORYTOTALS.TOTALONORDER,0) AS ONORDER, COALESCE(INVENTORYTOTALS.TOTALONHAND -INVENTORYTOTALS.TOTALALLOCATED,0) AS Available FROM part LEFT JOIN uom ON part.uomid = uom.id LEFT JOIN (SELECT partId, SUM(qtyOnHand) AS totalOnHand, SUM(qtyNotAvailable) AS totalNotAvailable, SUM(qtyDropship) AS totalDropship, SUM(qtyAllocated) AS totalAllocated, SUM(qtyOnOrder) AS totalOnOrder FROM qtyInventoryTotals WHERE locationGroupId IN (1,2,3,4) GROUP BY partId) AS inventoryTotals ON inventoryTotals.partId = part.id LEFT JOIN (SELECT     partId, SUM(qty) AS total FROM qtyCommitted WHERE locationGroupId IN (1,2,3,4) GROUP BY partId) AS committed ON committed.partId = part.id WHERE part.id != 0 AND part.typeid = 10 AND part.activeflag = 1 ORDER BY RAND() LIMIT 100",
          function (error, results, fields) {
            if (error) throw error;
            resolve(results);
          });
          connection.release();
      };
    });
  });
};
