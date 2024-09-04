// app/Controllers/Http/DashboardController.ts
import ActivityRegister from '#models/activity-register'
import Goal from '#models/goal'
import Habit from '#models/habit'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DashboardController {
  public async index({ view, auth }: HttpContextContract) {
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

    // Obter as metas do usuário e calcular as atividades registradas e a porcentagem de conclusão
    const goals = await Goal.query().where('userId', user.id)

    const goalsDetails = await Promise.all(
      goals.map(async (goal) => {
        // Buscar atividades relacionadas a cada meta
        const activities = await ActivityRegister.query()
          .where('goalId', goal.id)
          .where('userId', user.id)

        const activitiesCount = activities.length
        const completionPercentage =
          goal.quantidade > 0 ? (activitiesCount / goal.quantidade) * 100 : 0

        return {
          ...goal.toJSON(),
          activitiesCount,
          completionPercentage: completionPercentage.toFixed(2),
          activitiesList: activities.map((activity) => activity.name),
        }
      })
    )

    // Renderizar a view com os dados
    return view.render('pages/home', {
      habitsCount: habitsTotal,
      goalsCount: goalsTotal,
      activitiesCount: activitiesTotal,
      goalsDetails,
    })
  }
}
