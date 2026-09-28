const crypto = require('crypto');
const { supabase, isConfigured } = require('../config/supabase');
const localDb = require('../config/localDb');

const UserModel = {
  async create({ name, email, password_hash }) {
    const cleanEmail = email.toLowerCase().trim();

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .insert([{ name, email: cleanEmail, password_hash }])
        .select('id, name, email, created_at, updated_at')
        .single();

      if (error) throw new Error(error.message);
      return data;
    }

    // Local DB Fallback
    const db = localDb.get();
    const existing = db.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('User already exists with this email address');
    }

    const newUser = {
      id: crypto.randomUUID(),
      name,
      email: cleanEmail,
      password_hash,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    db.users.push(newUser);
    localDb.save(db);

    const { password_hash: _, ...safeUser } = newUser;
    return safeUser;
  },

  async findByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    return db.users.find(u => u.email.toLowerCase() === cleanEmail) || null;
  },

  async findById(id) {
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, created_at, updated_at')
        .eq('id', id)
        .maybeSingle();

      if (error) throw new Error(error.message);
      return data;
    }

    const db = localDb.get();
    const user = db.users.find(u => u.id === id);
    if (!user) return null;

    const { password_hash: _, ...safeUser } = user;
    return safeUser;
  }
};

module.exports = UserModel;
