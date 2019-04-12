require('dotenv').config();
const express = require('express');
const mysql = require('mysql');

const conn = mysql.createConnection({
  host     : process.env.SZ_HOST,
  user     : process.env.SZ_USR,
  password : process.env.SZ_PW,
  database : process.env.SZ_DB,
});

const sql = "INSERT INTO fnsku (fnsku, sku) VALUES ?";

async function update(req) {
  try {
    let arr = [];
    console.log(req.body.values.length)
    for (let i = 0; i < req.body.values.length; i++) {
      let line = req.body.values[i].split(',')
      arr.push(line)
      if (i == req.body.values.length - 1) {
        console.log(arr);
        const result = await conn.query(sql, [arr]);
        return true;
      }
    }
  } catch(err) {return err};
}

module.exports = {
  update,
}
