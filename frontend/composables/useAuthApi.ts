export const useAuthApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase
  
  console.log('API Base URL:', baseURL) // Debug

  const cadastro = async (userData: { name: string; email: string; password: string }) => {
    console.log('Fazendo request para:', `${baseURL}/cadastro`) // Debug
    const response = await fetch(`${baseURL}/cadastro`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }

  const login = async (credentials: { email: string; password: string }) => {
    const response = await fetch(`${baseURL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  }

  return {
    cadastro,
    login
  }
}