import bcrypt from "bcryptjs";

import { UserRepository } from "../infrastructure/userRepoPrisma";

const userRepo = new UserRepository();

export const createUser = async ({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) => {
  const existingUser = await userRepo.findUserByEmail(email);
  if (existingUser) {
    throw new Error("Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userRepo.createUserInDb({
    email,
    username,
    password: hashedPassword,
  });

  const { password: _removed, ...safeUser } = user;
  return safeUser;
};

export const signInUser = async (email: string, password: string) => {
  const user = await userRepo.findUserByEmail(email);

  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  // Omit password before returning
  const { password: _removed, ...safeUser } = user;
  return safeUser;
};

export const getAllUsers = async () => {
  return userRepo.getAll();
};
