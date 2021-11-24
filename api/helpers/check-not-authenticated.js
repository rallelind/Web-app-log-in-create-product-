
const checkNotAuthenticated = ((req, res, next) => { //we create a function that checks if the user is not authenticated
    if (req.isAuthenticated()) return res.redirect("/") 

    next() 
})

module.exports = checkNotAuthenticated