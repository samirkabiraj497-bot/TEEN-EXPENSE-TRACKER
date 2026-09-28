const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('crypto');

const dataDir = path.resolve(__dirname, '../../data');
const dbFile = path.resolve(dataDir, 'local_db.json');

const initialCategories = [
  { id: 'cat-1', name: 'Food', icon: 'Utensils', created_at: new Date().toISOString() },
  { id: 'cat-2', name: 'Transport', icon: 'Bus', created_at: new Date().toISOString() },
  { id: 'cat-3', name: 'Education', icon: 'GraduationCap', created_at: new Date().toISOString() },
  { id: 'cat-4', name: 'Entertainment', icon: 'Film', created_at: new Date().toISOString() },
  { id: 'cat-5', name: 'Shopping', icon: 'ShoppingBag', created_at: new Date().toISOString() },
  { id: 'cat-6', name: 'Gaming', icon: 'Gamepad2', created_at: new Date().toISOString() },
  { id: 'cat-7', name: 'Subscriptions', icon: 'Tv', created_at: new Date().toISOString() },
  { id: 'cat-8', name: 'Mobile/Data', icon: 'Smartphone', created_at: new Date().toISOString() },
  { id: 'cat-9', name: 'Sports', icon: 'Dumbbell', created_at: new Date().toISOString() },
  { id: 'cat-10', name: 'Travel', icon: 'Plane', created_at: new Date().toISOString() },
  { id: 'cat-11', name: 'Personal Care', icon: 'Sparkles', created_at: new Date().toISOString() },
  { id: 'cat-12', name: 'Gifts', icon: 'Gift', created_at: new Date().toISOString() },
  { id: 'cat-13', name: 'Other', icon: 'MoreHorizontal', created_at: new Date().toISOString() }
];

function ensureDbExists() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbFile)) {
    const initialData = {
      users: [],
      expenses: [],
      budgets: [],
      categories: initialCategories
    };
    fs.writeFileSync(dbFile, JSON.stringify(initialData, null, 2), 'utf-8');
  }
}

function readDb() {
  ensureDbExists();
  try {
    const raw = fs.readFileSync(dbFile, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading local db file:', err.message);
    return { users: [], expenses: [], budgets: [], categories: initialCategories };
  }
}

function writeDb(data) {
  ensureDbExists();
  fs.writeFileSync(dbFile, JSON.stringify(data, null, 2), 'utf-8');
}

const localDb = {
  get: readDb,
  save: writeDb,
  initialCategories
};

module.exports = localDb;
