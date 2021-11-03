const LocalStrategy = require("passport-local").Strategy //we use the passport-local library and
const bcrypt = require("bcrypt");

function initialize(passport, getUserByEmail, getUserById) {
    const authenticatUser = async (email, password, done) => {
        const user = getUserByEmail(email)
        if(user == null) return done(null, false, { message: "No user with that email" })

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            }else{
                return done(null, false, { message: "Password incorrect" })
            }
        }catch(e){
            return done(e)
        }
    }




    passport.use(new LocalStrategy({ usernameField: "email" }, authenticatUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => { 
        return done(null, getUserById(id))
    })
}

module.exports = initialize