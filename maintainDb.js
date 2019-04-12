require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const conn = mysql.createConnection({
  host     : process.env.DB_HOST,
  user     : process.env.MY_USR,
  password : process.env.MY_PW,
  database : process.env.MY_DB,
});

const sql = "INSERT INTO fba (sku) VALUES ?";

async function update(req) {
  try {
    let arr = [];
    console.log(req.body.values.length)
    for (let i = 0; i < req.body.values.length; i++) {
      arr.push([req.body.values[i]])
      if (i == req.body.values.length - 1) {
        const result = await conn.query(sql, [arr]);
        return true;
      }
    }
  } catch(err) {return err};
}

module.exports = {
  update,
}
