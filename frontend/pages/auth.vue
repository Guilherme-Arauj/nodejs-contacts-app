<template>
  <div>
    <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f5f5;">
      <div style="background: white; padding: 32px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 400px;">
        <h2 style="text-align: center; margin-bottom: 24px; color: #1976d2;">{{ isLogin ? 'Login' : 'Cadastro' }}</h2>
        
        <form @submit.prevent="submit">
          <div v-if="!isLogin" style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Nome</label>
            <input 
              v-model="form.name" 
              type="text" 
              required
              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
            />
          </div>
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Email</label>
            <input 
              v-model="form.email" 
              type="email" 
              required
              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
            />
          </div>
          
          <div style="margin-bottom: 24px;">
            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Senha</label>
            <input 
              v-model="form.password" 
              type="password" 
              required
              style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px;"
            />
          </div>
          
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button 
              type="button" 
              @click="toggleMode" 
              style="background: none; border: none; color: #1976d2; cursor: pointer; text-decoration: underline;"
            >
              {{ isLogin ? 'Criar conta' : 'Já tenho conta' }}
            </button>
            
            <button 
              type="submit" 
              :disabled="loading"
              style="background: #1976d2; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;"
            >
              {{ loading ? 'Carregando...' : (isLogin ? 'Entrar' : 'Cadastrar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <div v-if="snackbar.show" :style="`position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: ${snackbar.color === 'error' ? '#f44336' : '#4caf50'}; color: white; padding: 12px 24px; border-radius: 4px; z-index: 1001;`">
      {{ snackbar.message }}
      <button @click="snackbar.show = false" style="background: none; border: none; color: white; margin-left: 16px; cursor: pointer;">✕</button>
    </div>
  </div>
</template>

<script setup>
const { cadastro, login } = useAuthApi()
const isLogin = ref(true)
const loading = ref(false)

const form = ref({
  name: '',
  email: '',
  password: ''
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

function toggleMode() {
  isLogin.value = !isLogin.value
}

async function submit() {
  loading.value = true
  
  try {
    if (isLogin.value) {
      await login({
        email: form.value.email,
        password: form.value.password
      })
      showMessage('Login realizado com sucesso!')
      setTimeout(() => {
        navigateTo('/')
      }, 1500)
    } else {
      await cadastro(form.value)
      showMessage('Cadastro realizado com sucesso!')
      setTimeout(() => {
        navigateTo('/')
      }, 1500)
    }
    
  } catch (error) {
    console.error('Erro na autenticação:', error)
    showMessage(
      error.data?.message || 'Erro ao processar solicitação',
      'error'
    )
  } finally {
    loading.value = false
  }
}

function showMessage(message, color = 'success') {
  snackbar.value = {
    show: true,
    message,
    color
  }
}
</script>