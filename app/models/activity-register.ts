import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Habit from './habit.js'
import User from './user.js'

export default class ActivityRegister extends BaseModel {
  @column({ isPrimary: true })
  id: number

  @column()
  name: string

  @column()
  description: string

  @column.dateTime()
  start_date: DateTime

  @column.dateTime()
  end_date: DateTime

  @column()
  duration_hours: number

  @column()
  status: string

  @column()
  habitId: number

  @column()
  userId: number  // Novo campo para o ID do usuário

  @belongsTo(() => Habit, {
    foreignKey: 'habitId',
  })
  habit: BelongsTo<typeof Habit>

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt: DateTime | null

  @column.dateTime({ serializeAs: null })
  deletedAt: DateTime | null
}
