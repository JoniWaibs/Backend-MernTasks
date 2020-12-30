const modelTasks = require('../Models/TasksModel')
const modelProjects = require('../Models/ProjectModel')
const { validationResult } = require('express-validator')


const tasksController = {

    getTasks: async (req , res)=>{ 
        //validar campos antes de crear el proyecto
        const error = validationResult(req)
        if(! error.isEmpty() ) return res.status(400).json({errores: error.array()})
        
        const{ proyectoId } = req.query


        try {
            //validar si el proyecto existe    
            const exists = await modelProjects.findById(proyectoId)
            if( !exists ) return res.status(404).json({msj: 'No hay un proyecto disponible'})

            //validar que corresponda al usuario
            if( exists.userID.toString() !== req.userID ) return res.status(401).json({msj: 'No tiene credenciales suficientes'})
            
            const result = await modelTasks.find({proyectoId: exists._id})
            // console.log(result)
            return res.status(200).json(result)


        } catch (error) {
            console.log(error)
            return res.status(404).json({msj: "No se pudo obtener la tarea, intente nuevamente"})    
            
        }

       

    },
    addTasks: async (req , res) =>{
        //validar campos antes de crear el proyecto
        const error = validationResult(req)
        if(! error.isEmpty() ) return res.status(400).json({errores: error.array()})

        const { proyectoId } = req.body

        try{
            //validar si el proyecto existe    
            const exists = await modelProjects.findById(proyectoId)
            if( !exists ) return res.status(404).json({msj: 'No hay un proyecto disponible'})

            //validar que corresponda al usuario
            if( exists.userID.toString() !== req.userID ) return res.status(401).json({msj: 'No tiene credenciales suficientes'})

            //crear la nueva tarea y asignar el id del proyecto
            const newTask = new modelTasks( req.body )
            const newTaskSaved = await newTask.save()

            return res.status(200).json(newTaskSaved)    
            
        }catch(error) {
            console.log(error)
            return res.status(404).json({msj: "No se pudo agregar la tarea, intente nuevamente"})    
        }

    },
    updateTask: async (req , res) =>{
        //validar campos antes de crear el proyecto
        const error = validationResult(req)
        if(! error.isEmpty() ) return res.status(400).json({errores: error.array()})

        const { id } = req.params
        const { proyectoId, nombre , estado } = req.body
        const updatedTask = {}


        if( nombre ){
            updatedTask.nombre = nombre
            updatedTask.estado = estado
        }  

        try {
            //validar la tarea
            const tareaExist = await modelTasks.findById(id)
            if( !tareaExist ) return res.status(404).json({msj: 'La tarea no existe'})
 
            //validar que exista el proyecto 
            const proyectoExists = await modelProjects.findById(proyectoId)
            if( !proyectoExists ) return res.status(404).json({msj: 'El proyecto no existe'})
 
            //validar que corresponda al usuario
            if( proyectoExists.userID.toString() !== req.userID ) return res.status(401).json({msj: 'No tiene credenciales suficientes'})

            //actualziar
            const updatedOK = await modelTasks.findByIdAndUpdate({_id : id } , { $set : updatedTask } , { new : true})
            return res.status(200).json(updatedOK)

        } catch (error) {
            console.log(error)
            return res.status(404).json({msj: "No se pudo actualizar la tarea, intente nuevamente"})    
        }


    },
    deleteTastk: async (req , res)=>{
       
        //obtener el id de la tarea y el proyecto
        const { id } = req.params
        const { proyectoId } =  req.query

        try {

            //validar la tarea
            const tareaExist = await modelTasks.findById(id)
            if( !tareaExist ) return res.status(404).json({msj: 'La tarea no existe'})

            //validar que exista el proyecto 
            const proyectoExists = await modelProjects.findById(proyectoId)
            if( !proyectoExists ) return res.status(404).json({msj: 'El proyecto no existe'})

            //validar que corresponda al usuario
            if( proyectoExists.userID.toString() !== req.userID ) return res.status(401).json({msj: 'No tiene credenciales suficientes'})

            //borrar la tarea 
            await modelTasks.findByIdAndDelete(id)
            return res.status(200).json({msj: 'Tarea borrada correctamente'})

        } catch (error) {
            console.log(error)
            return res.status(404).json({msj: "No se pudo eliminar la tarea, intente nuevamente"})    
        }
    }

};
module.exports = tasksController;

