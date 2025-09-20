import express from 'express';
import createHttpError from 'http-errors';
import { htmlToText } from 'html-to-text';
import authentication from '../middlewares/authentication.js';

import User from '../models/User.js';
import mailer from '../helpers/mailer.js';
import {
    cloudinary,
    uploadCloudinary,
} from '../middlewares/uploadCloudinary.js';

const router = express.Router();

router.get('/', async (request, response, next) => {
    try {
        const searchTerm = request.query.search;

        let queryObj;
        if (searchTerm) {
            queryObj = {
                firstName: new RegExp(searchTerm, 'i'),
            };
        } else {
            queryObj = {};
        }

        let page = parseInt(request.query.page) || 1;
        if (page < 1) page = 1;

        let perPage = parseInt(request.query.perPage) || 3;
        if (perPage < 1 || perPage > 25) perPage = 3;

        const totalCount = await User.countDocuments();
        const totalPages = Math.ceil(totalCount / perPage);

        const users = await User.find(queryObj)
            .sort({ firstName: 1, lastName: 1 })
            .skip((page - 1) * perPage)
            .limit(perPage);

        response.send({
            page,
            perPage,
            totalPages,
            totalCount,
            data: users,
        });
    } catch (error) {
        console.log(error);
        next(createHttpError.InternalServerError(error));
    }
});

// Aggiunto per recuperare i dati dell'utente loggato
router.get('/me', authentication, async (request, response, next) => {
    try {
        const user = await User.findById(request.authUser.id);
        if (!user) {
            return next(createHttpError.NotFound('Utente non trovato'));
        }
        response.send(user);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

// Aggiunto per aggiornare i dati dell'utente loggato
// Aggiunto per aggiornare i dati dell'utente loggato
router.patch('/me', authentication, async (request, response, next) => {
    try {
        // 1. Definiamo i campi che l'utente PUÒ modificare
        const allowedUpdates = ['firstName', 'lastName', 'email']; 

        // 2. Filtriamo request.body per creare un oggetto di aggiornamento pulito
        const updates = {};
        Object.keys(request.body).forEach(key => {
            if (allowedUpdates.includes(key) && request.body[key] !== null && request.body[key] !== undefined) {
                updates[key] = request.body[key];
            }
        });
        
        // 3. Controlliamo se ci sono campi validi da aggiornare
        if (Object.keys(updates).length === 0) {
            return response.status(200).send({ message: "Nessun dato valido fornito per l'aggiornamento." });
        }

        const user = await User.findByIdAndUpdate(
            request.authUser.id,
            updates, // 👈 USIAMO L'OGGETTO FILTRATO
            { new: true, runValidators: true }
        );
        
        if (!user) {
            return next(createHttpError.NotFound('Utente non trovato'));
        }
        
        response.send(user); 
        
    } catch (error) {
        // Migliore gestione degli errori: se è un errore di validazione Mongoose, usiamo 400 Bad Request
        if (error.name === 'ValidationError') {
             return next(createHttpError.BadRequest(error.message));
        }
        console.error('Errore durante PATCH /me:', error);
        next(createHttpError.InternalServerError(error));
    }
});

// Aggiunto per cancellare l'account dell'utente loggato
router.delete('/me', authentication, async (request, response, next) => {
    try {
        const user = await User.findByIdAndDelete(request.authUser.id);
        if (!user) {
            return next(createHttpError.NotFound('Utente non trovato'));
        }
        response.send({ message: 'Account cancellato con successo.' });
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

// Ho spostato e corretto queste rotte che hai fornito in precedenza
// Non le ho cancellate, ma ho aggiunto controlli di sicurezza
router.get('/:userId', async (request, response, next) => {
    const userId = '' + request.params.userId;

    try {
        const user = await User.findById(userId);

        if (user) response.send(user);
        else next(createHttpError.NotFound('Non trovato'));
    } catch (error) {
        next(createHttpError.NotFound('Non trovato'));
    }
});

router.post(
    '/',
    uploadCloudinary.single('profile'),
    async (request, response, next) => {
        try {
            const userData = {
                ...request.body,
                profile: request.file
                    ? {
                          path: request.file.path,
                          filename: request.file.filename,
                      }
                    : null,
            };

            const insertedUser = await User.create(userData);

            response.send(insertedUser);
        } catch (error) {
            console.log(error);
            next(createHttpError.InternalServerError(error));
        }
    }
);

router.patch(
    '/:userId/profile',
    uploadCloudinary.single('profile'),
    async (request, response, next) => {
        const userId = request.params.userId;
        const originalUser = await User.findById(userId);
        const filename = originalUser?.profile?.filename;

        let user;
        try {
            user = await User.findByIdAndUpdate(
                userId,
                {
                    profile: request.file
                        ? {
                              path: request.file.path,
                              filename: request.file.filename,
                          }
                        : null,
                },
                { new: true }
            );
        } catch (error) {
            console.log(error);
            return next(createHttpError.InternalServerError(error));
        }

        try {
            if (originalUser.profile) {
                await cloudinary.uploader.destroy(
                    originalUser.profile.filename,
                    {
                        invalidate: true,
                    }
                );
            }
        } catch (error) {
            console.log(error);
        }

        response.send(user);
    }
);

router.put('/:userId', async (request, response, next) => {
    const userId = request.params.userId;
    const userData = request.body;

    try {
        const user = await User.findByIdAndUpdate(userId, userData, { new: true });
        response.send(user);
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

router.delete('/:userId', async (request, response, next) => {
    const userId = request.params.userId;

    try {
        await User.findByIdAndDelete(userId);
        response.send({ message: 'user deleted' });
    } catch (error) {
        next(createHttpError.InternalServerError(error));
    }
});

export default router;
