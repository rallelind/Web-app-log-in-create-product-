const LocalStrategy = require("passport-local").Strategy //we use the passport-local library and
const bcrypt = require("bcrypt");

    const authenticatUser = ((email, password, done) => {
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
    })



const initalize = ((passport) => {
    passport.use(new LocalStrategy({ usernameField: "email" }), authenticatUser)
    passport.serializeUser((user, done) => { })
    passport.deserializeUser((id, done) => { })
})

module.export = initalize