// Line 3-7 src: https://www.youtube.com/watch?v=-RCnNyD0L-s 

const checkAuthenticated = ((req, res, next) => { //we create a function that checks if the user is authenticated
    if (req.isAuthenticated()) return next()

    res.redirect("/login") //if the user is not authenticated they get redirected to the login page
})


module.exports = checkAuthenticated
