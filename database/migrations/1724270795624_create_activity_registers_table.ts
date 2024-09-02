import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activity_registers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('name', 100).notNullable()
      table.string('description', 500).notNullable()
      table.dateTime('start_date').notNullable()
      table.dateTime('end_date').notNullable()
      table.integer('duration_hours').notNullable()
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
