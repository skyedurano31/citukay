// // src/services/AuthService.js
// import { api } from './api';

// export const AuthService = {
//   login: async (email, password) => {
//     try {
//       const response = await api.login(email, password);
//       const data = await response.json();
//       return data;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('user');
//   },

//   isAuthenticated: () => {
//     return !!localStorage.getItem('authToken');
//   },

//   getCurrentUser: () => {
//     const user = localStorage.getItem('user');
//     return user ? JSON.parse(user) : null;
//   }
// };

// export default AuthService;