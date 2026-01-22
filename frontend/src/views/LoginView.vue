<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Anmelden</h2>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">E-Mail</label>
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            placeholder="name@example.com" 
            required 
          />
        </div>

        <div class="form-group">
          <label for="password">Passwort</label>
          <input 
            id="password" 
            v-model="password" 
            type="password" 
            placeholder="Dein Passwort" 
            required 
          />
        </div>

        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <button type="submit" :disabled="isLoading">
          {{ isLoading ? 'Lädt...' : 'Einloggen' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../services/api'; // Dein existierender Axios-Service

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      isLoading: false
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';

       try {
        const response = await api.post('/users/login', {
          email: this.email,
          password: this.password
        });

        // 1. Token UND User extrahieren
        const { token, user } = response.data;

        // 2. Beides speichern
        localStorage.setItem('token', token); // <--- WICHTIG für Issue 5
        localStorage.setItem('user', JSON.stringify(user));

        this.$router.push('/');
      } catch (error) {
        // Fehlerbehandlung und Anzeige für den Nutzer
        if (error.response && error.response.data && error.response.data.error) {
          this.errorMessage = error.response.data.error;
        } else {
          this.errorMessage = 'Ein unbekannter Fehler ist aufgetreten.';
        }
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Angepasst an dein Dark Theme */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh; /* Damit es vertikal zentriert ist */
}

.login-card {
  /* Dunkler Hintergrund mit leichtem Rand, passend zum App-Style */
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: #e9eefc; /* Deine Textfarbe */
  font-weight: 300;
  letter-spacing: 1px;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #a0aec0; /* Etwas grauerer Text für Labels */
  font-size: 0.9rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  color: #fff;
  font-size: 1rem;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

input:focus {
  outline: none;
  border-color: #42b983; /* Vue Green Accent */
}

button {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: transform 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.4);
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.error-message {
  color: #ff6b6b;
  background-color: rgba(255, 107, 107, 0.1);
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 107, 107, 0.2);
}
</style>