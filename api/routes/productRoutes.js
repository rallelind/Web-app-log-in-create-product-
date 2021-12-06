const express = require("express");
const router = express.Router();

const fs = require("fs");

const checkAuthenticated = require("../helpers/check-authenticated");

const product = [];

//function that sends data from products array to JSON
const sendProductJSON = () => {
  const productJSON = JSON.stringify(product, null, 2);

  fs.writeFile("./dataJSON/product.json", productJSON, "utf8", (err) => {
    if (err) return console.log(err);
  });
};

//get function that grabs profile.ejs and sends objects needed in ejs
router.get("/profile", checkAuthenticated, (req, res) => {
  res.status(200).render("profile.ejs", {
    name: req.user.name,
    product: product
  });
});

// Post method that creates a product and saves it in product array
router.post("/", checkAuthenticated, (req, res) => {
  product.push({
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: req.body.img
  });
  res.status(200).redirect("/profile");

  sendProductJSON();
});

//get function that grabs update-product.ejs
router.get("/update-product", checkAuthenticated, (req, res) => {
  res.status(200).render("update-product.ejs");
});

//put function that updates product in product array
router.put("/update-product", async (req, res) => {
  try {
    product.push({
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: await req.body.img,
    });
    product.splice(0, 1);
    res.status(200).redirect("/profile");
  } catch {
    res.status(400).redirect("/update-product");
  }
  sendProductJSON();
});

//delete function that deletes products
router.delete("/profile", (req, res) => {
  product.splice(0, product.length);
  res.status(200).redirect("/profile");

  sendProductJSON();
});

//get function that checks if given category exists and then grab return-category.ejs
router.get("/return-category/:category", checkAuthenticated, (req, res) => {
  const categories = product.find((c) => c.category === req.params.category);
  if (!categories)return res.status(404).send("The course with given id was not found");
  
  res.status(200).render("return-category.ejs", { categories: categories });
});

module.exports = router;
