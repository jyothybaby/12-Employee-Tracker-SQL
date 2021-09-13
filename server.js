//Importing necessary libraries
const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");

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

function init() {
  mainPrompt();
}

function mainPrompt() {
  inquirer.prompt([{
    type: "list",
    name: "mainChoice",
    message: "What would like to do?",
    choices: ["View all Employees",
      "Add Employee",
      "Update Employee Role",
      "View All Roles",
      "Add Role",
      "View All Departments",
      "Add Department",
      "Quit"]
  }
  ]).then((userChoice) => {
    switch (userChoice.mainChoice) {
      case "View all Employees": viewAllEmployee();
        break;
      case "Add Employee": addEmployee();
        break;
      case "Update Employee Role": updateEmpRole();
        break;
      case "View All Roles": viewAllRoles();
        break;
      case "Add Role": addRole();
        break;
      case "View All Department": viewAllDept();
        break;
      case "Add Department": addDept();
      default: quit()

    }
  })

}

function viewAllEmployee() {
  db.query(`SELECT * from employee`, function(err,result){
    if(err){
      console.log(err);
    }
    console.table(result);
    mainPrompt();
  });
}
app.use((req, res) => {
  res.status(404).end();
});

init();