const crypto = require('crypto');
const { supabase, isConfigured } = require('../config/supabase');
const localDb = require('../config/localDb');

const ExpenseModel = {
  async create(expenseData) {
    const { user_id, title, amount, category, description, expense_date, payment_method } = expenseData;
    const cleanAmount = parseFloat(amount);
    const date = expense_date || new Date().toISOString().split('T')[0];
    const method = payment_method || 'UPI';

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          user_id,
          title: title.trim(),
          amount: cleanAmount,
          category: category.trim(),
          description: description ? description.trim() : '',
          expense_date: date,
          payment_method: method
        }])
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    const newExpense = {
      id: crypto.randomUUID(),
      user_id,
      title: title.trim(),
      amount: cleanAmount,
      category: category.trim(),
      description: description ? description.trim() : '',
      expense_date: date,
      payment_method: method,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.expenses.push(newExpense);
    localDb.save(db);
    return newExpense;
  },

  async findUserExpenses(userId, filters = {}) {
    const { category, from, to, search, sort = 'newest', limit, offset = 0 } = filters;

    if (isConfigured && supabase) {
      let query = supabase
        .from('expenses')
        .select('*', { count: 'exact' })
        .eq('user_id', userId);

      if (category && category !== 'All') {
        query = query.eq('category', category);
      }
      if (from) {
        query = query.gte('expense_date', from);
      }
      if (to) {
        query = query.lte('expense_date', to);
      }
      if (search) {
        query = query.ilike('title', `%${search.trim()}%`);
      }

      switch (sort) {
        case 'oldest':
          query = query.order('expense_date', { ascending: true }).order('created_at', { ascending: true });
          break;
        case 'highest':
          query = query.order('amount', { ascending: false });
          break;
        case 'lowest':
          query = query.order('amount', { ascending: true });
          break;
        case 'newest':
        default:
          query = query.order('expense_date', { ascending: false }).order('created_at', { ascending: false });
          break;
      }

      if (limit) {
        query = query.range(offset, offset + limit - 1);
      }

      const { data, error, count } = await query;
      if (error) throw new Error(error.message);
      return { expenses: data || [], totalCount: count || 0 };
    }

    // Local DB Filtering
    const db = localDb.get();
    let list = db.expenses.filter(e => e.user_id === userId);

    if (category && category !== 'All') {
      list = list.filter(e => e.category.toLowerCase() === category.toLowerCase());
    }
    if (from) {
      list = list.filter(e => e.expense_date >= from);
    }
    if (to) {
      list = list.filter(e => e.expense_date <= to);
    }
    if (search) {
      const q = search.trim().toLowerCase();
      list = list.filter(e => 
        e.title.toLowerCase().includes(q) || 
        (e.description && e.description.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case 'oldest':
        list.sort((a, b) => new Date(a.expense_date) - new Date(b.expense_date) || new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'highest':
        list.sort((a, b) => b.amount - a.amount);
        break;
      case 'lowest':
        list.sort((a, b) => a.amount - b.amount);
        break;
      case 'newest':
      default:
        list.sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date) || new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    const totalCount = list.length;
    if (limit) {
      list = list.slice(offset, offset + limit);
    }

    return { expenses: list, totalCount };
  },

  async findById(id, userId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    return db.expenses.find(e => e.id === id && e.user_id === userId) || null;
  },

  async update(id, userId, updateData) {
    const { title, amount, category, description, expense_date, payment_method } = updateData;
    const updates = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) updates.title = title.trim();
    if (amount !== undefined) updates.amount = parseFloat(amount);
    if (category !== undefined) updates.category = category.trim();
    if (description !== undefined) updates.description = description ? description.trim() : '';
    if (expense_date !== undefined) updates.expense_date = expense_date;
    if (payment_method !== undefined) updates.payment_method = payment_method;

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .update(updates)
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    const index = db.expenses.findIndex(e => e.id === id && e.user_id === userId);
    if (index === -1) return null;

    db.expenses[index] = {
      ...db.expenses[index],
      ...updates
    };

    localDb.save(db);
    return db.expenses[index];
  },

  async delete(id, userId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId)
        .select('*')
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    const index = db.expenses.findIndex(e => e.id === id && e.user_id === userId);
    if (index === -1) return null;

    const [deleted] = db.expenses.splice(index, 1);
    localDb.save(db);
    return deleted;
  },

  async getAllUserExpenses(userId) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', userId)
        .order('expense_date', { ascending: false });

      if (error) throw new Error(error.message);
      return data || [];
    }

    const db = localDb.get();
    return db.expenses
      .filter(e => e.user_id === userId)
      .sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date));
  }
};

module.exports = ExpenseModel;
