<template>
  <div class="main-content">
    <h1>Welcome to Your App!</h1>
    <p>You have successfully logged in.</p>
  </div>
</template>

<script>
export default {
  name: 'MainContent'
}
</script>
<style scoped>
.main-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logout-btn {
  padding: 12px 30px;
  background: linear-gradient(315deg, #e91e63, #5d02ff);
  color: white;
  border: none;
  border-radius: 30px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 20px;
}

.logout-btn:hover {
  background: linear-gradient(315deg, #5d02ff, #e91e63);
}
</style>