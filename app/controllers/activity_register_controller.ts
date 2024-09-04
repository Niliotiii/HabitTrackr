import ActivityRegister from '#models/activity-register'
import Habit from '#models/habit'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ActivityRegistersController {
  // Função para criar um novo registro de atividade
  async store({ request, auth, response, session }: HttpContextContract) {
    const user = auth.user

    try {
      // Captura os dados enviados do formulário
      const data = request.only([
        'name',
        'description',
        'start_date',
        'end_date',
        'duration_hours',
        'status',
        'habitId',
      ])

      // Cria um novo registro de atividade
      const activityRegister = new ActivityRegister()
      activityRegister.fill(data)
      activityRegister.userId = user.id // Atribui o usuário logado ao registro

      // Salva o registro no banco de dados
      await activityRegister.save()

      session.flash('notificacao', {
        type: 'success',
        message: `Registro de atividade ${activityRegister.name} cadastrado com sucesso!`,
      })

      return response.redirect().toRoute('activities.index')
    } catch (error) {
      session.flash('notificacao', {
        type: 'danger',
        message: 'Erro ao criar registro de atividade!',
      })
      return response.redirect().toRoute('activities.create')
    }
  }

  // Função para buscar todos os registros de atividades do usuário logado
  async index({ auth, view }: HttpContextContract) {
    const user = auth.user
    const activityRegisters = await ActivityRegister.query()
      .where('user_id', user.id)
      .preload('habit')

    return view.render('pages/atividades/atividades-list', { activityRegisters })
  }

  // Método para carregar os hábitos disponíveis para o usuário
  async loadHabits(userId: number) {
    const habits = await Habit.query().where('user_id', userId)
    return habits
  }

  // Função para criar um novo registro de atividade, carregando os hábitos
  async create({ auth, view }: HttpContextContract) {
    const user = auth.user
    const habits = await this.loadHabits(user.id)

    return view.render('pages/atividades/atividades-add', { habits })
  }

  // Função para buscar um registro de atividade específico por ID do usuário logado
  async show({ params, auth, response }: HttpContextContract) {
    const user = auth.user
    const activityRegister = await ActivityRegister.query()
      .where('userId', user.id)
      .andWhere('id', params.id)
      .preload('habit')
      .first()

    if (!activityRegister) {
      return response.notFound({ message: 'Registro de atividade não encontrado' })
    }

    return activityRegister
  }

  // Função para editar um registro de atividade específico por ID do usuário logado
  async update({ params, request, auth, response, session }: HttpContextContract) {
    const user = auth.user
    const activityRegister = await ActivityRegister.query()
      .where('userId', user.id)
      .andWhere('id', params.id)
      .first()

    if (!activityRegister) {
      session.flash('notificacao', {
        type: 'danger',
        message: 'Registro de atividade não encontrado!',
      })
      return response.redirect().toRoute('activities.index')
    }

    const data = request.only([
      'name',
      'description',
      'start_date',
      'end_date',
      'duration_hours',
      'status',
      'habitId',
    ])

    // Atualiza o registro de atividade com os novos dados
    activityRegister.merge(data)
    await activityRegister.save()

    session.flash('notificacao', {
      type: 'success',
      message: `Registro de atividade ${activityRegister.name} atualizado com sucesso!`,
    })

    return response.redirect().toRoute('activities.index')
  }

  // Função para deletar um registro de atividade específico por ID do usuário logado
  async destroy({ params, auth, response, session }: HttpContextContract) {
    const user = auth.user
    const activityRegister = await ActivityRegister.query()
      .where('userId', user.id)
      .andWhere('id', params.id)
      .first()

    if (!activityRegister) {
      session.flash('notificacao', {
        type: 'danger',
        message: 'Registro de atividade não encontrado!',
      })
      return response.redirect().toRoute('activities.index')
    }

    try {
      await activityRegister.delete()
      session.flash('notificacao', {
        type: 'success',
        message: `Registro de atividade deletado com sucesso!`,
      })
      return response.redirect().toRoute('activities.index')
    } catch (error) {
      session.flash('notificacao', {
        type: 'danger',
        message: 'Erro ao deletar registro de atividade!',
      })
      return response.redirect().toRoute('activities.index')
    }
  }
}
