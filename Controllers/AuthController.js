const userModel = require("../Models/UserModel");
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt =require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})

const authController ={

  LoginUser: async(req ,res) =>{
    //validar campos antes de iniciar sesion
    const error = validationResult(req)
    if(!error.isEmpty() ) return res.status(404).json({errores: error.array()})

    const { email , password } = req.body;
      
    try{

      const exists = await userModel.findOne({ email })
      if( !exists ) return res.status(404).json({ msj: 'No estas registrado, crea una cuenta gratis' })
            

      const checkedPassword = await bcryptjs.compare( password , exists.password )
      if( !checkedPassword ) return res.status(404).json({ msj: 'Tu contraseña es invalida' })
      //console.log(checkedPassword)

      const token = jwt.sign( {id: exists._id }, process.env.SECRET, { expiresIn: 864000 } )
            
      return res.status(200).json({ token })
      
    }catch( err ){
      console.log( err )
      return res.status(404).json({ msj:'Error al iniciar sesion, intenta nuevamente' })
    }
  },
  authUser : async (req ,res ) =>{
    try {
      const result = await userModel.findById(req.userID).select('-password')//traigo todo menos el pass
      res.status(200).json(result)     
    } catch (error) {
      console.log(error)
      return res.status(404).json({ msj:'Hubo un error' })
    }
    
  },

};

module.exports = authController
