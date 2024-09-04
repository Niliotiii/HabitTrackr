import Habit from '#models/habit'
import Category from '#models/category'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HabitsController {
  // Função para criar um novo hábito
  async store({ request, auth, response }: HttpContextContract) {
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
  async index({ auth, view }: HttpContextContract) {
    const user = auth.user
    const habits = await Habit.query().where('user_id', user.id)

    return view.render('pages/habitos/habitos-list', { habits })
  }
  // Método para carregar categorias (pode ser reutilizado por outros métodos)
  async loadCategories() {
    const categories = await Category.all()
    return categories
  }

  // Função para criar um hábito, reutilizando o método de carregar categorias
  async create({ view }: HttpContextContract) {
    const categories = await this.loadCategories()
    return view.render('pages/habitos/add-habits', { categories })
  }


  // Função para buscar um hábito específico por ID do usuário logado
  async show({ params, auth, response }: HttpContextContract) {
    const user = auth.user
    const habit = await Habit.query().where('userId', user.id).andWhere('id', params.id).first()

    if (!habit) {
      return response.notFound({ message: 'Hábito não encontrado' })
    }

    return habit
  }

  // Função para editar um hábito específico por ID do usuário logado
  async update({ params, request, auth, response }: HttpContextContract) {
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
  async destroy({ params, auth, response }: HttpContextContract) {
    const user = auth.user
    const habit = await Habit.query().where('userId', user.id).andWhere('id', params.id).first()

    if (!habit) {
      return response.notFound({ message: 'Hábito não encontrado' })
    }

    await habit.delete()

    return response.noContent()
  }
}
