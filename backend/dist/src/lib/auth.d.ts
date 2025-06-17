export declare function hashPassword(password: string): Promise<string>;
export declare function verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
export declare function generateToken(userId: string): string;
export declare function verifyToken(token: string): {
    userId: string;
} | null;
//# sourceMappingURL=auth.d.ts.map