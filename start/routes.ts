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
const GoalController = () => import('#controllers/goal_controller')
const ActivityRegister = () => import('#controllers/activity_register_controller')
const DashboardController = () => import('#controllers/dashboard_controller')

// Front
router.on('/login').render('pages/auth/login')
router.on('/register').render('pages/auth/register')

router
  .group(() => {
    // router.on('/').render('pages/home')
    router.on('/autor').render('pages/autor')
    router.on('/user-edit').render('pages/users/user-edit')

    // Categories
    router.on('/categories/new').render('pages/categorias/create')
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

    router.get('/', [DashboardController, 'index'])

    router.post('/user-edit/:id', [UserController, 'update'])
    router.post('/user-delete/:id', [UserController, 'destroy'])
    router.resource('users', UserController).apiOnly()
    router.resource('categories', CategoryController)
    router.resource('habits', HabitController)
    router.resource('goals', GoalController)
    router.resource('activities', ActivityRegister)
  })
  .use(middleware.auth())
