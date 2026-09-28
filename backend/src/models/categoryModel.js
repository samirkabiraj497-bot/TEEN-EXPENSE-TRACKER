const crypto = require('crypto');
const { supabase, isConfigured } = require('../config/supabase');
const localDb = require('../config/localDb');

const CategoryModel = {
  async getAll() {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw new Error(error.message);
      return data || [];
    }

    const db = localDb.get();
    return db.categories || localDb.initialCategories;
  },

  async create({ name, icon = 'Tag' }) {
    const cleanName = name.trim();

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: cleanName, icon }])
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    const existing = db.categories.find(c => c.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      return existing;
    }

    const newCat = {
      id: crypto.randomUUID(),
      name: cleanName,
      icon,
      created_at: new Date().toISOString()
    };

    db.categories.push(newCat);
    localDb.save(db);
    return newCat;
  }
};

module.exports = CategoryModel;
