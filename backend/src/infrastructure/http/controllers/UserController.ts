import { Request, Response } from "express";
import { UserService } from "../../../application/services/UserService.js";
import { CreateUserDTO } from "../../../application/dtos/CreateUserDTO.js";
import { LoginUserDTO } from "../../../application/dtos/LoginUserDTO.js";
import { ValidationError } from "../../../domain/errors/ValidatrionError.js";

export class UserController {
  private userService: UserService;

  constructor(userService: UserService) {
    this.userService = userService;
  }

  public async createUser(req: Request, res: Response): Promise<Response> {
    try {
      const dto: CreateUserDTO = req.body;
      const user = await this.userService.createUser(dto);
      return res.status(201).json(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  public async login(req: Request, res: Response): Promise<Response> {
    try {
      const dto: LoginUserDTO = req.body;
      const authResult = await this.userService.authenticateUser(dto);
      
      if (!authResult) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      
      return res.status(200).json(authResult);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}