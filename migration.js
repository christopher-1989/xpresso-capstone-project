const sqlite3 = require('sqlite3')

const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS Employee')
    db.run('CREATE TABLE Employee(' +
    'id INTEGER NOT NULL PRIMARY KEY, ' + 
    'name TEST NOT NULL, ' +
    'position TEXT NOT NULL, ' +
    'wage INTEGER NOT NULL, ' + 
    'is_currently_employee INTEGER DEFAULT 1)')
})

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS Timesheet')
    db.run('CREATE TABLE Timesheet(' +
    'id INTEGER NOT NULL PRIMARY KEY, ' + 
    'hours INTEGER NOT NULL, ' +
    'rate INTEGER NOT NULL, ' +
    'date INTEGER NOT NULL, ' + 
    'employee_id INTEGER NOT NULL, ' +
    'FOREIGN KEY (`employee_id`) REFERENCES `Employee`(`id`))')
})

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS Menu')
    db.run('CREATE TABLE Menu(' +
    'id INTEGER NOT NULL PRIMARY KEY, ' + 
    'title TEST NOT NULL)')
})

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS MenuItem')
    db.run('CREATE TABLE MenuItem(' +
    'id INTEGER NOT NULL PRIMARY KEY, ' + 
    'name TEST NOT NULL, ' +
    'description TEXT NOT NULL, ' +
    'inventory INTEGER NOT NULL, ' +
    'price INTEGER NOT NULL, ' + 
    'menu_id INTEGER DEFAULT 1, ' +
    'FOREIGN KEY (`menu_id`) REFERENCES `Menu`(`id`))')
})