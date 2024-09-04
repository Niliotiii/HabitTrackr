import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activity_registers'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('goal_id').unsigned().references('id').inTable('goals').onDelete('CASCADE')
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('goal_id')
    })
  }
}