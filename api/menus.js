const express = require('express')
const sqlite3 = require('sqlite3')
const menusRouter = express.Router()

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

menusRouter.param('menuId', (req, res, next, menuId) => {
    const sql = 'SELECT * FROM Menu WHERE id = $menuId'
    const values = {$menuId: menuId}
    db.get(sql, values, (err, menu) => {
        if (err) {
            next(err) 
        } else if (menu) {
            req.menu = menu
            next()
        } else {
            res.sendStatus(404)
        }
    })
})

menusRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM Menu',
    (err, menus) => {
        if (err) {
            next(err)
        } else {
            res.status(200).json({menus})
        }
    })
})

menusRouter.get('/:menuId', (req, res, next) => {
    res.status(200).json({menu: req.menu})
})


module.exports = menusRouter