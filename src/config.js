const config = {
  development: {
    apiUrl: 'http://127.0.0.1:8000',
  },
  production: {
    apiUrl: 'https://afriktexiabackend.onrender.com',
  }
}

// Détecter l'environnement automatiquement
const isDevelopment = process.env.NODE_ENV === 'development'
const currentConfig = isDevelopment ? config.development : config.production

export default currentConfig