const inquirer = require("inquirer");
const database = require("./database.js");


var prompts = {
    initiate: function () {
        var choices = [
            "View Departments",
            "View Roles",
            "View Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update and Employee Role"
        ];

        inquirer
            .prompt([
                {
                    name: "task",
                    type: "list",
                    message: "What would you like to do?",
                    choices: choices
                }
            ])
            .then(function (response) {
                var task = response.task;

                if (task === choices[0]) {
                    database.getDepartments()
                        .then(function (data) {
                            console.log(data);
                            prompts.continue();
                        });
                } else if (task === choices[1]) {
                    database.getRoles()
                        .then(function (data) {
                            console.log(data);
                            prompts.continue();
                        });
                } else if (task === choices[2]) {
                    database.getEmployees()
                        .then(function (data) {
                            console.log(data);
                            prompts.continue();
                        });
                } else if (task === choices[3]) {
                    prompts.AddADepartment();
                } else if (task === choices[4]) {
                    prompts.selectDepartment();
                }
            });
    },

    continue: function () {
        inquirer
            .prompt([
                {
                    name: "continue",
                    type: "confirm",
                    message: "Do you want to do something else?"
                }
            ])
            .then(function (response) {
                if (response.continue) {
                    prompts.initiate();
                }
            });
    },

    AddADepartment: function () {
        inquirer
            .prompt([
                {
                    name: "departmentName",
                    message: "What is the name of the department you would like to add?"
                }
            ])
            .then(function (response) {
                var departmentName = response.departmentName;

                database.createDepartment(departmentName)
                    .then(prompts.continue());
            })
    },

    selectDepartment: function () {
        database.getDepartmentNames()
        .then(function (departmentNames) {
            var choices = departmentNames;
            inquirer
                .prompt([
                    {
                        name: "selectedDepartment",
                        type: "list",
                        message: "Which department would you like to add a role to?",
                        choices: choices
                    }
                ])
                .then(function (response) {
                    database.getSelectedDepartmentID(response.selectedDepartment)
                    .then(function (data) {
                        prompts.AddARole(data);
                    })
                })
        })
    },

    AddARole: function (departmentId) {
        inquirer
            .prompt([
                {
                    name: "title",
                    message: "What is the title of the role you want to add?"
                },
                {
                    name: "salary",
                    type: "number",
                    message: "What is the salary of this role?"
                }

            ])
            .then(function (response) {
                database.createRole(response.title, response.salary, departmentId)
                .then(prompts.continue());
            })
    },


    getSelectedEmployeeName: function (data) {

        inquirer
            .prompt([
                {
                    name: "selectedName",
                    type: "list",
                    message: "Pick the employee you want to update",
                    choices: data
                }
            ])
            .then(function (response) {
                var selectedName = response.selectedName;
                var firstAndLastName = selectedName.split(" ");
                database.getSelectedEmployeeID(firstAndLastName[0], firstAndLastName[1]);
            });
    }
}

prompts.initiate();

module.exports = prompts;