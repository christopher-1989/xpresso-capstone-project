const express = require('express')
const sqlite3 = require('sqlite3')
const timesheetsRouter = express.Router({mergeParams: true})

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
    const sql = 'SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId'
    const values = {$timesheetId: timesheetId}
    db.get(sql, values, (err,timesheet) => {
        if (err) {
            next(err) 
        } else if (timesheet) {
            //req.issue = issue
            next()
        } else {
            res.sendStatus(404)
        }
    })
})

timesheetsRouter.get('/', (req, res, next) => {
    const sql = 'SELECT * FROM Timesheet WHERE Timesheet.employee_id = $employeeId'
    const values = {$employeeId: req.params.employeeId}
    db.all(sql, values, (err, timesheets) => {
        if (err) {
            next(err)
        } else {
            res.status(200).json({timesheets})
        }
    })
})

timesheetsRouter.post('/', (req, res, next) => {       
    const hours = req.body.timesheet.hours
    const rate = req.body.timesheet.rate
    const date = req.body.timesheet.date
    const employeeId = req.body.timesheet.employeeId
    const employeeSql = 'SELECT * FROM Employee WHERE Employee.id = $employeeId'
    const employeeValues = {$employeeId: employeeId}
    db.get(employeeSql, employeeValues, (err, employee) => {
        if (err) {
            next(err)
        } else {
            if(!hours || !rate || !date || !employee) {
                return res.sendStatus(400)
            }

            const sql = 'INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)'
            const values = {$hours: hours, $rate: rate, $date: date, $employeeId: req.params.employeeId}
                
            db.run(sql, values, function (err) {
                if(err) {
                    next(err)
                } else {
                    db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, (err, timesheet) => {
                        res.status(201).json({timesheet});
                    })
                }
            })
        }
    })

    
})

module.exports = timesheetsRouter