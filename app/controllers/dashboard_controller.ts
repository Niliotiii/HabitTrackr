import ActivityRegister from '#models/activity-register'
import Goal from '#models/goal'
import Habit from '#models/habit'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DashboardController {
  async index({ view, auth }: HttpContextContract) {
    const user = auth.user!

    // Contar o número de registros
    const habitsCountResult = await Habit.query().where('userId', user.id).count('* as total')
    const goalsCountResult = await Goal.query().where('userId', user.id).count('* as total')
    const activitiesCountResult = await ActivityRegister.query()
      .where('userId', user.id)
      .count('* as total')

    // Obter o valor da contagem
    const habitsTotal = habitsCountResult[0]?.$extras?.total || 0
    const goalsTotal = goalsCountResult[0]?.$extras?.total || 0
    const activitiesTotal = activitiesCountResult[0]?.$extras?.total || 0

    // Obter as metas, incluindo os hábitos e os registros de atividades relacionados
    const goals = await Goal.query()
      .where('userId', user.id)
      .preload('habit', (habitQuery) => {
        habitQuery.preload('category')
      })
      .preload('activities', (activityQuery) => {
        activityQuery.where('userId', user.id)
      })

    // Estruturar os dados de metas, hábitos e atividades
    const goalsDetails = goals.map((goal) => {
      return {
        ...goal.toJSON(),
        habit: goal.habit.toJSON(),
        activities: goal.activities.map((activity) => activity.toJSON()),
      }
    })

    // Renderizar a view com os dados
    return view.render('pages/home', {
      habitsCount: habitsTotal,
      goalsCount: goalsTotal,
      activitiesCount: activitiesTotal,
      goalsDetails,
    })
  }
}
