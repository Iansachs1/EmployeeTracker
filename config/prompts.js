const inquirer = require("inquirer");
const { getManagerNames } = require("./database.js");
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
                            console.table(data);
                            prompts.continue();
                        });
                } else if (task === choices[1]) {
                    database.getRoles()
                        .then(function (data) {
                            console.table(data);
                            prompts.continue();
                        });
                } else if (task === choices[2]) {
                    database.getEmployees()
                        .then(function (data) {
                            console.table(data);
                            prompts.continue();
                        });
                } else if (task === choices[3]) {
                    prompts.AddADepartment();
                } else if (task === choices[4]) {
                    prompts.AddARole();
                } else if (task === choices[5]) {
                    prompts.AddAnEmployee();
                } else if (task === choices[6]) {
                    prompts.updateEmployeeRole();
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
                    message: "What is the name of the department you want to add"
                }
            ])
            .then(function (response) {
                database.createDepartment(response.departmentName)
                .then(function (data) {
                    prompts.continue();
                })
            })
    },

    addARole: function () {
        database.getDepartmentNames()
            .then(function (departmentNames) {
                const choices = departmentNames;
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
                        },
                        {
                            name: "selectedDepartment",
                            type: "list",
                            message: "Which department would you like to add a role to?",
                            choices: choices
                        }

                    ])
                    .then(function (response) {
                        console.log(response);
                        database.createRole(response.title, response.salary, response.selectedDepartment)
                            .then(prompts.continue());
                    })
            })
    },

    addAnEmployee: function () {
        database.getRoleNames()
            .then(function (roleTitles) {
                const roleChoices = roleTitles;

                prompts.getManagerNames()
                    .then(function (fullNames) {
                        const managerNames = fullNames;
                        managerNames.push({ "name": "none", "value": null })

                        inquirer
                            .prompt([
                                {
                                    name: "firstName",
                                    message: "What is this employee's first name?"
                                },
                                {
                                    name: "lastName",
                                    message: "What is this employee's last name?"
                                },
                                {
                                    name: "selectedRole",
                                    type: "list",
                                    message: "What is this employee's role?",
                                    choices: roleChoices
                                },
                                {
                                    name: "selectedManager",
                                    type: "list",
                                    message: "Who is their manager?",
                                    choices: managerNames
                                },
                                {
                                    name: "isManager",
                                    type: "confirm",
                                    message: "Is this employee a manager?"
                                }
                            ])
                            .then(function (response) {
                                console.log(response);

                                database.createEmployee(response.firstName, response.lastName, response.selectedRole, response.selectedManager, response.isManager)
                                    .then(function (data) {
                                        prompts.continue();
                                    })
                                    .catch(function (error) {
                                        console.log("error at create employee", error.message);
                                    })
                            })
                            .catch(function (error) {
                                console.log("error at inquirer prompts", error.message);
                            })
                    })
                    .catch(function (error) {
                        console.log("error at get manager names", error.message);
                    })

            })
            .catch(function (error) {
                console.log("error at get role names", error.message);
            });
    },

    updateEmployeeRole: function () {
        database.getEmployeeNames()
        .then(function (data) {
            const employeeNames = data;
            database.getRoleNames()
            .then(function (data) {
                const roleNames = data;


                inquirer
                    .prompt([
                        {
                            name: "selectedName",
                            type: "list",
                            message: "Pick the employee you want to update",
                            choices: employeeNames
                        },
                        {
                            name: "newRole",
                            type: "list",
                            message: "What is their new role?",
                            choices: roleNames
                        }
                    ])
                    .then(function (response) {
                        database.updateEmployeeRole(response.selectedName, response.newRole)
                        .then(function (data) {
                            prompts.continue();
                        });
                    });
            })

        })
    }
}

prompts.initiate();

module.exports = prompts;