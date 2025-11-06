import { Request, Response, NextFunction } from 'express';
import { validateAuthRequest } from '../utils/validation.util';
import { hashPassword, verifyHash } from '../utils/hash.util';
import { UserService } from '../services/user.service';
import appPool from '../db';
import { generateToken } from '../utils/jwt.util';

const userService = new UserService(appPool);

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.body || Object.entries(req.body).length === 0) {
        return res
            .status(400)
            .json({ success: false, error: 'Email and password are required' });
    }

    const { email, password } = req.body;

    const validationResult = validateAuthRequest(email, password);

    if (!validationResult.success) {
        const response = {
            success: false,
            error: JSON.parse(validationResult.error.message)[0].message,
        };
        return res.status(422).json(response);
    }

    const passwordHash = await hashPassword(password);

    if (passwordHash instanceof Error) {
        return next(passwordHash);
    }

    try {
        if (passwordHash) {
            await userService.createUser(email, passwordHash);
        }

        const newUser = await userService.findByEmail(email);

        if (newUser) {
            const userPayload = {
                id: newUser.id,
                email: newUser.email,
                created_at: newUser.created_at,
            };

            const response = {
                success: true,
                message: 'User registered succesfully',
                data: {
                    user: userPayload,
                },
            };
            return res.status(201).json(response);
        }
    } catch (err) {
        next(err);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    if (!req.body || Object.entries(req.body).length === 0) {
        return res
            .status(400)
            .json({ success: false, error: 'Email and password are required' });
    }

    const { email, password } = req.body;

    const validationResult = validateAuthRequest(email, password);

    if (!validationResult.success) {
        const response = {
            success: false,
            error: 'Invalid credentials',
        };
        return res.status(401).json(response);
    }

    const user = await userService.findByEmail(email);

    if (user) {
        const isPasswordVerified = await verifyHash(
            user.password_hash,
            password
        );

        if (isPasswordVerified instanceof Error) {
            return next(isPasswordVerified);
        }

        if (!isPasswordVerified) {
            const response = {
                success: false,
                error: 'Invalid credentials',
            };
            return res.status(401).json(response);
        }

        const payload = {
            id: user.id,
            email: user.email,
        };

        const token = await generateToken(payload);

        if (token) {
            const response = {
                success: true,
                message: 'Login successful',
                data: {
                    token: token,
                    user: {
                        id: user.id,
                        email: user.email,
                    },
                },
            };

            return res.status(200).json(response);
        }
    } else {
        const response = {
            success: false,
            error: 'Invalid credentials',
        };
        return res.status(401).json(response);
    }
}

export async function profile(req: Request, res: Response, next: NextFunction) {
    if (req.user && typeof req.user !== 'string') {
        const { email } = req.user;
        if (email && typeof email === 'string') {
            const user = await userService.findByEmail(email);

            if (!user) {
                const response = {
                    success: false,
                    error: 'User not found',
                };
                return res.status(404).json(response);
            }

            const response = {
                success: true,
                data: {
                    user: {
                        id: user.id,
                        email: user.email,
                        created_at: user.created_at,
                    },
                },
            };

            return res.status(200).json(response);
        }
    }
}
