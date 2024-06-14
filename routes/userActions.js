const {hash} = require("../utils/hash.util");
const userModel = require("../models/user");
const {generateJWT, getPayload} = require("../utils/jwt.util");

module.exports = {
    async register(req, res) {
        const {email, firstname, lastname, password} = req.body
        if (email && password && firstname && lastname) {
            const hashPassword = await hash(password)
            try {
                const data = await userModel.create({
                    email, firstname, lastname,
                    password: hashPassword,
                    active: true
                })
                const {_id} = data
                return res.json({_id, email, firstname, lastname,})
            } catch (e) {
                return res.status(400).json({
                    message: "L'email renseigné est déjà utilisé"
                })
            }
        }
        return res.status(400).json({
            message: "Pour s'inscrire il faut renseigner : email, password, firstname, lastname"
        })
    },
    async login(req, res) {
        const {email, password} = req.body
        if (email && password) {
            try {
                console.log(await hash(password))
                const user = (await userModel.getByEmailAndPassword(email, await hash(password)))
                if (user) {
                    const token = generateJWT({
                        id: user['_id'],
                    })
                    return res.cookie("token",token).json({token})
                }
                return res.status(400).json({message: "L'utilisateur n'est pas reconnu"})
            }catch(e) {
                return res.status(400).json({message: "Nous ne parvenons pas à réaliser la requette au niveau de la base de données"})
            }
        }
        return res.status(400).json({message: "Pour se connecter, il faut renseigner : email, password"})
    },
    async get(req, res) {
        const {id} = getPayload(req)
        if (id) {
            try {
                const user = await userModel.get(id)
                delete user.active
                delete user.password
                return res.json(user)
            } catch (e) {
                console.log(e)
                return res.json({message: "L'utilisateur n'existe pas"})
            }
        }
        return res.status(400).json({message: "Veuillez vous authentifier"})
    },
    async updateInformations(req, res) {
        const {id} = getPayload(req)
        if(id){
            console.log(req.body)
            const {firstname, lastname} = req.body
            if (firstname || lastname) {
                try{
                    const updatedUser = await userModel.update(id, {firstname,lastname});
                    delete updatedUser.active
                    delete updatedUser.password
                    return res.json(updatedUser)
                } catch (e) {
                    return res.json({message: "Nous n'avons pas réussi à modifier vos infromations"})
                }
            }
            return res.status(400).json({message: "il manque le firstname ou le lastname"})
        }
        return res.status(400).json({message: "Veuillez vous authentifier"})
    },
    async updatePassword(req, res) {
        const {id} = getPayload(req)
        if (id) {
            const {password, newPassword} = req.body
            if (password && newPassword) {
                const oldPassword = await hash(password)
                try {
                    const user = (await userModel.get(id))
                    if (user.password == oldPassword) {
                        try {
                            const data = await userModel.update(id, {
                                password: await hash(newPassword)
                            })
                            return res.json({message: "success"})
                        } catch(e) {
                            return res.status(400).json({message: "U  problème est survenu, veillez reéssayer ulterieurement"})
                        }
                    }
                    return res.status(400).json({message: "Le mot de passe actuel est faux"})
                } catch(e) {
                    return res.status(400).json({message: "L'utilisateur n'existe pas"})
                }
            }
            return res.status(400).json({message: "Veuillez renseigner le password et le newPassword"})
        }
        return res.status(400).json({message: "Veuillez vous authentifier"})
    }
}