const express = require('express')
const router = express.Router()
const userController = require('../Controllers/UserController')
const authController = require('../Controllers/AuthController')
const projectController = require('../Controllers/ProjectController')
const taskController = require('../Controllers/TasksController')
const { check } = require('express-validator')
const { userToken } = require('../Middlewares/Middleware')


router.get('/', (req , res) => { res.status(200).send('Hello World from RestApi') });

//Rutas para usuarios
router.get('/users' ,userToken, authController.authUser ),
router.post('/users/signin' ,
    //agregar una capa de validacion
    [
        check('nombre' , 'El nombre es obligatorio').not().isEmpty(),//chequea el nombre que no venga vacio
        check('email' , 'El email es obligatorio').isEmail(),//chequea el email que no venga vacio
        check('password' , 'El password debe ser contener al menos 6 caracteres').isLength({min: 6}),//chequea el pass
    ],
    userController.newUser
),
router.post('/users/login' , 
    [
        check('email' , 'El email es obligatorio').isEmail(),
        check('password' , 'El password debe ser contener al menos 6 caracteres').isLength({min: 6}),
    ],
    authController.LoginUser
),
//usuario autenticado



//rutas para proyectos
router.get('/projects' ,userToken, projectController.getProjects)
router.post('/projects' , 
    [
        check('nombre' , 'El nombre es obligatorio').not().isEmpty(),
    ],
    userToken, projectController.addProject
),
router.put('/projects/:id' , 
    [
        check('nombre' , 'El nombre es obligatorio').not().isEmpty(),
    ],
    userToken, projectController.editProject
),
router.delete('/projects/:id' , userToken, projectController.deleteProject)


//rutas de las tareas
router.get('/tareas' , 
[
    check('proyectoId' , 'El ID del proyecto es obligatorio').not().isEmpty(),
], 
    userToken, taskController.getTasks
)
router.post('/tareas' , 
    [
        check('nombre' , 'El nombre es obligatorio').not().isEmpty(),
    ],
    userToken, taskController.addTasks
)
router.put('/tareas/:id' ,
    [
        check('nombre' , 'El nombre es obligatorio').not().isEmpty(),
    ], 
    userToken, taskController.updateTask
)
router.delete('/tareas/:id', userToken, taskController.deleteTastk)



module.exports = router;