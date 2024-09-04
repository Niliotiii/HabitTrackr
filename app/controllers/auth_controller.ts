import User from '#models/user'
import { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  async login({ request, auth, response, session }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    try {
      const user = await User.verifyCredentials(email, password)
      await auth.use('web').login(user)

      session.flash({ user })
      return response.redirect('/')
    } catch (error) {
      return response
        .status(400)
        .send(`<script>alert('Erro ao fazer login'); window.location.href='/login';</script>`)
    }
  }
}
