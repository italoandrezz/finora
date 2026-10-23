import axios from 'axios'

// Apenas variáveis públicas: valores VITE_* são incluídos no bundle do navegador.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10_000,
  headers: { Accept: 'application/json' },
})
