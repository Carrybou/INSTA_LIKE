<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input type="text" v-model="email" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
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


const login = async () => {
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
