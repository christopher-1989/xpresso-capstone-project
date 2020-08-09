const express = require('express')
const sqlite3 = require('sqlite3')
const menuItemsRouter = express.Router({mergeParams: true})

const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite')

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId) => {
    const sql = 'SELECT * FROM MenuItem WHERE MenuItem.id = $menuItemId'
    const values = {$menuItemId: menuItemId}
    db.get(sql, values, (err,menuItem) => {
        if (err) {
            next(err) 
        } else if (menuItem) {
            //req.issue = issue
            next()
        } else {
            res.sendStatus(404)
        }
    })
})

menuItemsRouter.get('/', (req, res, next) => {
    db.all('SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId', {$menuId: req.params.menuId}, (err, menuItems) => {
        if (err) {
            next(err)
        } else {
            res.status(200).json({menuItems})
        }
    })
})

menuItemsRouter.post('/', (req, res, next) => {       
    const name = req.body.menuItem.name
    const description = req.body.menuItem.description
    const inventory = req.body.menuItem.inventory
    const price = req.body.menuItem.price
    const menuId = req.params.menuId
    const menuSql = 'SELECT * FROM Menu WHERE Menu.id = $menuId'
    const menuValues = {$menuId: menuId}
    db.get(menuSql, menuValues, (err, menu) => {
        if (err) {
            next(err)
        } else {
            if(!name || !description || !inventory || !price || !menu) {
                return res.sendStatus(400)
            }

            const sql = 'INSERT INTO MenuItem (name, description, inventory, price, menu_id) VALUES ($name, $description, $inventory, $price, $menuId)'
            const values = {$name: name, $description: description, $inventory: inventory, $price: price, $menuId: req.params.menuId}
                
            db.run(sql, values, function (err) {
                if(err) {
                    next(err)
                } else {
                    db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${this.lastID}`, (err, menuItem) => {
                        res.status(201).json({menuItem});
                    })
                }
            })
        }
    })
})


menuItemsRouter.put('/:menuItemId', (req, res, next) => {
    const name = req.body.menuItem.name
    const description = req.body.menuItem.description
    const inventory = req.body.menuItem.inventory
    const price = req.body.menuItem.price
    const menuId = req.params.menuId
    const menuSql = 'SELECT * FROM Menu WHERE Menu.id = $menuId'
    const menuValues = {$menuId: menuId}
    db.get(menuSql, menuValues, (err, menu) => {
        if (err) {
            next(err)
        } else {
            if(!name || !description || !inventory || !price || !menu) {
                return res.sendStatus(400)
            }

            const sql = 'UPDATE MenuItem SET name = $name, description = $description, inventory = $inventory, price = $price, menu_id = $menuId WHERE MenuItem.id = $menuItemId'
            const values = {$name: description, $description: description, $inventory: inventory, $price: price, $menuId: menuId, $menuItemId: req.params.menuItemId}
            db.run(sql, values, function (err) {
                if (err) {
                    next(err)
                } else {
                    db.get(`SELECT * FROM MenuItem WHERE MenuItem.id = ${req.params.menuItemId}`, (err, menuItem) => {
                        res.status(200).json({menuItem})
                    })
                }
            })
        }
    })
})
module.exports = menuItemsRouter