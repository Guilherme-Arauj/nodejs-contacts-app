import { ValidationError } from "../errors/ValidatrionError.js";

export interface IContact {
    id: number;
    name: string;
    contact: string;
    email: string;
    picture: string;
}

export class Contact implements IContact {
    private readonly _id: number;
    private _name: string;
    private _contact: string;
    private _email: string;
    private _picture: string;

    constructor(data: IContact) {
        this.validateName(data.name);
        this.validateContact(data.contact);
        this.validateEmail(data.email);
        this.validatePicture(data.picture);

        this._id = data.id;
        this._name = data.name.trim();
        this._contact = data.contact.trim();
        this._email = data.email.trim().toLowerCase();
        this._picture = data.picture.trim();
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get contact() { return this._contact; }
    get email() { return this._email; }
    get picture() { return this._picture; }

    set name(newName: string) {
        this.validateName(newName);
        this._name = newName.trim();
    }

    set contact(newContact: string) {
        this.validateContact(newContact);
        this._contact = newContact.trim();
    }

    set email(newEmail: string) {
        this.validateEmail(newEmail);
        this._email = newEmail.trim().toLowerCase();
    }

    set picture(newPicture: string) {
        this.validatePicture(newPicture);
        this._picture = newPicture.trim();
    }

    private validateName(name: string): void {
        if (!name?.trim()) {
            throw new ValidationError("contact.NAME_REQUIRED");
        }
        if (name.trim().length <= 5) {
            throw new ValidationError("contact.NAME_TOO_SHORT", { minLength: 5 });
        }
        if (name.trim().length > 255) {
            throw new ValidationError("contact.NAME_TOO_LONG", { maxLength: 255 });
        }
    }

    private validateContact(contact: string): void {
        if (!contact?.trim()) {
            throw new ValidationError("contact.CONTACT_REQUIRED");
        }
        
        const cleanContact = contact.replace(/\D/g, '');
        if (cleanContact.length !== 9) {
            throw new ValidationError("contact.CONTACT_INVALID_LENGTH", { expectedLength: 9 });
        }
        
        const contactRegex = /^\d{9}$/;
        if (!contactRegex.test(cleanContact)) {
            throw new ValidationError("contact.CONTACT_INVALID_FORMAT");
        }
    }

    private validateEmail(email: string): void {
        if (!email?.trim()) {
            throw new ValidationError("contact.EMAIL_REQUIRED");
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            throw new ValidationError("contact.EMAIL_INVALID_FORMAT");
        }
        
        if (email.trim().length > 255) {
            throw new ValidationError("contact.EMAIL_TOO_LONG", { maxLength: 255 });
        }
    }

    private validatePicture(picture: string): void {
        if (!picture?.trim()) {
            throw new ValidationError("contact.PICTURE_REQUIRED");
        }
        
        if (picture.trim().length > 500) {
            throw new ValidationError("contact.PICTURE_URL_TOO_LONG", { maxLength: 500 });
        }
    }
}