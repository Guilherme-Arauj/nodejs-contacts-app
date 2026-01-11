import { User } from "../../../domain/entities/User.js";

export class UserMapper {
    public static toDomain(prismaUser: any): User {
        return new User({
            id: prismaUser.id,
            name: prismaUser.name,
            email: prismaUser.email,
            password: prismaUser.password
        });
    }

    public static toPrisma(user: User) {
        return {
            name: user.name,
            email: user.email,
            password: user.password
        };
    }
}