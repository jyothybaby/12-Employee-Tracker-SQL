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


const empRole = [db.query(`SELECT title FROM role`)];

function init() {
  mainPrompt();
}

function mainPrompt() {
  inquirer.prompt([{
    type: "list",
    name: "mainChoice",
    message: "What would like to do?",
    choices: ["View All Departments",
      "View All Roles",
      "View All Employees",
      "Add Department",
      "add a role",
      "add an employee",
      "update an employee role",
      "Quit"]
  }
  ]).then((userChoice) => {
    switch (userChoice.mainChoice) {
      case "View All Departments": viewAllDept();
        break;
      case "add an employee": addEmployee();
        break;
      case "update an employee role": updateEmpRole();
        break;
      case "View All Roles": viewAllRoles();
        break;
      case "add a role": addRole();
        break;
      case  "View All Employees": viewAllEmployee();
        break;
      case "Add Department": addDept();
        break;
      case "Quit": db.end();
        break;

    }
  })

}
// Function for viewing All Department
function viewAllDept() {
  db.query(`SELECT id, name as department FROM department`, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainPrompt();
  });
}


//  Function for viewing all roles

function viewAllRoles() {
  db.query(`SELECT B.title as Title, C.role_id, A.name as department,B.salary
  FROM role as B
  INNER JOIN department as A
  ON A.id = department_id
  INNER JOIN employee as C
  ON B.id = C.role_id `, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainPrompt();
  });
}

// Function for viewing all employees
function viewAllEmployee() {
  var sqlQuery = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  LEFT JOIN role r
	ON e.role_id = r.id
  LEFT JOIN department d
  ON d.id = r.department_id
  LEFT JOIN employee m
	ON m.id = e.manager_id` ;

  db.query(sqlQuery, function(err,res) {
    if (err) {
      console.log(err);
    }
    console.table(res);
    mainPrompt();
  });
}

//Add Department

function addDept() {
  inquirer.prompt([{
    type: "input",
    name: "dept",
    message: "Enter the Name of the department? "
  }
  ]).then ((answer)=> {
    let deptName = answer.dept;
    console.log(deptName);
    db.query(`INSERT INTO department (name) VALUES ('${deptName}')`,(err, result)=> {
      if (err) {
        console.log(err);
      }
      console.log(result);

    })
  })

}

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

  ]).then((answers) => {

    const addempSql = ``

  })
}
app.use((req, res) => {
  res.status(404).end();
});

init();



//---------------------------------------------------------------------------------
//const empDept = [db.query(`SELECT name FROM department`)];
//console.log(empDept);

// const empDept = {};

// db.query(`SELECT id as value, name FROM department`, (err, rows) => {
//   if(err){
//     console.log('Error while fetching department data');
//     return;
//   }
//    console.table(rows);
// for(let index = 0; index < rows.length; index++){
//   console.log(rows[index].id + ' ' + rows[index].name);
// }

//   inquirer.prompt([{
//     type: "list",
//     name: "deptChoice",

//     message: "Select Department?",
//     choices: rows
//   }]).then((selectedDept)=>{
//     const ress = choices.find(function(row,index){
//      if(row.name == selectedDept.deptChoice)
//       return true; 
//     });
//     console.log(ress);
//   });

// });

