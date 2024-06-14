const {api,createModelFor} = require("./index");

const collection = "users"
module.exports = createModelFor("users",
    {
        getByEmailAndPassword: async (email, password) => {
            const {data} = await api.get(`/${collection}?q=${JSON.stringify({email, password})}`)
            return data[0]
        }
    })