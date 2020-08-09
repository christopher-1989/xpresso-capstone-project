const express = require('express')
const sqlite3 = require('sqlite3')
const menusRouter = express.Router()
const menuItemsRouter = require('./menu-items.js')

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

menusRouter.post('/', (req, res, next) => {
    const title = req.body.menu.title
    if (!title) {
        return res.sendStatus(400)
        next()
    }
    const sql = 'INSERT INTO Menu (title) VALUES ($title)'
    const values = {$title: title}
    db.run(sql, values, function(err) {
        if(err){
            next(err)
        } else {
            db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`, (err, menu) => {
                res.status(201).json({menu})
            })
        }
    })
})

menusRouter.put('/:menuId', (req, res, next) => {
    const title = req.body.menu.title
    if (!title) {
        return res.sendStatus(400)
        next()
    }
    const sql = 'UPDATE Menu SET title = $title WHERE id = $menuId'
    const values = {$title: title, $menuId: req.params.menuId} 
    db.run(sql, values, (err) => {
        if (err) {
            next(err)
        } else {
            db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`, (err, menu) => {
                res.status(200).json({menu});
            })
    }})
})

menusRouter.delete('/:menuId', (req, res, next) => {    
    const menuItemSql = 'SELECT * FROM MenuItem where MenuItem.menu_id = $menuId'
    const menuItemValues = {$menuId: req.params.menuId}
    db.get(menuItemSql, menuItemValues, (err, menus) => {
        if (err) {
            next(err)
        } else if (menus) {
            res.sendStatus(400)
        } else {
            db.run(`DELETE FROM Menu WHERE Menu.id = ${req.params.menuId}`, (err) => {
                if (err) {
                    next(err)
                } else {
                    res.sendStatus(204)
                }
            })
        }
    })      
})

menusRouter.use('/:menuId/menu-items', menuItemsRouter)
module.exports = menusRouter