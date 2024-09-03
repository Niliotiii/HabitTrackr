import Category from '#models/category'
import type { HttpContext } from '@adonisjs/core/http'

export default class CategoriesController {
  // Método para criar uma nova categoria
  public async store({ request, response }: HttpContext) {
    const data = request.only(['name', 'description', 'visualIdentificationColor', 'status'])

    try {
      const category = await Category.create(data)
      return response.status(201).json(category)
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao criar a categoria' })
    }
  }

  // Método para buscar todas as categorias
  public async index({}: HttpContext) {
    const categories = await Category.all()
    return categories
  }

  // Método para buscar uma categoria por ID
  public async show({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      return category
    } catch (error) {
      return response.status(404).json({ error: 'Categoria não encontrada' })
    }
  }

  // Método para editar/atualizar uma categoria
  public async update({ params, request, response }: HttpContext) {
    const data = request.only(['name', 'description', 'visualIdentificationColor', 'status'])

    try {
      const category = await Category.findOrFail(params.id)
      category.merge(data)
      await category.save()
      return category
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao atualizar a categoria' })
    }
  }

  // Método para deletar uma categoria
  public async destroy({ params, response }: HttpContext) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()
      return response.status(204).json({})
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao deletar a categoria' })
    }
  }
}
