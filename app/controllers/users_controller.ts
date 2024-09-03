import User from '#models/user'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserController {
  // Buscar todos os usuários
  public async index({}: HttpContextContract) {
    const users = await User.all()
    return users
  }

  // Criar um novo usuário
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password', 'dateOfBirth', 'sex'])

    try {
      const user = await User.create(data)

      return response.status(201).json(user)
    } catch (error) {
      console.log(error)
      return response.status(400).json({ error: 'Erro ao criar usuário' })
    }
  }

  // Buscar um usuário por ID
  public async show({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      return user
    } catch (error) {
      return response.status(404).json({ error: 'Usuário não encontrado' })
    }
  }

  // Editar/Atualizar um usuário
  public async update({ params, request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'password', 'dateOfBirth', 'sex'])

    try {
      const user = await User.findOrFail(params.id)
      user.merge(data)
      await user.save()
      return user
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao atualizar usuário' })
    }
  }

  // Deletar um usuário
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)
      await user.delete()
      return response.status(204).json({})
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao deletar usuário' })
    }
  }
}
