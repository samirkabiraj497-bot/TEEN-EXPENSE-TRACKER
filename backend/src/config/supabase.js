const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

let supabase = null;
let isConfigured = false;

const isValidUrl = (url) => {
  try {
    return Boolean(new URL(url));
  } catch {
    return false;
  }
};

if (config.supabaseUrl && config.supabaseKey && isValidUrl(config.supabaseUrl) && !config.supabaseUrl.includes('your-project-id')) {
  try {
    supabase = createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    isConfigured = true;
    console.log('⚡ Supabase Client initialized with live cloud connection.');
  } catch (err) {
    console.warn('⚠️ Supabase initialization failed:', err.message);
    isConfigured = false;
  }
} else {
  console.log('ℹ️ Supabase credentials not set in .env. Using built-in persistent local database mode for instant development.');
}

module.exports = {
  supabase,
  isConfigured
};
