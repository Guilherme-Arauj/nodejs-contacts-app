<template>
  <v-app>
    <v-app-bar color="primary" dark>
      <v-app-bar-title>Gerenciador de Contatos</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn @click="showAddDialog = true">
        <v-icon start>mdi-plus</v-icon>
        Novo Contato
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <!-- Lista de Contatos -->
        <v-row>
          <v-col v-for="contact in contacts" :key="contact.id" cols="12" md="6" lg="4">
            <v-card>
              <v-img :src="contact.picture" height="200" cover></v-img>
              <v-card-title>{{ contact.name }}</v-card-title>
              <v-card-text>
                <p><v-icon small>mdi-phone</v-icon> {{ contact.contact }}</p>
                <p><v-icon small>mdi-email</v-icon> {{ contact.email }}</p>
              </v-card-text>
              <v-card-actions>
                <v-btn variant="text" @click="viewContact(contact)">Ver</v-btn>
                <v-btn variant="text" @click="editContact(contact)">Editar</v-btn>
                <v-btn variant="text" color="error" @click="confirmDelete(contact)">Deletar</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Dialog Adicionar/Editar -->
    <v-dialog v-model="showAddDialog" max-width="600">
      <v-card>
        <v-card-title>{{ isEditing ? 'Editar' : 'Adicionar' }} Contato</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="form.name"
              label="Nome"
              :rules="nameRules"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="form.contact"
              label="Contato (9 dígitos)"
              :rules="contactRules"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="form.email"
              label="Email"
              :rules="emailRules"
              required
            ></v-text-field>
            
            <v-file-input
              v-model="form.picture"
              label="Foto"
              accept="image/*"
              :rules="pictureRules"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog">Cancelar</v-btn>
          <v-btn color="primary" @click="saveContact" :disabled="!formValid">
            {{ isEditing ? 'Atualizar' : 'Salvar' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Ver Detalhes -->
    <v-dialog v-model="showViewDialog" max-width="500">
      <v-card v-if="selectedContact">
        <v-img :src="selectedContact.picture" height="300" cover></v-img>
        <v-card-title>{{ selectedContact.name }}</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item>
              <v-list-item-title>Contato</v-list-item-title>
              <v-list-item-subtitle>{{ selectedContact.contact }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Email</v-list-item-title>
              <v-list-item-subtitle>{{ selectedContact.email }}</v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showViewDialog = false">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmar Exclusão -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title>Confirmar Exclusão</v-card-title>
        <v-card-text>
          Tem certeza que deseja excluir o contato "{{ contactToDelete?.name }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="showDeleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteContact">Excluir</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fechar</v-btn>
      </template>
    </v-snackbar>
  </v-app>
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