/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const UserController = () => import('#controllers/users_controller')
const CategoryController = () => import('#controllers/categories_controller')
const AuthController = () => import('#controllers/auth_controller')
const HabitController = () => import('#controllers/habits_controller')

// Front
router.on('/login').render('pages/login')
router.on('/register').render('pages/register')

router
  .group(() => {
    router.on('/').render('pages/home')
    router.on('/autor').render('pages/autor')
    
  })
  .use(middleware.auth())

// Back
router.post('/login', [AuthController, 'login'])
router.post('/register', [UserController, 'store'])

router
  .group(() => {
    router.get('/logout', [AuthController, 'logout'])

    router.resource('users', UserController).apiOnly()
    router.resource('categories', CategoryController).apiOnly()
    router.resource('habits', HabitController).apiOnly()
  })
  .use(middleware.auth())
