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
      case "View All Employees": viewAllEmployee();
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
  db.query(`SELECT B.id,B.title,B.salary,A.name AS Department,B.Department_id 
            FROM department AS A 
            JOIN role AS B 
            ON A.id = B.department_id;`, function (err, result) {
    if (err) {
      console.log(err);
    }
    console.table(result);
    mainPrompt();
  });
}


//  Function for viewing all roles

function viewAllRoles() {
  db.query(`SELECT * FROM role `, function (err, result) {
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

  db.query(sqlQuery, function (err, res) {
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
  ]).then((answer) => {
    let deptName = answer.dept;
    console.log(deptName);
    db.query(`INSERT INTO department (name) VALUES ('${deptName}')`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(result);
      mainPrompt();
    })
  })

}


// For adding Role
function addRole() {
  var query =
    `SELECT id , name FROM department`
  db.query(query, function (err, res) {
    if (err) {
      console.log('Error while fetching department data');
      return;
    }
    //console.table(res);

    const empdept = [];
    for (let index = 0; index < res.length; index++) {
      empdept.push(res[index].name);

    }
    //console.log(empdept);
    promptForAddingRole(empdept)
  })
}
function promptForAddingRole(empdept) {
  inquirer.prompt([
    {
      type: "input",
      name: "role",
      message: "Enter Name of the role?"
    },
    {
      type: "input",
      name: "salary",
      message: "Enter the salary :?"
    },
    {
      type: "list",
      name: "dept",
      message: "Enter Name department ?",
      choices: empdept,
    },
  ]).then((answer) => {
    let newRole = answer.role;
    let newSalary = answer.salary;
    let dept = answer.dept;
    console.log(newRole);
    console.log(newSalary);
    console.log(dept);
    db.query(`SELECT id FROM department WHERE name = ('${answer.dept}')`, (err, result) => {
      if (err) {
        console.log(err);
      }

      console.log(result);
      const deptid = result[0].id;
      console.log(deptid);



      db.query(`INSERT INTO role (title,salary,department_id) VALUES ('${newRole}', '${newSalary}','${deptid}')`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log("ROW added sucessfully");
        //console.table(result);
        mainPrompt();
      })
    });
  })
}


function addEmployee() {

  var query1 = `SELECT department_id , title FROM role`
  db.query(query1, function (err, res) {
    if (err) {
      console.log('Error while fetching role data');
      return;
    }
    var empRole = [];
    for (let index = 0; index < res.length; index++) {
      empRole.push(res[index].title);
    }
    console.log(empRole)

    var query2 = `SELECT  id , first_name, last_name FROM employee`
    db.query(query2, function (err, res) {
      if (err) {
        console.log('Error while fetching role data');
        return;
      }
      var empMngr = [];
      for (let index = 0; index < res.length; index++) {
        empMngr.push(res[index].first_name + ' ' + res[index].last_name);
      }
      console.log(empMngr)

      promptForAddingEmployee(empRole, empMngr)

    });
  });
}

function promptForAddingEmployee(empRole, empMngr) {
  inquirer.prompt([
    {
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
      name: "employeeManager",
      message: "Who is employee's Manager?",
      choices: empMngr,
    },

  ]).then((answers) => {

    let newEmpFName = answers.employeeFirstName;
    let newEmpLName = answers.employeeLastName;
    console.log("Employee Manager is ", answers.employeeManager);

    db.query(`SELECT id FROM role WHERE title = ('${answers.employeeRole}')`, (err, res) => {
      if (err) {
        console.log(err);
      }
      var newEmpRole_id = res[0].id;
      console.log("Employee Role Id :", newEmpRole_id);


      db.query(`SELECT id FROM employee WHERE concat(first_name, " ", last_name) = ('${answers.employeeManager}')`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
        var newMgrRole_id = result[0].id;
        console.log("Manager Id: ", newMgrRole_id);


        db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${newEmpFName}', '${newEmpLName}', '${newEmpRole_id}', '${newMgrRole_id}')`, (err, result) => {
          if (err) {
            console.log(err);
          }
          console.log("ROW added sucessfully");
          //console.table(result);
          mainPrompt();
        })
      });
    });

  })

}




app.use((req, res) => {
  res.status(404).end();
});

init();





