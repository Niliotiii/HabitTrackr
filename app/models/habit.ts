import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Categories from './category.js'
import User from './user.js'

export default class Habit extends BaseModel {
  @column({ isPrimary: true })
  id: number

  @column()
  name: string

  @column()
  description: string

  @column()
  priority: number

  @column()
  status: string

  @column()
  userId: number

  @belongsTo(() => User, {
    foreignKey: 'userId',
  })
  user: BelongsTo<typeof User>

  @column()
  categoryId: number

  @belongsTo(() => Categories, {
    foreignKey: 'categoryId',
  })
  category: BelongsTo<typeof Categories>

  @column.dateTime({ autoCreate: true })
  createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  updatedAt: DateTime | null

  @column.dateTime({ serializeAs: null })
  deletedAt: DateTime | null
}
