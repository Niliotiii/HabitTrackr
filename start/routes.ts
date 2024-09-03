/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const UserController = () => import('#controllers/users_controller')
const CategoryController = () => import('#controllers/categories_controller')

router.on('/').render('pages/home')
// router.on('/autor').render('pages/autor')

router.resource('users', UserController).apiOnly()
router.resource('categories', CategoryController).apiOnly()
