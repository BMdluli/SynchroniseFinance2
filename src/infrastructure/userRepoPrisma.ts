import { prisma } from "../config/prisma";

export class UserRepository {
  async createUserInDb(userData: {
    email: string;
    username: string;
    password: string;
  }) {
    return await prisma.user.create({
      data: userData,
    });
  }

  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async getAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        username: true,
      },
    });
  }
}
