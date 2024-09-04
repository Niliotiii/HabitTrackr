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

    console.log(habitsCountResult, goalsCountResult, activitiesCountResult)

    // Obter o valor da contagem
    const habitsTotal = habitsCountResult[0]?.$extras?.total || 0
    const goalsTotal = goalsCountResult[0]?.$extras?.total || 0
    const activitiesTotal = activitiesCountResult[0]?.$extras?.total || 0

    // Obter os hábitos do usuário e discriminar a proporção de atividades registradas
    const habits = await Habit.query().where('userId', user.id).preload('category') // Opcional, se você deseja carregar a categoria do hábito

    const habitsDetails = await Promise.all(
      habits.map(async (habit) => {
        // Buscar metas relacionadas a cada hábito
        const goals = await Goal.query().where('habitId', habit.id).where('userId', user.id)

        // Buscar atividades relacionadas a cada meta
        const goalsDetails = await Promise.all(
          goals.map(async (goal) => {
            const activities = await ActivityRegister.query()
              .where('habitId', habit.id)
              .where('userId', user.id)
            return {
              ...goal.toJSON(),
              activities,
            }
          })
        )

        return {
          ...habit.toJSON(),
          totalGoals: goals.length,
          completedGoals: goalsDetails.filter((goal) => goal.activities.length > 0).length,
          goals: goalsDetails,
        }
      })
    )

    // Renderizar a view com os dados
    return view.render('pages/home', {
      habitsCount: habitsTotal,
      goalsCount: goalsTotal,
      activitiesCount: activitiesTotal,
      habitsDetails,
    })
  }
}
