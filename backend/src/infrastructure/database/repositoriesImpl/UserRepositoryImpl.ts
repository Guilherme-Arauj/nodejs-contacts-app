import { User } from "../../../domain/entities/User.js";
import { UserRepository } from "../../../domain/repositories/UserRepository.js";
import { IPrismaConfig } from "../IPrismaConfig.js";
import { UserMapper } from "../mappers/UserMapper.js";

export class UserRepositoryImpl implements UserRepository {
    constructor(private prismaConfig: IPrismaConfig){}
   
    private get prisma(){
        return this.prismaConfig.prisma
    }

    public async create(user: User): Promise<User> {
        const prismaUser = await this.prisma.users.create({
            data: UserMapper.toPrisma(user)
        });
        return UserMapper.toDomain(prismaUser);
    }

    public async validate(email: string): Promise<User | null> {
        const prismaUser = await this.prisma.users.findUnique({
            where: { email }
        });
        return prismaUser ? UserMapper.toDomain(prismaUser) : null;
    }

    public async getUser(id: string): Promise<User | null> {
        const prismaUser = await this.prisma.users.findUnique({
            where: { id: parseInt(id) }
        });
        return prismaUser ? UserMapper.toDomain(prismaUser) : null;
    }
}