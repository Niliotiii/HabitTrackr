import Category from '#models/category'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class CategorySeeder extends BaseSeeder {
  async run() {
    // Especificando as categorias populares em português
    const categories = [
      {
        name: 'Exercício',
        description: 'Atividades físicas e treinos',
        visualIdentificationColor: '#FF5733',
        status: 'active',
      },
      {
        name: 'Leitura',
        description: 'Leitura de livros e artigos',
        visualIdentificationColor: '#33FF57',
        status: 'active',
      },
      {
        name: 'Meditação',
        description: 'Práticas de mindfulness e meditação',
        visualIdentificationColor: '#3357FF',
        status: 'active',
      },
      {
        name: 'Dieta',
        description: 'Alimentação saudável e nutrição',
        visualIdentificationColor: '#FF33A1',
        status: 'active',
      },
      {
        name: 'Aprendizado',
        description: 'Aquisição de novas habilidades e conhecimentos',
        visualIdentificationColor: '#FFAA33',
        status: 'active',
      },
      {
        name: 'Sono',
        description: 'Melhoria da qualidade do sono',
        visualIdentificationColor: '#AA33FF',
        status: 'active',
      },
    ]

    // Inserindo as categorias no banco de dados
    await Category.createMany(categories)
  }
}
