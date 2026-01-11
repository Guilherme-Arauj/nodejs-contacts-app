import { User } from "../../domain/entities/User.js";
import { UserRepository } from "../../domain/repositories/UserRepository.js";
import { IJwtConfig } from "../../infrastructure/utils/jwt/IJwtConfig.js";
import { ValidationError } from "../../domain/errors/ValidatrionError.js";
import { CreateUserDTO } from "../dtos/CreateUserDTO.js";
import { UserResponseDTO } from "../dtos/UserResponseDTO.js";
import { LoginUserDTO } from "../dtos/LoginUserDTO.js";
import { AuthResponseDTO } from "../dtos/AuthResponseDTO.js";
import { IBcryptConfig } from "../../infrastructure/utils/bcrypt/IBcryptConfig.js";


export class UserService {
  constructor(
    private userRepository: UserRepository,
    private jwtConfig: IJwtConfig,
    private bcryptConfig: IBcryptConfig
  ) {}

  public async createUser(dto: CreateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.validate(dto.email);
    
    if (existingUser) {
      throw new ValidationError("user.EMAIL_ALREADY_EXISTS");
    }

    const hashedPassword = await this.bcryptConfig.hash(dto.password, 10);

    const user = new User({
      id: 0, 
      name: dto.name,
      email: dto.email,
      password: hashedPassword
    });

    const savedUser = await this.userRepository.create(user);

    return {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email
    };
  }

  public async authenticateUser(dto: LoginUserDTO): Promise<AuthResponseDTO | null> {
    const user = await this.userRepository.validate(dto.email);
    
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.bcryptConfig.compare(dto.password, user.password);
    
    if (!isPasswordValid) {
      return null;
    }

    const token = this.jwtConfig.sign({ userId: user.id, email: user.email }, "24h");

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  public async getUserById(id: string): Promise<UserResponseDTO | null> {
    const user = await this.userRepository.getUser(id);
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
    };
  }
}