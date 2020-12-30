const modelProject = require('../Models/ProjectModel')
const { validationResult } = require('express-validator')

const projectController = {

    getProjects:  async (req , res) =>{
       
        try{
            const result = await modelProject.find({userID : req.userID})
            return res.status(200).json(result)
        }catch(error) {
            console.log(error)
            return res.status(404).json({msj: 'No se pudo obtener proycetos.'})
        }
    
    },
    addProject: async (req , res) =>{
        //validar campos antes de crear el proyecto
        const error = validationResult(req)
        if(! error.isEmpty() ) return res.status(400).json({errores: error.array()})

        try{
            //chequear que no este duplicado
            const newProjectCreated = new modelProject(req.body)
            //Asignar el id del user
            newProjectCreated.userID = req.userID
            //guardar
            const newProjectSaved = await newProjectCreated.save()

            return res.status(200).json(newProjectSaved)

        } catch (error) {
            console.log(error)
            return res.status(404).json({msj: 'No se pudo guardar el proyecto, intenta nuevamente!'})
        }

    },
    editProject: async (req, res) =>{

        //validar campos antes de crear el proyecto
        const error = validationResult(req)
        if(! error.isEmpty() ) return res.status(400).json({errores: error.array()})

        const { id } = req.params
        const { nombre } = req.body

        //crear un nuevo objeto
        const upadatedProject = {}

        if(nombre){
            upadatedProject.nombre = nombre
        }

        try {

            //capturar el proyecto por su id
            const result = await modelProject.findById(id)
            console.log(result)
            if( !result ) return res.status(404).json({ msj: 'No existe el proyecto.' })

            //comparar el id del usuario que lo registro contra el id del usuario login
            if(result.userID.toString() !== req.userID.toString()){ return res.status(401).json({msj: 'No tiene credenciales suficientes para realizar esta operacion'})}
            
            //actualziar
            const updatedOK = await modelProject.findByIdAndUpdate({_id : id } , { $set : upadatedProject } , { new : true})
            return res.status(200).json(updatedOK)
            

        } catch (error) {
            console.log(error)
            return res.status(404).json({msj: 'No se pudo editar el proyecto, intenta nuevamente!'})
        }
    },
    deleteProject: async (req, res) =>{

        const { id } = req.params

        try {
            //validar que el proyecto exista
            const result = await modelProject.findById(id)
            if( !result ) return res.status(404).json({msj: 'No existe el proyecto'})
            
            //valdiar que el usuario sea el autorizado a borrar
            if(result.userID.toString() !== req.userID.toString()) return res.status(401).json({msj: 'No tiene credenciales validas'})

            //borrar el proyecto
            await modelProject.findByIdAndDelete(id)
            return res.status(200).json({msj: 'Proyecto borrado correctamente'})

        } catch (error) {
            console.log(error)
            if( !result ) return res.status(404).json({msj: 'No se puede eliminar el proyecto'})
        }
    }

}

module.exports = projectController;