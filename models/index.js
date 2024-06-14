const axios = require("axios")

const api = axios.create({
    baseURL: process.env.API_URL + "/rest",
    headers: {
        "x-apikey": process.env.API_KEY
    }
})

module.exports = {
    api,
    createModelFor: (collectionName, otherActions) => ({
        get: async (id, callback) => {
            const {data} = await api.get(`/${collectionName}/${id}`)
            return data
        },
        getAll: async () => {
            const {data} = await api.get(`/${collectionName}`)
            return data
        },
        create: async (data) => {
            const newEntity = await api.post(`/${collectionName}`, data)
            return newEntity.data
        },
        update: async (id, data) => {
            const updatedEntity = await api.patch(`/${collectionName}/${id}`, data)
            return updatedEntity.data
        },
        delete: async (id) => {
            const {data} = await api.delete(`/${collectionName}/${id}`)
            return data
        },
        ...otherActions
    })
}