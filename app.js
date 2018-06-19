const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mustacheExpress = require('mustache-express')
const promise = require('bluebird')

//teliing pg-promise that we will be using bluebird as the promise library
let options = {
    promiseLib : promise
}

let pgp = require('pg-promise')(options)
let connectionString = 'postgres://localhost:5432/groceries'
let db = pgp(connectionString)

app.engine('mustache', mustacheExpress())
app.use(bodyParser.urlencoded({ extended : false }))

//mustache pages will be inside the views folder
app.set('views', './views')
app.set('view engine','mustache')

app.get('/groceries', function(req,res){

    db.any('SELECT shoppinglist.listName,groceryitem.itemname FROM shoppinglist JOIN groceryitem ON shoppinglist.shoppingListID = groceryitem.shoppingListID;').then(function(data){
        console.log(data)
        res.render('groceries', {groceries : data})
    })

})

app.post('/groceries', function(req,res){
    let itemName = req.body.itemName
    console.log(req.body)
    db.none('INSERT INTO groceryitem(itemName) VALUES ($1)', [itemName]).then(function(){
        res.redirect('/groceries')
    })
    
})

app.listen(3000, () => console.log('App listening on port 3000'))