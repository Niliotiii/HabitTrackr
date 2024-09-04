import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Habit from './habit.js'

export default class Goal extends BaseModel {
  @column({ isPrimary: true })
  id: number

  @column()
  frequencia: string

  @column()
  quantity: number

  @column.dateTime()
  start_date: DateTime

  @column.dateTime()
  end_date: DateTime

  @column()
  score: number

  @column()
  status: string

  @column()
  habitId: number

  @belongsTo(() => Habit, {
    foreignKey: 'habitId',
  })
  habit: BelongsTo<typeof Habit>

  @column.dateTime({ autoCreate: true })
  createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt: DateTime | null

  @column.dateTime({ serializeAs: null })
  deletedAt: DateTime | null
}
