<template>
  <div class="shell">
    <router-view />
  </div>
</template>

<script>

export default {
  name: "App",
};
</script>

<style>
html, body { height: 100%; }
body {
  margin: 0;
  background: radial-gradient(1200px 600px at 15% 10%, rgba(120,160,255,0.18), transparent 60%),
              radial-gradient(900px 500px at 80% 0%, rgba(255,255,255,0.08), transparent 50%),
              #0b0f16;
  color: #e9eefc;
}

.shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px;
}
</style>