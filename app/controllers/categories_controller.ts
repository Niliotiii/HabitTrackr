import Category from '#models/category'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoriesController {
  // Método para criar uma nova categoria
  async store({ request, response, session }: HttpContextContract) {
    const data = request.only(['name', 'description', 'visualIdentificationColor', 'status'])

    try {
      const category = await Category.create(data)
      session.flash('notificacao', {
        type: 'success',
        message: `Categoria ${category.name} criada com sucesso!`,
      })
      return response.redirect().toRoute('categories.index')
    } catch (error) {
      session.flash('notificacao', {
        type: 'danger', // Corrigido para 'danger' em vez de 'success'
        message: 'Erro ao criar categoria!',
      })
      return response.redirect().toRoute('categories.index')
    }
  }

  // Método para buscar todas as categorias
  async index({ view }: HttpContextContract) {
    const categories = await Category.all()

    return view.render('pages/categorias/index', { categories })
  }

  // Método para buscar uma categoria por ID
  async show({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      return category
    } catch (error) {
      return response.status(404).json({ error: 'Categoria não encontrada' })
    }
  }

  // Método para editar/atualizar uma categoria
  async update({ params, request, response }: HttpContextContract) {
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
  async destroy({ params, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()
      return response.redirect().toRoute('categories.index')
    } catch (error) {
      return response.status(400).json({ error: 'Erro ao deletar a categoria' })
    }
  }
}
