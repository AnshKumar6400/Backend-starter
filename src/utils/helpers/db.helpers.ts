import { prisma } from "@/config/app.config";
/**
 * @param {string} email - User email to look up
 * @returns Promise<{ id, email, password } | null>
 */
export const findByEmail = async (
  email: string,
): Promise<{ id: number; email: string; password: string } | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });
};

export const findById = async (id: number): Promise<{ id: number; email: string; } | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
};

export const findByEmailWithResetToken = async (email: string): Promise<{ id: number; email: string; isActive: Boolean; resetToken: string | null; resetTokenExpiresAt: Date | null; } | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: { id: true, isActive: true, email: true, resetToken: true, resetTokenExpiresAt: true },
  });
}
