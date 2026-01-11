<template>
  <div>
    <div class="d-flex justify-end mb-4 pa-4">
      <button @click="$router.push('/auth')" style="background: #1976d2; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer;">
        Login
      </button>
    </div>
    
    <div style="padding: 16px;">
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px;">
        <div v-for="contact in contacts" :key="contact.id" style="border: 1px solid #ddd; border-radius: 8px; padding: 16px;">
          <img :src="contact.picture" style="width: 100%; height: 200px; object-fit: cover; border-radius: 4px;" />
          <h3>{{ contact.name }}</h3>
          <p>📞 {{ contact.contact }}</p>
          <p>✉️ {{ contact.email }}</p>
          <div style="display: flex; gap: 8px; margin-top: 16px;">
            <button @click="viewContact(contact)" style="padding: 4px 8px; border: 1px solid #ddd; background: white; cursor: pointer;">Ver</button>
            <button @click="editContact(contact)" style="padding: 4px 8px; border: 1px solid #ddd; background: white; cursor: pointer;">Editar</button>
            <button @click="confirmDelete(contact)" style="padding: 4px 8px; border: 1px solid #f44336; background: #f44336; color: white; cursor: pointer;">Deletar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals simplificados -->
    <div v-if="showViewDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: white; padding: 24px; border-radius: 8px; max-width: 400px; width: 90%;">
        <h3>{{ selectedContact?.name }}</h3>
        <p>Contato: {{ selectedContact?.contact }}</p>
        <p>Email: {{ selectedContact?.email }}</p>
        <button @click="showViewDialog = false" style="padding: 8px 16px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">Fechar</button>
      </div>
    </div>

    <div v-if="showDeleteDialog" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;">
      <div style="background: white; padding: 24px; border-radius: 8px; max-width: 400px; width: 90%;">
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir o contato "{{ contactToDelete?.name }}"?</p>
        <div style="display: flex; gap: 8px; margin-top: 16px;">
          <button @click="showDeleteDialog = false" style="padding: 8px 16px; background: #ddd; border: none; border-radius: 4px; cursor: pointer;">Cancelar</button>
          <button @click="deleteContact" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Excluir</button>
        </div>
      </div>
    </div>

    <div v-if="snackbar.show" style="position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: #4caf50; color: white; padding: 12px 24px; border-radius: 4px; z-index: 1001;">
      {{ snackbar.message }}
      <button @click="snackbar.show = false" style="background: none; border: none; color: white; margin-left: 16px; cursor: pointer;">✕</button>
    </div>
  </div>
</template>

<script setup>
const contacts = ref([
  {
    id: 1,
    name: "João Silva",
    contact: "123456789",
    email: "joao@email.com",
    picture: "https://via.placeholder.com/300x200"
  },
  {
    id: 2,
    name: "Maria Santos",
    contact: "987654321",
    email: "maria@email.com",
    picture: "https://via.placeholder.com/300x200"
  }
])

const showAddDialog = ref(false)
const showViewDialog = ref(false)
const showDeleteDialog = ref(false)
const isEditing = ref(false)
const formValid = ref(false)
const selectedContact = ref(null)
const contactToDelete = ref(null)

const form = ref({
  name: '',
  contact: '',
  email: '',
  picture: null
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const nameRules = [
  v => !!v || 'Nome é obrigatório',
  v => (v && v.length > 5) || 'Nome deve ter mais de 5 caracteres'
]

const contactRules = [
  v => !!v || 'Contato é obrigatório',
  v => /^\d{9}$/.test(v) || 'Contato deve ter exatamente 9 dígitos'
]

const emailRules = [
  v => !!v || 'Email é obrigatório',
  v => /.+@.+\..+/.test(v) || 'Email deve ser válido'
]

const pictureRules = [
  v => !isEditing.value ? !!v || 'Foto é obrigatória' : true
]

function viewContact(contact) {
  selectedContact.value = contact
  showViewDialog.value = true
}

function editContact(contact) {
  selectedContact.value = contact
  isEditing.value = true
  form.value = {
    name: contact.name,
    contact: contact.contact,
    email: contact.email,
    picture: null
  }
  showAddDialog.value = true
}

function confirmDelete(contact) {
  contactToDelete.value = contact
  showDeleteDialog.value = true
}

function deleteContact() {
  const index = contacts.value.findIndex(c => c.id === contactToDelete.value.id)
  if (index > -1) {
    contacts.value.splice(index, 1)
    showMessage('Contato excluído com sucesso')
  }
  showDeleteDialog.value = false
  contactToDelete.value = null
}

function saveContact() {
  if (isEditing.value) {
    const index = contacts.value.findIndex(c => c.id === selectedContact.value.id)
    if (index > -1) {
      contacts.value[index] = {
        ...contacts.value[index],
        ...form.value,
        picture: form.value.picture ? URL.createObjectURL(form.value.picture[0]) : contacts.value[index].picture
      }
      showMessage('Contato atualizado com sucesso')
    }
  } else {
    const newContact = {
      id: Date.now(),
      ...form.value,
      picture: form.value.picture ? URL.createObjectURL(form.value.picture[0]) : 'https://via.placeholder.com/300x200'
    }
    contacts.value.push(newContact)
    showMessage('Contato criado com sucesso')
  }
  closeDialog()
}

function closeDialog() {
  showAddDialog.value = false
  isEditing.value = false
  selectedContact.value = null
  form.value = {
    name: '',
    contact: '',
    email: '',
    picture: null
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