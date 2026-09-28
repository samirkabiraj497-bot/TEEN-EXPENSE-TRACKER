const crypto = require('crypto');
const { supabase, isConfigured } = require('../config/supabase');
const localDb = require('../config/localDb');

const BudgetModel = {
  async create(budgetData) {
    const { user_id, category, amount, month, year } = budgetData;
    const cleanAmount = parseFloat(amount);
    const cleanMonth = parseInt(month, 10);
    const cleanYear = parseInt(year, 10);

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .insert([{
          user_id,
          category: category.trim(),
          amount: cleanAmount,
          month: cleanMonth,
          year: cleanYear
        }])
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    const existing = db.budgets.find(b => 
      b.user_id === user_id &&
      b.category.toLowerCase() === category.toLowerCase().trim() &&
      b.month === cleanMonth &&
      b.year === cleanYear
    );

    if (existing) {
      throw new Error(`Budget already exists for ${category} in ${cleanMonth}/${cleanYear}. Please edit the existing budget.`);
    }

    const newBudget = {
      id: crypto.randomUUID(),
      user_id,
      category: category.trim(),
      amount: cleanAmount,
      month: cleanMonth,
      year: cleanYear,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.budgets.push(newBudget);
    localDb.save(db);
    return newBudget;
  },

  async findUserBudgets(userId, filters = {}) {
    const { month, year } = filters;

    if (isConfigured && supabase) {
      let query = supabase
        .from('budgets')
        .select('*')
        .eq('user_id', userId);

      if (month) query = query.eq('month', parseInt(month, 10));
      if (year) query = query.eq('year', parseInt(year, 10));

      const { data, error } = await query.order('category', { ascending: true });
      if (error) throw new Error(error.message);
      return data || [];
    }

    const db = localDb.get();
    return db.budgets.filter(b => {
      if (b.user_id !== userId) return false;
      if (month && b.month !== parseInt(month, 10)) return false;
      if (year && b.year !== parseInt(year, 10)) return false;
      return true;
    }).sort((a, b) => a.category.localeCompare(b.category));
  },

  async findById(id, userId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    return db.budgets.find(b => b.id === id && b.user_id === userId) || null;
  },

  async update(id, userId, updates) {
    const { amount, category, month, year } = updates;
    const updatePayload = {
      updated_at: new Date().toISOString()
    };

    if (amount !== undefined) updatePayload.amount = parseFloat(amount);
    if (category !== undefined) updatePayload.category = category.trim();
    if (month !== undefined) updatePayload.month = parseInt(month, 10);
    if (year !== undefined) updatePayload.year = parseInt(year, 10);

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .update(updatePayload)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    const index = db.budgets.findIndex(b => b.id === id && b.user_id === userId);
    if (index === -1) return null;

    db.budgets[index] = {
      ...db.budgets[index],
      ...updatePayload
    };

    localDb.save(db);
    return db.budgets[index];
  },

  async delete(id, userId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    const index = db.budgets.findIndex(b => b.id === id && b.user_id === userId);
    if (index === -1) return null;

    const [deleted] = db.budgets.splice(index, 1);
    localDb.save(db);
    return deleted;
  }
};

module.exports = BudgetModel;
