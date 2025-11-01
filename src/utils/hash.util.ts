import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password: string) : Promise<string | Error | undefined> {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash
    } catch (err) {
        if (err instanceof Error) {
            return err;
        }
    }
}

export async function verifyHash(hash: string, password: string) {
    try {
        const verified = await bcrypt.compare(password, hash);
        return verified
    } catch (err) {
        if (err instanceof Error) {
            return err;
        }
    }
}