import {
  randomBytes,
} from "node:crypto";

import type { LoginInput } from "./auth.schemas.js";
import {
  hashPassword,
  verifyPassword,
} from "./password.js";
import { AuthRepository } from "./auth.repository.js";

const SESSION_DURATION_MS =
  7 * 24 * 60 * 60 * 1000;

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  async login(input: LoginInput) {
    const user =
      await this.authRepository.findUserByEmail(
        input.email,
      );

    if (!user) {
      throw new Error(
        "Invalid email or password",
      );
    }

    const passwordValid =
      await verifyPassword(
        input.password,
        user.passwordHash,
      );

    if (!passwordValid) {
      throw new Error(
        "Invalid email or password",
      );
    }

    const token =
      randomBytes(32).toString("hex");

    const expiresAt = new Date(
      Date.now() + SESSION_DURATION_MS,
    );

    await this.authRepository.createSession(
      user.id,
      token,
      expiresAt,
    );

    return {
      token,
      expiresAt,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async findUserBySessionToken(
    token: string,
  ) {
    return this.authRepository
      .findUserBySessionToken(token);
  }

  async logout(token: string) {
    await this.authRepository.deleteSession(
      token,
    );
  }
}
