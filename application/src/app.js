const express = require('express'), app = express()
const path = require('path')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const routes = require('./routes/routes')
const aboutRoutes = require('./routes/aboutPgRoutes')
const users = require('./routes/users')
const db = require('./database')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
try {
    var dbConnection = db.connection()
} catch (err) {
    console.log(err)
}


//configures ejs as templating language
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//add middleware layers required for application (static file serving, etc)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use('/', routes)
app.use('/', aboutRoutes)
app.use('/users', require('./routes/users'))
// Express body parser
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

//Global vars
app.use((req, res, next) => {
    // res.locals.success_msg = req.flash('success_msg');
    // res.locals.error_msg = req.flash('error_msg');
    next();
});
app.post('/login',
    passport.authenticate('local'),
    function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        res.redirect('/users/' + req.user.username);
    });
//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());
var categories = db.initCategories()

//used for test post that gets value from the protype homepage search bar
app.post('/results', function (req, res) {
    //deal with category result here later
    console.log("value returned from search entry is (" + req.body.searchEntry + ")")

    //if category was selected output all items for that category
    if(categories.includes(req.body.searchEntry)) {
            dbConnection.query("SELECT * FROM item WHERE category=?", [req.body.searchEntry], (err, result) => {
            if (err) {
                console.log(err)
            }
            res.render('results', {
                searchResult: result,
                categories: categories,
                isLogin:true
            })
        })
    }
    else if (!req.body.searchEntry) {
        dbConnection.query("SELECT * FROM item", (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
            }
            res.render('results', {
                searchResult: result,
                categories: categories,
                isLogin:true
            })
        })
    } else {
        //else only output the item that the user entered
        dbConnection.query("SELECT * FROM item WHERE name like '%" + req.body.searchEntry+ "%'", (err, result) => {
            if (err) {
                console.log(err)
            } else {
                console.log(result)
            }
            res.render('results', {
                searchResult: result,
                categories: categories,
                isLogin:true
            })
        })
    }
})

const PORT = 3000

app.listen(PORT, () => console.log('Server running on port ' + PORT))
