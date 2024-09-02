import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'goals'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('frequencia', 20).notNullable()
      table.integer('quantity').notNullable()
      table.date('start_date').notNullable()
      table.date('end_date').notNullable()
      table.integer('score').notNullable()
      table.string('status', 20).notNullable()

      table.integer('habit_id').unsigned().references('id').inTable('habits').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
