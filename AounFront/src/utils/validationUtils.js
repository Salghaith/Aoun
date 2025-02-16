export const validateInputs = ({username, email, password}) => {
  if (username !== undefined && !username.trim()) {
    return 'Username is required.';
  }

  if (email !== undefined) {
    if (!email) {
      return 'Email is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'auth/invalid-email';
    }
  }

  if (password !== undefined && password.length < 6) {
    return 'Password must be at least 6 characters.';
  }

  return null; //this means VALID INPUT
};

export const isValidKSU = str => {
  if (/^[4]\d{8}$/.test(str)) {
    return `${str}@student.ksu.edu.sa`;
  }
  return null;
};
