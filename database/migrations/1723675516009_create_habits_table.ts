import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'habits'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.string('name', 100).notNullable()
      table.string('description', 500).notNullable()
      table.integer('priority').notNullable()
      table.string('status', 20).notNullable()

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('category_id').unsigned().references('id').inTable('categories')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
      table.timestamp('deleted_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
