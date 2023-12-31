import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

import axios from 'axios';

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export const useUserStore = defineStore('user', () => {
  const router = useRouter();

  // State
  const isLoading = ref(false);

  // Computed
  const isAuthenticated = computed(() => {
    return !!localStorage.getItem('token');
  });
  // todo fix
  const user = computed(() => {
    const userString = localStorage.getItem('user');
    if (userString) {
      return JSON.parse(userString);
    }
    return null;
  });

  // Setters
  const setIsLoading = (value) => {
    isLoading.value = value;
  };

  // Methods
  const login = async (credentials) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${BASE_API_URL}/users/login/`,
        credentials
      );
      const { token, user } = response.data;
      console.log(response.data);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      setIsLoading(false);

      router.push({ name: 'Dashboard' });
    } catch (error) {
      console.error('Login failed:', error);

      setIsLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    router.push({ name: 'Login' });
  };
  const signup = async (formData) => {
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        console.error('Passwords do not match');
        return;
      }

      const response = await axios.post(`${BASE_API_URL}/users/signup/`, {
        email: formData.email,
        password: formData.password,
      });

      if (response) {
        setIsLoading(false);
        window.alert('Signup successful! Click OK to go to the login page.');
        router.push({ name: 'Login' });
      }
    } catch (error) {
      console.error('Sign Up failed:', error);
      setIsLoading(false);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    signup,
  };
});
