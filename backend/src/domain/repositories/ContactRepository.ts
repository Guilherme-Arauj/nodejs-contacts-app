import { Contact } from "../entities/Contact.js";

export interface ContactRepository {
    create(contact: Contact): Promise<Contact>;  //private
    update(contact: Contact): Promise<Contact>;  //private
    delete(contactId: string): Promise<Contact>; //private
    getContact(contactId: string): Promise<Contact | null>; //public
    getAllContacts(): Promise<Contact[]>;  //public
}