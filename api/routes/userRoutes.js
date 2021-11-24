const express = require("express");
const router = express.Router();

const passport = require("passport");
const bcrypt = require("bcrypt");
const fs = require("fs");
const initializePassport = require("../helpers/passport-config");
initializePassport(
  passport,
  (email) => users.find((user) => user.email === email),
  (id) => users.find((user) => user.id === id)
);
const checkAuthenticated = require("../helpers/check-authenticated");
const checkNotAuthenticated = require("../helpers/check-not-authenticated");

// Empty array containing user data
const users = [];

//function that sends data from users array to JSON
const sendUsersJSON = () => {
  const usersJSON = JSON.stringify(users, null, 2);

  fs.writeFile("./dataJSON/users.json", usersJSON, "utf8", (err) => {
    if (err) return console.log(err);
  });
};

//get method that grabs index.ejs and our localhost default will go to this page
router.get("/", checkAuthenticated, (req, res) => {
  res.status(200).render("index.ejs", { name: req.user.name });
});

//get method that grabs login.ejs
router.get("/login", checkNotAuthenticated, (req, res) => {
  res.status(200).render("login.ejs");
});

//create a POST method for /login using passport
router.post(
  "/login",
  checkNotAuthenticated,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  })
);

//get method that grabs register.ejs
router.get("/register", checkNotAuthenticated, (req, res) => {
  res.status(200).render("register.ejs");
});

//creating a POST method in which the user data gets pushed to users array
router.post("/register", checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    res.status(200).redirect("/login");
  } catch {
    res.status(400).redirect("/register");
  }
  sendUsersJSON();
});

//delete function that allows the user to logout
router.delete("/logout", (req, res) => {
  req.logOut();
  res.status(200).redirect("/login");
});

//delete function that deletes the user
router.delete("/", (req, res) => {
  users.splice(0, users.length);
  req.logOut();
  res.status(200).redirect("/login");

  sendUsersJSON();
});

//get function that grabs update.ejs
router.get("/update", checkAuthenticated, (req, res) => {
  res.status(200).render("update.ejs");
});

//put function that updates the user data
router.put("/update", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    users.push({
      id: req.user.id,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });
    users.splice(0, 1);
    res.status(200).redirect("/");
  } catch {
    res.status(400).redirect("/update");
  }
  sendUsersJSON();
});

module.exports = router;
