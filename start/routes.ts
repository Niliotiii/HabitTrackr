/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const UserController = () => import('#controllers/users_controller')
const CategoryController = () => import('#controllers/categories_controller')
const AuthController = () => import('#controllers/auth_controller')
const HabitController = () => import('#controllers/habits_controller')

// Front
router.on('/login').render('pages/auth/login')
router.on('/register').render('pages/auth/register')

router
  .group(() => {
    router.on('/').render('pages/home')
    router.on('/autor').render('pages/autor')
    router.on('/user-edit').render('pages/users/user-edit')
  })
  .use(middleware.auth())

// Back
router.post('/login', [AuthController, 'login'])
router.post('/register', [UserController, 'store'])

router
  .group(() => {
    router.get('logout', async ({ auth, response }) => {
      await auth.use('web').logout()
      return response.redirect('/login')
    })

    router.post('/users/:id', [UserController, 'update'])
    router.resource('categories', CategoryController).apiOnly()
    router.resource('habits', HabitController).apiOnly()
  })
  .use(middleware.auth())
