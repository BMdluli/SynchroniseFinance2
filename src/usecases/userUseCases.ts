import bcrypt from "bcryptjs";
import { UserRepository } from "../infrastructure/userRepoPrisma";
import { ConflictError, UnauthorizedError } from "../utils/errors/CustomError";

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
    throw new ConflictError("Email is already in use");
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
  if (!user) throw new UnauthorizedError("Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    throw new UnauthorizedError("Invalid email or password");

  const { password: _removed, ...safeUser } = user;
  return safeUser;
};
