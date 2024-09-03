import Habit from '#models/habit'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HabitsController {
  // Função para criar um novo hábito
  public async store({ request, auth, response }: HttpContextContract) {
    const user = auth.user

    console.log('user', user)

    const data = request.only(['name', 'description', 'priority', 'status', 'categoryId'])

    const habit = new Habit()
    habit.fill(data)
    habit.user = user.id

    await habit.save()

    return response.created(habit)
  }

  // Função para buscar todos os hábitos do usuário logado
  public async index({ auth }: HttpContextContract) {
    const user = auth.user
    const habits = await Habit.query().where('user_id', user.id)

    return habits
  }

  // Função para buscar um hábito específico por ID do usuário logado
  public async show({ params, auth, response }: HttpContextContract) {
    const user = auth.user
    const habit = await Habit.query().where('userId', user.id).andWhere('id', params.id).first()

    if (!habit) {
      return response.notFound({ message: 'Hábito não encontrado' })
    }

    return habit
  }

  // Função para editar um hábito específico por ID do usuário logado
  public async update({ params, request, auth, response }: HttpContextContract) {
    const user = auth.user
    const habit = await Habit.query().where('userId', user.id).andWhere('id', params.id).first()

    if (!habit) {
      return response.notFound({ message: 'Hábito não encontrado' })
    }

    const data = request.only(['name', 'description', 'priority', 'status', 'categoryId'])
    habit.merge(data)

    await habit.save()

    return habit
  }

  // Função para deletar um hábito específico por ID do usuário logado
  public async destroy({ params, auth, response }: HttpContextContract) {
    const user = auth.user
    const habit = await Habit.query().where('userId', user.id).andWhere('id', params.id).first()

    if (!habit) {
      return response.notFound({ message: 'Hábito não encontrado' })
    }

    await habit.delete()

    return response.noContent()
  }
}
