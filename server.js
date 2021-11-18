if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

// The methods used
const express = require("express"); //we use require to use express 
const app = express(); //then save it as app and now express is ready to be used
const bcrypt = require("bcrypt"); //we want to use bcrypt library to hash our users passwords to make them safe
const passport = require("passport"); //we want to use passport in order to allow user and password authentication
const flash = require("express-flash") //we donloaded express flash library to store users
const session = require("express-session") //we downloaded express session library to display messages for wrong email etc
const methodOverride = require("method-override") //we use this method as forms is not accepted in the delete method and this method will allow us to have forms in delete method
const fs = require('fs');

// Login functionality 
const initializePassport = require("./helpers/passport-config"); //we configure passport in seperate file to make code seperated and readible
const { render } = require("ejs");
initializePassport(
    passport, 
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
); //we call our function with the passport variable that requires passport

app.set("view-engine", "ejs") //we use our dependency ejs 
app.use(express.urlencoded({ extended: false })) //This tells the app that we want to take the forms and to be able to access them inside our req in our post method
app.use(flash()) //this tells our app that we want to use flash
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
})) 
app.use(passport.initialize()) //this tells our app to use passport and grab our initialize function from passport-config.js
app.use(passport.session()) //this tells our app that we want to use the session method with passport
app.use(methodOverride("_method")) //this tells our app that when we use methodOverride we use it by calling "_method"
app.use(express.static(__dirname + '/public'));

const users = [] //As we are not storing our data on a database we instead store them in this local variable

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

//create a POST method for /login
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

//get method that grabs register.ejs
app.get("/register", checkNotAuthenticated, (req, res) => {
    res.status(200).render("register.ejs");
})

//creating a POST method for /register with and async function
app.post("/register", checkNotAuthenticated, async (req, res) => {
/*we create a try, catch block to make sure the data is correct
thereafter we push the data we want into our users array. If this was successfull we will redirect to /login.
This functionality makes the user able to login as we now have saved the users data in our users array*/
    try { 
//we create a hashedPassword variable and give at a value of 10 as it is a standard default value that makes the hashing quick and secure
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        res.status(200).redirect("/login")
//in the catch block we redirect back to register in case of an failure
    }catch{
        res.status(400).redirect("/register")
    }
    sendUsersJSON()
})

app.delete("/logout", (req, res) => { //we create a delete function that allows the user to logout
    req.logOut() //then we use the logOut method from passport which allows the user to logout
    res.status(200).redirect("/login") //lastly we redirect the user to /login
})

app.delete("/", (req,res) => { //We create a delete function that deletes the user 
    users.splice(0,users.length); //using the splice method we can delete the user info in our users array
    req.logOut() //we use the logOut method from passport
    res.status(200).redirect("/login") //lastly we redirect to /login and now if we try entering the same info we will not be able to log on

    sendUsersJSON()
})

app.get("/update", checkAuthenticated, (req, res) => {
    res.status(200).render("update.ejs")
})

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

const sendProductJSON = (() => {
    const productJSON = JSON.stringify(product, null, 2); //null 2 for at få det i linjer

    fs.writeFile("./dataJSON/product.json", productJSON, 'utf8', (err) => {
        if (err) return console.log(err);
    }); 
})

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

app.get("/update-product", checkAuthenticated, (req, res) => {
    res.render("update-product.ejs")
})

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

app.delete("/profile", (req,res) => { //We create a delete function that deletes the user 
    product.splice(0,product.length); //using the splice method we can delete the user info in our users array
    res.status(200).redirect("/profile") //lastly we redirect to /login and now if we try entering the same info we will not be able to log on

    sendProductJSON()
})

app.get("/return-category/:category", checkAuthenticated, (req, res) => {
    const categories = product.find(c => c.category === req.params.category)
    if (!categories) return res.status(404).send("The course with given id was not found")
    res.status(200).render("return-category.ejs", {categories: categories})
});

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Listening on port ${port}...`))