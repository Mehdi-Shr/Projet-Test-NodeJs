const {Strategy, ExtractJwt} = require('passport-jwt')
const passport = require('passport')
const jwt = require("jsonwebtoken")
const userModel = require("../models/user")
const {Buffer} = require("node:buffer")

const secret = process.env.SECRET_TOKEN

passport.use(new Strategy(
    {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secret,
    },
    async (jwt_payload,done) => {
        if(jwt_payload.id){
            try {
                const user = await userModel.get(jwt_payload.id)
                return done(null, user)
            } catch(e) {
                return done(null,false)
            }
        }
        return done(null,false)
    }
))

module.exports = {
    generateJWT: (user) => {
        return jwt.sign(user, secret);
    },
    middlewareAuthentication: passport.authenticate("jwt",{session: false}),
    getPayload: (req) => {
        const token = (ExtractJwt.fromAuthHeaderAsBearerToken())(req)
        if(token){
            const [header,payload,signature] = token.split(".")
            const buffer = new Buffer.from(payload, 'base64')
            console.log(buffer.toString())
            return JSON.parse(buffer.toString())
        }
        return null
    }
}