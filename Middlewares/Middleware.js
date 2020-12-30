const userModel = require("../Models/UserModel");
const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})

const verifyToken = {

    userToken: async ( req, res, next ) => {

        try {
            const headerInfo = req.headers['x-data-token']
            if( !headerInfo ) return res.status(404).json( {msj: 'No tiene permisos'} )

            const decoded = await jwt.verify( headerInfo , process.env.SECRET )
        
            const userVerified = await userModel.findById(decoded.id)
            if( !userVerified ) return res.status(404).json( {msj:'No tiene permisos'} )

            //agregar el id de usuario al req para bajarlo en el controller y guardarlo en el proyecto
            req.userID = decoded.id

            next();

        } catch (error) {
            return res.status(404).json( {msj: 'Token Invalido'} )
        };

    },

};
module.exports = verifyToken;