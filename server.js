if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

// The dependencies used
const express = require("express"); 
const app = express(); 

const bcrypt = require("bcrypt"); 
const passport = require("passport"); 
const flash = require("express-flash") 
const session = require("express-session") 
const methodOverride = require("method-override") 
const fs = require('fs');

// Login functionality 
const initializePassport = require("./helpers/passport-config"); 
const { render } = require("ejs");
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
); 
const checkAuthenticated = require("./helpers/check-authenticated")
const checkNotAuthenticated = require("./helpers/check-not-authenticated")

// Methods used
app.set("view-engine", "ejs") 
app.use(express.urlencoded({ extended: false })) 
app.use(flash()) 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
})) 
app.use(passport.initialize()) 
app.use(passport.session()) 
app.use(methodOverride("_method")) 
app.use(express.static(__dirname + '/public'));

// Empty array containing user data
const users = [] 

//function that sends data from users array to JSON
const sendUsersJSON = (() => {
    const usersJSON = JSON.stringify(users, null, 2);

    fs.writeFile("./dataJSON/users.json", usersJSON, 'utf8', (err) => {
        if (err) return console.log(err);
    }); 
})

//get method that grabs index.ejs and our localhost default will go to this page
app.get("/", checkAuthenticated, (req, res) => {
    res.status(200).render("index.ejs", { name: req.user.name })
})

//get method that grabs login.ejs 
app.get("/login", checkNotAuthenticated, (req, res) => {
    res.status(200).render("login.ejs");
})

//create a POST method for /login using passport
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

//get method that grabs register.ejs
app.get("/register", checkNotAuthenticated, (req, res) => {
    res.status(200).render("register.ejs");
})

//creating a POST method in which the user data gets pushed to users array
app.post("/register", checkNotAuthenticated, async (req, res) => {
    try { 
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.status(200).redirect("/login")
    }catch{
        res.status(400).redirect("/register")
    }
    sendUsersJSON()
})

//delete function that allows the user to logout 
app.delete("/logout", (req, res) => { 
    req.logOut() 
    res.status(200).redirect("/login") 
})

//delete function that deletes the user
app.delete("/", (req,res) => { 
    users.splice(0,users.length); 
    req.logOut() 
    res.status(200).redirect("/login") 

    sendUsersJSON()
})

//get function that grabs update.ejs
app.get("/update", checkAuthenticated, (req, res) => {
    res.status(200).render("update.ejs")
})

//put function that updates the user data
app.put("/update", async (req, res) => {
        try { 
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                id: req.user.id,
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            })
            users.splice(0,1);   
            res.status(200).redirect("/")
        }catch{
            res.status(400).redirect("/update")
        }
        sendUsersJSON()
    })

// App functionality

const product = []

//function that sends data from products array to JSON
const sendProductJSON = (() => {
    const productJSON = JSON.stringify(product, null, 2); 

    fs.writeFile("./dataJSON/product.json", productJSON, 'utf8', (err) => {
        if (err) return console.log(err);
    }); 
})

//get function that grabs profile.ejs and sends objects needed in ejs
app.get("/profile", checkAuthenticated, (req, res) => {
    res.status(200).render("profile.ejs", { 
        name: req.user.name,
        product: product
    })
})

// Post method that creates a product and saves it in product array
app.post("/", checkAuthenticated, (req, res) => {
    product.push({
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            image: req.body.img
        })
        res.status(200).redirect("/profile")

        sendProductJSON()
})

//get function that grabs update-product.ejs
app.get("/update-product", checkAuthenticated, (req, res) => {
    res.status(200).render("update-product.ejs")
})

//put function that updates product in product array
app.put("/update-product", async(req, res) => {
        try { 
            product.push({
                description: req.body.description,
                price: req.body.price,
                category: req.body.category,
                image: await req.body.img
            })
            product.splice(0,1);
            res.status(200).redirect("/profile")
        }catch{
            res.status(400).redirect("/update-product")
        }
        sendProductJSON()
})

//delete function that deletes products
app.delete("/profile", (req,res) => { 
    product.splice(0,product.length); 
    res.status(200).redirect("/profile") 

    sendProductJSON()
})

//get function that checks if given category exists and then grab return-category.ejs
app.get("/return-category/:category", checkAuthenticated, (req, res) => {
    const categories = product.find(c => c.category === req.params.category)
    if (!categories) return res.status(404).send("The course with given id was not found")
    res.status(200).render("return-category.ejs", {categories: categories})
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))