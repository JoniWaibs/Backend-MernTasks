const express = require('express');
const router = require('./Router/Routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config({path: 'variables.env'})//variables de entorno donde esta la url de conexion
const cors = require('cors')


const app = express();
const PORT = process.env.PORT || 4000;

//conexion a la ddbb
conectarDB();
async function conectarDB(){

    try{
        await mongoose.connect(process.env.DB_CONNECT , {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: true,
            useCreateIndex: true,
        });
        console.log('DB Conectada')
        //arrancar la api
        app.listen(PORT, ()=> console.log(`Servidor corriendo en el puerto ${PORT}`));
    }catch( err ){
        console.log( err )
        process.exit(1) //detener la aplicacion
    };
    
};
//habilitar cors
app.use(cors())
//Habilitar bodyparser para leer datos de formularios
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))//Se habilita

//rutas de la api
app.use('/api/', router);

