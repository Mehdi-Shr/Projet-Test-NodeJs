const productModel = require('../models/product')
const fs = require('fs')

module.exports = {
    async get(req, res) {
        const {id} = req.params
        if (id) {
            try {
                const product = await productModel.get(id)
                return res.json(product)

            } catch (e) {
                return res.status(400).json({message: "Le produit n'existe pas"})
            }
        }
        return res.status(400).json({message: "Veuillez renseigner l'id du produit"})
    },
    async getAll(req, res) {
        try {
            const products = await productModel.getAll()
            return res.json(products)
        } catch (e) {
            return res.status(400).json({message: "Nous ne parvenons pas à récupérer la liste de produit, veuillez reéssayer ulterieurement"})
        }
    },
    async update(req, res) {
        const {id} = req.params
        if (id) {
            const {marque, volume, type, prix, source, description, typeBouchon, image} = req.body
            if (marque || volume || type || prix || source || description || typeBouchon || image) {
                try {
                    const newProduct = await productModel.update(id, {
                        marque,
                        volume,
                        type,
                        prix,
                        source,
                        description,
                        typeBouchon,
                        image,
                    })
                    return res.json(newProduct)
                } catch (e) {
                    return res.status(500).json({message: "Le produit n'existe pas"})
                }
            }
            return res.status(400).json({message: "Il manque certaines propriétés pour modifier le produit (marque, volume, type, prix, source, description, typeBouchon)"})
        }
        return res.status(400).json({message: "Veuillez renseigner l'id du produit"})

    },
    async create(req, res) {
        const {marque, volume, type, prix, source, description, typeBouchon, image} = req.body

        if (marque && volume && type && prix && source && description && typeBouchon && image) {
            try {
                const newProduct = await productModel.create({
                    marque,
                    image,
                    volume,
                    type,
                    prix,
                    source,
                    description,
                    typeBouchon,
                })
                return res.json(newProduct)
            } catch (e) {
                return res.status(400).json({message: "Nous ne parvenons pas à créer le produit, veuillez reéssayer ulterieurement"})
            }
        }
        return res.status(400).json({message: "Il manque certaines propriétés pour créer le produit (marque, image, volume, type, prix, source, description, typeBouchon)"})
    },
    async delete(req, res) {
        const {id} = req.params
        if (id) {
            try {
                const result = await productModel.delete(id)
                return res.json(result)
            } catch (e) {
                return res.status(500).json({message: "Le produit n'existe pas"})
            }
        }
        return res.status(400).json({message: "Veuillez renseigner l'id du produit"})
    },
}
