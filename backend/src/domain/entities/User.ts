import { ValidationError } from "../errors/ValidatrionError.js";

export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
}

export class User implements IUser {
    private readonly _id: number;
    private _name: string;
    private _email: string;
    private _password: string;

    constructor(data: IUser) {
        this.validateName(data.name);
        this.validateEmail(data.email);
        this.validatePassword(data.password);

        this._id = data.id;
        this._name = data.name.trim();
        this._email = data.email.trim().toLowerCase();
        this._password = data.password;
    }

    get id() { return this._id; }
    get name() { return this._name; }
    get email() { return this._email; }
    get password() { return this._password; }

    set name(newName: string) {
        this.validateName(newName);
        this._name = newName.trim();
    }

    set email(newEmail: string) {
        this.validateEmail(newEmail);
        this._email = newEmail.trim().toLowerCase();
    }

    set password(newPassword: string) {
        this.validatePassword(newPassword);
        this._password = newPassword;
    }

    private validateName(name: string): void {
        if (!name?.trim()) {
            throw new ValidationError("user.NAME_REQUIRED");
        }
        if (name.trim().length <= 2) {
            throw new ValidationError("user.NAME_TOO_SHORT", { minLength: 3 });
        }
        if (name.trim().length > 255) {
            throw new ValidationError("user.NAME_TOO_LONG", { maxLength: 255 });
        }
    }

    private validateEmail(email: string): void {
        if (!email?.trim()) {
            throw new ValidationError("user.EMAIL_REQUIRED");
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
            throw new ValidationError("user.EMAIL_INVALID_FORMAT");
        }

        if (email.trim().length > 255) {
            throw new ValidationError("user.EMAIL_TOO_LONG", { maxLength: 255 });
        }
    }

    private validatePassword(password: string): void {
        if (!password) {
            throw new ValidationError("user.PASSWORD_REQUIRED");
        }
    }
}