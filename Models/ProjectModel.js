const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({

    nombre:{
        type: String,
        require: true,
        trim: true
    },
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    fecha:{
        type: Date,
        default: Date.now()
    }

});
module.exports = mongoose.model('modelProject' , projectSchema)