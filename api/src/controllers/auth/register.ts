import bcrypt from 'bcrypt';
import db from '../../db.js';
import { Request, Response } from 'express';
import createValidation from '../../middlewares/validation.js';

export const validate = createValidation({
    type: 'object',
    $async: true,
    properties: {
        email: {
            type: 'string',
            minLength: 2,
            maxLength: 191,
            pattern: '^[\\w\\-\\.]+@([\\w\\-]+\\.)+[\\w\\-]{2,4}$',
            unique: {
                table: 'users',
                column: 'email'
            },
        },
        username: {
            type: 'string',
            minLength: 3,
            maxLength: 50,
            unique: {
                table: 'users',
                column: 'username'
            }
        },
        password: {
            type: 'string',
            minLength: 6
        }
    },
    required: [ 'email', 'username', 'password' ]
});

export default async function register(req: Request, res: Response) {
    const { email, username, password } = req.body;

    const user = await db.user.create({
        data: {
            email,
            username,
            displayName: username,
            password: await bcrypt.hash(password, 10)
        }
    });

    return res.json({
        success: true,
        data: user
    });
}
