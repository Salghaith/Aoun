export const loginErrorHandler = error => {
  let errorMessage = 'An unknown error occurred. Please try again.';
  switch (error) {
    case 'auth/user-not-found':
      errorMessage = 'No account found with this email. Please sign up first.';
      break;
    case 'auth/wrong-password':
      errorMessage = 'Incorrect password. Please try again.';
      break;
    case 'auth/invalid-credential':
      errorMessage = 'Incorrect email/password.';
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email format.';
      break;
    case 'auth/user-disabled':
      errorMessage = 'This account has been disabled.';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Too many attempts. Try again later.';
      break;
    case 'auth/network-request-failed':
      errorMessage = 'Network error. Check your connection.';
      break;
    case 'auth/internal-error':
      errorMessage = 'An unexpected error occurred.';
      break;
    case 'Username is required.':
      errorMessage = 'Username is required.';
      break;
    case 'Email is required.':
      errorMessage = 'Email is required.';
      break;
    case 'Password must be at least 6 characters.':
      errorMessage = 'Password must be at least 6 characters.';
      break;
  }
  return errorMessage;
};
export const SignupErrorHandler = error => {
  let errorMessage = 'An unknown error occurred.';
  switch (error) {
    case 'auth/email-already-in-use':
      errorMessage = 'This email is already in use.';
      break;
    case 'auth/invalid-email':
      errorMessage = 'Invalid email format. Please try again.';
      break;
    case 'auth/weak-password':
      errorMessage = 'Weak password. Use at least 6 characters.';
      break;
    case 'auth/network-request-failed':
      errorMessage = 'Network error. Check your connection.';
      break;
    case 'auth/too-many-requests':
      errorMessage = 'Too many attempts. Please try again later.';
      break;
    case 'auth/operation-not-allowed':
      errorMessage = 'Sign-up is currently disabled.';
      break;
    case 'auth/internal-error':
      errorMessage = 'An unexpected error occurred.';
      break;
    case 'Username is required.':
      errorMessage = 'Username is required.';
      break;
    case 'Email is required.':
      errorMessage = 'Email is required.';
      break;
    case 'Password must be at least 6 characters.':
      errorMessage = 'Password must be at least 6 characters.';
      break;
  }
  return errorMessage;
};
