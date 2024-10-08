import Habit from '#models/habit'
import Category from '#models/category'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HabitsController {
  async store({ request, auth, response, session }: HttpContextContract) {
    const user = auth.user

    try {
      const data = request.only(['name', 'description', 'priority', 'status', 'categoryId'])

      // Verifica se a categoria existe antes de prosseguir
      const category = await Category.find(data.categoryId)
      if (!category) {
        session.flash('notificacao', {
          type: 'danger',
          message: 'Categoria inválida!',
        })
        return response.redirect().back()
      }

      // Criação do novo hábito
      const habit = new Habit()
      habit.fill(data)
      habit.userId = user?.id

      await habit.save()

      session.flash('notificacao', {
        type: 'success',
        message: `Hábito ${habit.name} cadastrado com sucesso!`,
      })
      return response.redirect().toRoute('habits.index')
    } catch (error) {
      console.error('Erro ao cadastrar hábito:', error)
      session.flash('notificacao', {
        type: 'danger',
        message: 'Erro ao cadastrar hábito!',
      })
      return response.redirect().toRoute('habits.index')
    }
  }

  async index({ auth, view }: HttpContextContract) {
    const user = auth.user
    const habits = await Habit.query().where('user_id', user.id).preload('category')

    return view.render('pages/habitos/habitos-list', { habits })
  }
  async loadCategories() {
    const categories = await Category.all()
    return categories
  }

  // Função para criar um hábito, reutilizando o método de carregar categorias
  async create({ view }: HttpContextContract) {
    const categories = await this.loadCategories()
    return view.render('pages/habitos/add-habits', { categories })
  }

  async edit({ params, view }: HttpContextContract) {
    const habit = await Habit.findOrFail(params.id)
    const categories = await Category.all()

    return view.render('pages/habitos/add-habits', { habit, categories })
  }
  async show({ params, auth, response }: HttpContextContract) {
    const user = auth.user
    const habit = await Habit.query().where('userId', user.id).andWhere('id', params.id).first()

    if (!habit) {
      return response.notFound({ message: 'Hábito não encontrado' })
    }

    return habit
  }

  async update({ params, request, auth, response, session }: HttpContextContract) {
    const habit = await Habit.findOrFail(params.id)

    const data = request.only(['name', 'description', 'priority', 'status', 'categoryId'])
    habit.merge(data)
    await habit.save()

    session.flash('notificacao', {
      type: 'success',
      message: `Hábito ${habit.name} atualizado com sucesso!`,
    })

    return response.redirect().toRoute('habits.index')
  }

  async destroy({ params, auth, response }: HttpContextContract) {
    const user = auth.user
    const habit = await Habit.query().where('userId', user.id).andWhere('id', params.id).first()

    if (!habit) {
      return response.notFound({ message: 'Hábito não encontrado' })
    }

    try {
      await habit.delete()
      return response.redirect().toRoute('habits.index')
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao deletar a categoria' })
    }
  }
}
