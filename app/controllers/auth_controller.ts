import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  // async register({ request, auth, response }: HttpContextContract) {
  //   const { email, password } = request.only(['email', 'password'])

  //   // Cria um novo usuário
  //   const user = await User.create({ email, password })

  //   // Loga o usuário automaticamente
  //   await auth.login(user)

  //   return response.redirect('/')
  // }

  async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Tenta autenticar o usuário
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      // Redireciona para uma rota protegida
      response.redirect('/')
    } catch (error) {
      // Define uma mensagem de erro na sessão
      session.flash({ error: 'Credenciais inválidas. Por favor, tente novamente.' })

      // Redireciona de volta para a página de login
      response.redirect('back')
    }
  }

  // async logout({ auth, response }: HttpContextContract) {
  //   await auth.logout()

  //   return response.redirect('/')
  // }
}
