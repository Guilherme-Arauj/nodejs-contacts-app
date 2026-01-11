

import { User } from "../entities/User.js";

export interface UserRepository {
    create(user:User): Promise <User>;
    validate(email:string): Promise <User | null>;
    getUser(id: string): Promise <User | null>;
}