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
          connection.query('SELECT customerpo from so ORDER BY datecreated DESC LIMIT 100000',
          function (error, results, fields) {
            if (error) throw error;
            resolve(results);
          });
          connection.release();
      };
    });
  });
};
