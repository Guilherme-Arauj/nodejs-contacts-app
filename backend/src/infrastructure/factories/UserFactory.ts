import { UserController } from "../http/controllers/UserController.js";
import { UserService } from "../../application/services/UserService.js";
import { UserRepositoryImpl } from "../database/repositoriesImpl/UserRepositoryImpl.js";
import { prismaConfig } from "../database/PrismaConfig.js";
import { JwtConfig } from "../utils/jwt/JwtConfig.js";
import { BcryptConfig } from "../utils/bcrypt/BcryptConfig.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { IJwtConfig } from "../utils/jwt/IJwtConfig.js";
import { IBcryptConfig } from "../utils/bcrypt/IBcryptConfig.js";

export function UserFactory(): UserController {
    const jwtSecret = process.env.JWT_SECRET as string;
    
    if (!jwtSecret) {
        throw new Error("JWT_SECRET not found in environment variables");
    }
    
    const userRepository: UserRepository = new UserRepositoryImpl(prismaConfig);
    const jwtConfig: IJwtConfig = new JwtConfig(jwtSecret);
    const bcryptConfig: IBcryptConfig = new BcryptConfig();
    
    const userService = new UserService(
        userRepository,
        jwtConfig,
        bcryptConfig
    );

    return new UserController(userService); 
}