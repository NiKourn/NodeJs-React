import { prisma } from '@/lib/prisma';
import { User, Prisma } from '@prisma/client';

export class Users {
  // Create a new user
  static async create(userData: Prisma.UserCreateInput): Promise<User> {
    return await prisma.user.create({
      data: userData,
    });
  }

  // Find user by email
  static async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Find user by ID
  static async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  // Find user by username
  static async findByUsername(username: string): Promise<User | null> {
    return await prisma.user.findFirst({
      where: { username },
    });
  }

  static async updatePassword(id: number, hashedPassword: string): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  }

  // Update user
  static async update(id: number, userData: Prisma.UserUpdateInput): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: userData,
    });
  }

  // Delete user
  static async delete(id: number): Promise<User> {
    return await prisma.user.delete({
      where: { id },
    });
  }

  // Get all users
  static async findAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }
}
