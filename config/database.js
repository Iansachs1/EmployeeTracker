var connection = require("./connection.js");

var database = {
    // Functions to get name/title info needed for inquirer
    getDepartmentNames: function () {
        var queryString = "SELECT name FROM department"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        var departmentNames = data.map(department => department.name);
                        resolve(departmentNames);
                    }
                });
        });
    },

    getRoleNames: function () {
        var queryString = "SELECT title FROM role"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        var roleTitles = data.map(role => role.title);
                        resolve(roleTitles);
                    }
                });
        });
    },

    getEmployeeNames: function () {
        var queryString = "SELECT first_name, last_name FROM employee"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        var firstNames = data.map(employee => employee.first_name);
                        var lastNames = data.map(employee => employee.last_name);
                        var fullNames = [];

                        for (let i = 0; i < firstNames.length; i++) {
                            var fullName = firstNames[i] + " " + lastNames[i];
                            fullNames.push(fullName)
                        }

                        console.log(fullNames);
                        resolve(fullNames);
                    }
                });
        });
    },



    // Functions to get all info from tables and display it on the console
    getDepartments: function () {
        var queryString = "SELECT * FROM department"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
    },

    getRoles: function () {
        var queryString = "SELECT * FROM role"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
    },

    getEmployees: function () {
        var queryString = "SELECT * FROM employee"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data);
                    }
                });
        });
    },



    // Functions that take in names/titles from inquirer and return an id for functions to add new rows in db
    getSelectedDepartmentID: function (departmentName) {
        var queryString = "SELECT id FROM department WHERE name = ?"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [
                    departmentName
                ],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data[0].id);
                    }
                })
        });
    },

    getSelectedRoleID: function (roleTitle) {
        var queryString = "SELECT id FROM role WHERE title = ?"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [
                    roleTitle
                ],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(data[0].id);
                    }
                })
        });
    },

    getSelectedEmployeeID: function (firstName, lastName) {
        var queryString = "SELECT id FROM employee WHERE first_name = ? AND last_name = ?"


        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [
                    firstName,
                    lastName
                ],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(data[0].id)
                        resolve(data[0].id);
                    }
                })
        });
    },



    // functions to create rows in tables based on arguments from other mysql queries and inquirer prompts
    createDepartment: function (departmentName) {
        var queryString = "INSERT INTO department (name) VALUES (?)"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [
                    departmentName
                ],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(`${departmentName} department created.`)
                        resolve(data);
                    }
                })
        });
    },

    createRole: function (title, salary, departmentID) {
        var queryString = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [
                    title,
                    salary,
                    departmentID
                ],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(`${title} role created.`);
                        resolve(data);
                    }
                })
        });
    },

    createEmployee: function (firstName, lastName, roleId, managerId) {
        var queryString = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [
                    firstName,
                    lastName,
                    roleId,
                    managerId
                ],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(`${firstName} ${lastName} added as an employee.`);
                        resolve(data);
                    }
                })
        });
    },

    updateEmployeeRole: function (employeeId, newRoleId) {
        var queryString = "UPDATE employee SET role_id = ? WHERE id = ?"
        return new Promise(function (resolve, reject) {
            connection.query(
                queryString,
                [
                    newRoleId,
                    employeeId
                ],
                function (error, data) {
                    if (error) {
                        reject(error);
                    } else {
                        console.log(`employee role has been updated.`);
                        resolve(data);
                    }
                })
        });
    }

}

module.exports = database;
