import Goal from '#models/goal'
import Habit from '#models/habit'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GoalsController {
  // Função para criar uma nova meta
  async store({ request, auth, response, session }: HttpContextContract) {
    const user = auth.user

    try {
      // Captura os dados enviados do formulário
      const data = request.only([
        'frequencia',
        'quantity',
        'start_date',
        'end_date',
        'score',
        'status',
        'habitId',
      ])

      // Cria uma nova meta
      const goal = new Goal()
      goal.fill(data)
      goal.userId = user.id // Atribui o usuário logado à meta

      // Salva a meta no banco de dados
      await goal.save()

      session.flash('notificacao', {
        type: 'success',
        message: `Meta de ${goal.frequencia} cadastrada com sucesso!`,
      })

      return response.redirect().toRoute('goals.index')
    } catch (error) {
      session.flash('notificacao', {
        type: 'danger',
        message: 'Erro ao criar meta!',
      })
      return response.redirect().toRoute('goals.create')
    }
  }

  // Função para buscar todas as metas do usuário logado
  async index({ auth, view }: HttpContextContract) {
    const user = auth.user
    const goals = await Goal.query().where('user_id', user.id).preload('habit')

    return view.render('pages/metas/metas-list', { goals })
  }

  // Método para carregar os hábitos disponíveis para o usuário
  async loadHabits(userId: number) {
    const habits = await Habit.query().where('user_id', userId)
    return habits
  }

  // Função para criar uma nova meta, carregando os hábitos
  async create({ auth, view }: HttpContextContract) {
    const user = auth.user
    const habits = await this.loadHabits(user.id)

    return view.render('pages/metas/metas-add', { habits })
  }

  // Função para buscar uma meta específica por ID do usuário logado
  async show({ params, auth, response }: HttpContextContract) {
    const user = auth.user
    const goal = await Goal.query()
      .where('userId', user.id)
      .andWhere('id', params.id)
      .preload('habit')
      .first()

    if (!goal) {
      return response.notFound({ message: 'Meta não encontrada' })
    }

    return goal
  }

  // Função para editar uma meta específica por ID do usuário logado
  async update({ params, request, auth, response, session }: HttpContextContract) {
    const user = auth.user
    const goal = await Goal.query().where('userId', user.id).andWhere('id', params.id).first()

    if (!goal) {
      session.flash('notificacao', { type: 'danger', message: 'Meta não encontrada!' })
      return response.redirect().toRoute('goals.index')
    }

    const data = request.only([
      'frequencia',
      'quantity',
      'start_date',
      'end_date',
      'score',
      'status',
      'habitId',
    ])

    // Atualiza a meta com os novos dados
    goal.merge(data)
    await goal.save()

    session.flash('notificacao', {
      type: 'success',
      message: `Meta de ${goal.frequencia} atualizada com sucesso!`,
    })

    return response.redirect().toRoute('goals.index')
  }

  // Função para deletar uma meta específica por ID do usuário logado
  async destroy({ params, auth, response, session }: HttpContextContract) {
    const user = auth.user
    const goal = await Goal.query().where('userId', user.id).andWhere('id', params.id).first()

    if (!goal) {
      session.flash('notificacao', { type: 'danger', message: 'Meta não encontrada!' })
      return response.redirect().toRoute('goals.index')
    }

    try {
      await goal.delete()
      session.flash('notificacao', {
        type: 'success',
        message: `Meta deletada com sucesso!`,
      })
      return response.redirect().toRoute('goals.index')
    } catch (error) {
      session.flash('notificacao', {
        type: 'danger',
        message: 'Erro ao deletar meta!',
      })
      return response.redirect().toRoute('goals.index')
    }
  }
}
