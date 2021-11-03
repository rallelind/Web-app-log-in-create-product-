//we use require to use express and save it as app
const express = require("express");
const app = express();

//we use our dependency ejs 
app.set("view-engine", "ejs")

app.get("/", (req, res) => {
    res.render(index.ejs)
})

app.listen(3000)