import bcrypt from 'bcrypt';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/token';
import { LoginInput, RegisterInput } from '../validators/auth.validator';

const SALT_ROUNDS = 12;

export interface SafeUser {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

function toSafeUser(user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}): SafeUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function registerUser(
  input: RegisterInput,
): Promise<{ user: SafeUser; token: string }> {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    throw ApiError.conflict('An account with this email already exists');
  }

  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
  });

  const token = signToken({ userId: user.id });

  return { user: toSafeUser(user), token };
}

export async function loginUser(input: LoginInput): Promise<{ user: SafeUser; token: string }> {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(input.password, user.password);

  if (!isPasswordValid) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const token = signToken({ userId: user.id });

  return { user: toSafeUser(user), token };
}

export async function getCurrentUser(userId: string): Promise<SafeUser> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw ApiError.notFound('User not found');
  }

  return toSafeUser(user);
}