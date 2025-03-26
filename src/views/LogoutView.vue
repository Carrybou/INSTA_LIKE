<template>
    <div>
      <p>Logging out...</p>
    </div>
  </template>

  <script setup>
  import { useRouter } from 'vue-router';
  import { onMounted } from 'vue';

  const router = useRouter();

  onMounted(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    localStorage.removeItem('session');
    router.push({ name: 'Home' });
    console.log('Logged out');
  });
  </script>
