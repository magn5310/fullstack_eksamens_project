import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export async function hashPassword(password: string): Promise<string> {
  const salt = 12;
  return await bcrypt.hash(password, salt);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign({ userId }, process.env.JWT_SECRET, options);
}

export function verifyToken(token: string): { userId: string } | null {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & { userId: string };
    return { userId: decoded.userId };
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("Invalid token:", error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error("Token expired:", error.message);
    } else {
      console.error("Error verifying token:", error);
    }
    return null;
  }
}
