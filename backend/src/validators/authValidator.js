const validateRegisterInput = (data) => {
  const errors = {};
  const { name, email, password, confirmPassword } = data;

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Name is required and must be at least 2 characters long';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.email = 'A valid email address is required';
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

const validateLoginInput = (data) => {
  const errors = {};
  const { email, password } = data;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    errors.email = 'A valid email address is required';
  }

  if (!password || typeof password !== 'string' || password.trim().length === 0) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput
};
