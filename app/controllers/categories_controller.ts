import Category from '#models/category'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoriesController {
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
  // Método para editar uma categoria (renderiza a página de edição)
  async edit({ params, view, session, response }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      return view.render('pages/categorias/create', { category })
    } catch (error) {
      session.flash('notificacao', {
        type: 'danger',
        message: 'Categoria não encontrada!',
      })
      return response.redirect().toRoute('categories.index')
    }
  }

  async index({ view }: HttpContextContract) {
    const categories = await Category.all()

    return view.render('pages/categorias/index', { categories })
  }

  // Método para atualizar uma categoria
  async update({ params, request, response, session }: HttpContextContract) {
    const data = request.only(['name', 'description', 'visualIdentificationColor', 'status'])

    try {
      const category = await Category.findOrFail(params.id)
      category.merge(data)
      await category.save()

      session.flash('notificacao', {
        type: 'success',
        message: `Categoria ${category.name} atualizada com sucesso!`,
      })
      return response.redirect().toRoute('categories.index')
    } catch (error) {
      session.flash('notificacao', {
        type: 'danger',
        message: 'Erro ao atualizar a categoria!',
      })
      return response.redirect().toRoute('categories.index')
    }
  }

  // Método para deletar uma categoria
  async destroy({ params, response, session }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(params.id)
      await category.delete()

      session.flash('notificacao', {
        type: 'success',
        message: `Categoria ${category.name} deletada com sucesso!`,
      })
      return response.redirect().toRoute('categories.index')
    } catch (error) {
      session.flash('notificacao', {
        type: 'danger',
        message: 'Erro ao deletar a categoria!',
      })
      return response.redirect().toRoute('categories.index')
    }
  }
}
