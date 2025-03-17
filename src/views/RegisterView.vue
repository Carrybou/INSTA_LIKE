<template>
  <div>
    <h1>Register</h1>
    <form @submit.prevent="register">
      <input v-model="email" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Register</button>
    </form>
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const errorMessage = ref('');

const register = async () => {
  try {
    await api.register({ email: email.value, password: password.value });

  } catch (error) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage.value = error.response.data.detail;
    } else {
      errorMessage.value = 'An error occurred. Please try again.';
    }
  }
  try {
    const response = await api.login({ email: email.value, password: password.value });
    localStorage.setItem('token', response.data.token);
    await router.push({ name: 'Home' });
  } catch (error) {
    console.log(error);
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage.value = error.response.data.detail;
    } else {
      errorMessage.value = 'An error occurred. Please try again.';
    }
  }
};
</script>
