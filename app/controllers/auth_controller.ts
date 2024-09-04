import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
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

  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()

    return response.redirect('/')
  }
}
