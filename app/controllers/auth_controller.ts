import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class AuthController {
  async register({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    // Cria um novo usuário
    const user = await User.create({ email, password })

    // Loga o usuário automaticamente
    await auth.login(user)

    return response.redirect('/')
  }

  async login({ request, auth, response }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    // Tenta autenticar o usuário
    await auth.attempt(email, password)

    return response.redirect('/')
  }

  async logout({ auth, response }: HttpContextContract) {
    await auth.logout()

    return response.redirect('/')
  }
}
