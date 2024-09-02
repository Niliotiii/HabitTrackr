import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Habit from './habit.js'

export default class Goal extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public frequencia: string

  @column()
  public quantity: number

  @column.dateTime()
  public start_date: DateTime

  @column.dateTime()
  public end_date: DateTime

  @column()
  public score: number

  @column()
  public status: string

  @belongsTo(() => Habit, {
    foreignKey: 'habitId',
  })
  public habit: BelongsTo<typeof Habit>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime | null

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null
}
