import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, auth, response, session, view }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      // Tenta autenticar o usuário
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      // Redireciona para uma rota protegid
      return view.render('pages/home', { user })
    } catch (error) {
      return response
        .status(400)
        .send(`<script>alert('Erro ao fazer login'); window.location.href='/register';</script>`)
    }
  }
}
