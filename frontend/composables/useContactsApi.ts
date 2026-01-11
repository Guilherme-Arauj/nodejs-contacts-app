export const useContactsApi = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase

  const createContact = async (contact: { name: string; email: string; phone: string }) => {
    return await $fetch('/contacts', {
      baseURL,
      method: 'POST',
      body: contact
    })
  }

  const getContacts = async () => {
    return await $fetch('/contacts', {
      baseURL,
      method: 'GET'
    })
  }

  const getContact = async (id: string) => {
    return await $fetch(`/contacts/${id}`, {
      baseURL,
      method: 'GET'
    })
  }

  const updateContact = async (id: string, contact: { name: string; email: string; phone: string }) => {
    return await $fetch(`/contacts/${id}`, {
      baseURL,
      method: 'PUT',
      body: contact
    })
  }

  const deleteContact = async (id: string) => {
    return await $fetch(`/contacts/${id}`, {
      baseURL,
      method: 'DELETE'
    })
  }

  return {
    createContact,
    getContacts,
    getContact,
    updateContact,
    deleteContact
  }
}