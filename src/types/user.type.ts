export interface User {
    id: number;
    email: string;
    password_hash: string;
    created_at: string;
}

export interface UserServiceType<T> {
    findAll(): Promise<T[] | Error | undefined>,
    findById(id: number): Promise<T | undefined>,
    findByEmail(email: string): Promise<T | undefined>,
    createUser(email: string, hashedPassword: string): Promise<undefined>,
    deleteUser(email: string): Promise<undefined>
}