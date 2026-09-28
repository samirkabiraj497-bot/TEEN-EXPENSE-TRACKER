const CategoryModel = require('../models/categoryModel');

const categoryController = {
  async getCategories(req, res, next) {
    try {
      const categories = await CategoryModel.getAll();
      return res.status(200).json({
        success: true,
        data: categories
      });
    } catch (error) {
      next(error);
    }
  },

  async createCategory(req, res, next) {
    try {
      const { name, icon } = req.body;

      if (!name || typeof name !== 'string' || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
      }

      const category = await CategoryModel.create({ name, icon });

      return res.status(201).json({
        success: true,
        message: 'Category added successfully!',
        data: category
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
