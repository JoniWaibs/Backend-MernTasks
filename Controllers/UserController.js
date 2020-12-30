const userModel = require("../Models/UserModel");
const bcryptjs = require('bcryptjs')
const { validationResult } = require('express-validator')
const jwt =require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'})

const userController = {
  
  newUser: async (req, res) => {
    //validar campos antes de crear el usuario
    const error = validationResult(req)
    if(! error.isEmpty() ) return res.status(400).json({errores: error.array()})

    // conseguir mail y pass para ejecutar acciones en la base de datos( validacion de mail y hasheo de pass)
    const { email , password } = req.body;

    try {
      //revisar que el email no este duplicado
      let user = await userModel.findOne({ email })
      if( user ) return res.status(400).json({ msj: 'El usuario ya esta registrado' })
      //registrar el usuario
      user = new userModel(req.body);
      //hashear el password
      const salt = await bcryptjs.genSalt(10)
      user.password = await bcryptjs.hash( password, salt )//el password que registro el usuario + el salt
      //guardar el usuario
      await user.save();
      //generar un token
      const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: 864000 })
      //console.log({token})
      res.status(200).json({ token })
    } catch (err) {
      console.log(err);
      res.status(200).send("Hubo un error");
    }

  },
  
};
module.exports = userController;
