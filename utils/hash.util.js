const bcrypt = require("bcryptjs")

const salt = process.env.SALT
module.exports = {
    hash: async (s) => {
        return await bcrypt.hash(s,salt)
    }
}