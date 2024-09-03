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
router.on('/login').render('pages/login')

router
  .group(() => {
    router.on('/').render('pages/home')
    router.on('/autor').render('pages/autor')
    router.get('/logout', 'AuthController.logout')
    router.post('/login', 'AuthController.login')
  })
  .use(middleware.auth())

router.resource('users', UserController).apiOnly()
router.resource('categories', CategoryController).apiOnly()
