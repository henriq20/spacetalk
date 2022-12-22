import db from '../db.js';
import Ajv, { AsyncSchema } from 'ajv';
import { Prisma } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';

export default function createValidation(schema: AsyncSchema) {
    const ajv = new Ajv.default({
        allErrors: true
    });

    ajv.addKeyword({
        keyword: 'unique',
        type: 'string',
        async: true,
        validate: isUnique
    });

    const validate = ajv.compile(schema);

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await validate(req.body);
            next();
        } catch (err) {
            if (!(err instanceof Ajv.ValidationError)) {
                return next(err);
            }

            const fields: { [key: string]: { type: string, message: string } } = {};

            for (const validationError of err.errors) {
                if (validationError.instancePath) {
                    const fieldName = validationError.instancePath.split('/').pop();

                    if (fieldName && !(fieldName in fields)) {
                        fields[fieldName] = {
                            type: validationError.keyword ?? '',
                            message: validationError.message ?? ''
                        };
                    }
                }
            }

            return res.status(422).json({
                success: false,
                message: 'the given data was invalid',
                fields
            });
        }
    };
}

async function isUnique(schema: { table: string, column: string }, data: string) {
    const result = await db.$queryRaw`
        SELECT * FROM ${ Prisma.raw(schema.table) } WHERE ${ Prisma.raw(schema.column) } = ${ data } LIMIT 1;
    ` as unknown[];

    return !result.length;
}
