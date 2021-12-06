// Line 4-8 src: https://www.youtube.com/watch?v=-RCnNyD0L-s 


const checkNotAuthenticated = ((req, res, next) => { //we create a function that checks if the user is not authenticated
    if (req.isAuthenticated()) return res.redirect("/") 

    next() 
})

module.exports = checkNotAuthenticated