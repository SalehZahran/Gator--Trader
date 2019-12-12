/**
 * Routes and functions for the user dashboard
 *
 */

const express = require('express'), router = express.Router()
const initCategories = require('../database/initCategories')
const pool = require('../database/database')

//Initializes categories of items for database
var categories = initCategories.init()

var salesItems= null
var messages=null



//Route for user dashboard messages tab
router.get("/user/messages", (req, res) => {
    pool.query("SELECT * FROM message WHERE recieverID=? ", [req.session.userID], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            messages = results
        }
        if (req.session.loggedin) {
            res.render('userDashboardMessageTab', {
                messages: results,
                categories: categories,
                isLogin: req.session.loggedin
            })
        }
    })
})



//Route for user dashboard posted items tab
router.get("/user/sales", (req, res) => {
    
    console.log("This is the userID " + req.session.userID)

    pool.query("SELECT * FROM item WHERE  userID=? ORDER BY date_upload DESC", [req.session.userID], (err, results) => {
        if (err) {
            console.log(err)
        } else {
            salesItems=results
        }
        // console.log(results)

        if (req.session.loggedin) {
            res.render('userDashboardSalesItemTab', {
                salesItems: results,
                categories: categories,
                isLogin: req.session.loggedin
            })
        }
        else {
            req.flash('error_msg','You dont have access to this website')
            //res.send('You dont have access to this website');
        }
        res.end();
    })
})


//Route for deleting posted sales item
router.post("/user/sales/delete", (req, res, next) => {
    var itemID = req.body.itemID
    console.log("item id is " + itemID)


    //Delete fucntion called
    pool.query("DELETE FROM item WHERE itemID=? ", [itemID], (err, results) => {
        if (err) {
            console.log(err)
        }
        console.log(itemID)
        console.log("Succesfully Deleted item")
    })

    res.redirect('/user/sales')
})


//Route for deleting posted sales item
router.post("/user/messages/delete", (req, res, next) => {
    var mID = req.body.mID
    console.log("message id is " + mID)


    //Delete fucntion called
    pool.query("DELETE FROM message WHERE mID=? ", [mID], (err, results) => {
        if (err) {
            console.log(err)
        }
        console.log(mID)
        console.log("Succesfully Deleted message")
    })
    
    res.redirect('/user/messages')
})


var dateSortToggle=true
var priceSortToggle= null
var nameSortToggle= null

//Sorting items
router.post("/user/sales/sort", (req, res , next) =>{

    var sortBy= req.body.sortBy

    
    if(sortBy == "date"){
        if(dateSortToggle){
        salesItems.sort((a,b)=>{
            return (a.date_upload < b.date_upload ) ? 1 : -1 
        })
        dateSortToggle=false
    } else {
        salesItems.sort((a,b)=>{
            return (a.date_upload > b.date_upload ) ? 1 : -1 
           
        })
        dateSortToggle=true
    }
}


    if(sortBy == "name"){
        if(nameSortToggle){
            salesItems.sort((a,b)=>{
            return (a.name< b.name ) ? 1 : -1 
        })
        nameSortToggle=false
    } else {
        salesItems.sort((a,b)=>{
            return (a.name > b.name ) ? 1 : -1 
        })
        nameSortToggle=true
    }
}

    if(sortBy == "price"){
        if(priceSortToggle){
            salesItems.sort((a,b)=>{
            return (a.price< b.price ) ? 1 : -1 
        })
        priceSortToggle=false
    } else {
        salesItems.sort((a,b)=>{
            return (a.price > b.price ) ? 1 : -1 
        })
        priceSortToggle=true
    }
    }


    if (req.session.loggedin) {
        res.render('userDashboardSalesItemTab', {
            salesItems: salesItems,
            categories: categories,
            isLogin: req.session.loggedin
        })
    }
    else {
        req.flash('error_msg','You dont have access to this website')
        //res.send('You dont have access to this website');
    }

})

var mDateSortToggle = true
var itemNameSortToggle = null
var personNameSortToggle = null
var phoneNumSortToggle = null

//Sorting messages
router.post("/user/messages/sort", (req, res, next) => {

    var sortBy = req.body.sortBy

    if (sortBy == "date") {
        if (mDateSortToggle) {
            messages.sort((a, b) => {
                return (a.date_upload < b.date_upload) ? 1 : -1
            })
            mDateSortToggle = false
        } else {
            messages.sort((a, b) => {
                return (a.date_upload > b.date_upload) ? 1 : -1

            })
            mDateSortToggle = true
        }
    }

    if (sortBy == "itemName") {
        if (itemNameSortToggle) {
            messages.sort((a, b) => {
                return (a.itemName < b.itemName) ? 1 : -1
            })
            itemNameSortToggle = false
        } else {
            messages.sort((a, b) => {
                return (a.itemName > b.itemName) ? 1 : -1

            })
            itemNameSortToggle = true
        }
    }

    if (sortBy == "name") {
        if (personNameSortToggle) {
            messages.sort((a, b) => {
                return (a.name < b.name) ? 1 : -1
            })
            personNameSortToggle = false
        }
        else {
            messages.sort((a, b) => {
                return (a.name > b.name) ? 1 : -1
            })
            personNameSortToggle = true
        }
    }

    if (sortBy == "phoneNumber") {
        if (phoneNumSortToggle) {
            messages.sort((a, b) => {
                return (a.phoneNumber < b.phoneNumber) ? 1 : -1
            })
            phoneNumSortToggle = false
        }
        else {
            messages.sort((a, b) => {
                return (a.phoneNumber > b.phoneNumber) ? 1 : -1
            })
            phoneNumSortToggle = true
        }
    }


    if (req.session.loggedin) {
        res.render('userDashboardMessageTab', {
            messages: messages,
            categories: categories,
            isLogin: req.session.loggedin
        })
    }
    else {
        req.flash('error_msg', 'You dont have access to this website')
        //res.send('You dont have access to this website');
    }

})



module.exports = router
