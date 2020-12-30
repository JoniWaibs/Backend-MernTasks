const mongoose = require('mongoose')

const TasksSchema = mongoose.Schema({
    nombre:{ 
        type: String, 
        require: true, 
        trim: true 
    } ,
    fecha:{ 
        type: Date, 
        default: Date.now() 
    } ,
    estado:{ 
        type: Boolean , 
        default: false 
    } ,
    proyectoId:{ 
        type: mongoose.Schema.Types.ObjectId
    } ,
});
module.exports = mongoose.model('modelTasks' , TasksSchema)
