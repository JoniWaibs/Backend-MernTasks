// const mongoose = require('mongoose')
// require('dotenv').config({path: 'variables.env'})//variables de entorno donde esta la url de conexion

// //conectar
// const conectarDB = async () =>{

//     try{
//         await mongoose.connect(process.env.DB_CONNECT , {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//             useFindAndModify: true,
//         });
//         console.log('DB Conectada')
//     }catch( err ){
//         console.log( err )
//         process.exit(1) //detener la aplicacion
//     };
    
// };
// module.exports = conectarDB;