import Category from '#models/category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class CategorySeeder extends BaseSeeder {
  public async run() {
    // Especificando as categorias populares
    const categories = [
      {
        name: 'Exercise',
        description: 'Physical activities and workouts',
        visualIdentificationColor: '#FF5733',
        status: 'active',
      },
      {
        name: 'Reading',
        description: 'Reading books and articles',
        visualIdentificationColor: '#33FF57',
        status: 'active',
      },
      {
        name: 'Meditation',
        description: 'Mindfulness and meditation practices',
        visualIdentificationColor: '#3357FF',
        status: 'active',
      },
      {
        name: 'Diet',
        description: 'Healthy eating and nutrition',
        visualIdentificationColor: '#FF33A1',
        status: 'active',
      },
      {
        name: 'Learning',
        description: 'Acquiring new skills and knowledge',
        visualIdentificationColor: '#FFAA33',
        status: 'active',
      },
      {
        name: 'Sleep',
        description: 'Improving sleep quality',
        visualIdentificationColor: '#AA33FF',
        status: 'active',
      },
    ]

    // Inserindo as categorias no banco de dados
    await Category.createMany(categories)
  }
}
