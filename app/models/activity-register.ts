import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { default as Habit, default as Veiculo } from './habit.js'

export default class ActivityRegister extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column.dateTime()
  public start_date: DateTime

  @column.dateTime()
  public end_date: DateTime

  @column()
  public duration_hours: number

  @column()
  public status: string

  @belongsTo(() => Habit, {
    foreignKey: 'habitId',
  })
  public habit: BelongsTo<typeof Veiculo>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime | null

  @column.dateTime({ serializeAs: null })
  public deletedAt: DateTime | null
}
