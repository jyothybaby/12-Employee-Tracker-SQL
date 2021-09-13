//Importing necessary libraries
const express = require('express');
const mysql = require('mysql2');
const inquirer = require("inquirer");
// const Connection = require('mysql2/typings/mysql/lib/Connection');

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
const empDept = db.query(`SELECT * FROM department`)
const empRole = db.query(`SELECT title FROM role`)

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
        break;
      case "Quit": db.end();
        break;

    }
  })

}

function viewAllEmployee() {
  db.query(`SELECT A.id, C.first_name, C.last_name, B.title, A.name as department, B.salary, C.manager_id 
  FROM department as A
  INNER JOIN role as B
  ON A.id = B.department_id 
  INNER JOIN employee as C
  ON B.id = C.role_id
  `, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainPrompt();
  });
}
app.use((req, res) => {
  res.status(404).end();
});

function addEmployee() {

 inquirer.prompt([{
    type: "input",
    name: "employeeFirstName",
    message: "What is employee's first Name?"
  },
  {
    type: "input",
    name: "employeeLastName",
    message: "What is employee's last Name?"
  },
  {
    type: "list",
    name: "employeeRole",
    message: "What is employee's role?",
    choices: empRole,
  },
    {
    type: "list",
    name: "employeeDepartment",
    message: "What is employee's department?",
    choices: empDept,
  },

  ]) .then((answers) => {

    const addempSql = ``

  })
}

init();