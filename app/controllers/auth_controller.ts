import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Verifica as credenciais do usuário
      const user = await User.verifyCredentials(email, password)

      if (!user) {
        throw new Error('Invalid credentials')
      }

      // Autentica o usuário
      await auth.use('web').login(user)

      // Redireciona para a página inicial com a sessão atualizada
      return response.redirect('/')
    } catch (error) {
      // Se houver um erro (ex.: credenciais inválidas), exibe uma notificação de erro
      session.flash('notificacao', {
        type: 'danger',
        message: 'Usuário ou senha incorretos',
      })
      return response.redirect('back')
    }
  }
}
