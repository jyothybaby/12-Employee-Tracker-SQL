//Importing necessary libraries
const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//Connecting to the Database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Jyothysql2021',
    database: 'employeetracker_db'
  },
  console.log(`Connected to the employeetracker_db database.`)
);