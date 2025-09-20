import bcrypt from 'bcrypt';
import { Router } from 'express';
import User from '../models/User.js';
import createHttpError from 'http-errors';
import { htmlToText } from 'html-to-text';
import mailer from '../helpers/mailer.js';
import { generateJWT } from '../helpers/jwt.js';

const router = Router();

router.post('/register', async (request, response, next) => {
    try {
        const body = request.body;
        const user = await User.findOne({ email: body.email.toLowerCase() });
        if (user) {
            return next(createHttpError.Conflict('Email già usata'));
        }

        const hash = await bcrypt.hash(body.password, 10);
        const insertedUser = await User.create({ ...body, password: hash });
        
        const htmlContent = `
            Benvenuto a bordo, divertiti a cucinare
            <br>
            <a href="http://localhost:5471/login">Accedi da qui</a>
        `;

        await mailer.sendMail({
            from: {
                name: 'Epiblog Admin',
                address: process.env.EMAIL_USER,
            },
            to: insertedUser.email,
            subject: 'Benvenuto',
            text: htmlToText(htmlContent),
            html: htmlContent,
        });

        response.send({ message: 'Registrazione effettuata correttamente, procedi con l\'accesso' });

    } catch (error) {
              next(error);
    }
});

router.post('/verify', async (request, response, next) => {
});

router.post('/login', async (request, response, next) => {
    const body = request.body;
    const user = await User.findOne({ email: body.email.toLowerCase() }).select(
        '+password'
    );
    if (!user) {
        return next(createHttpError.Unauthorized('Credenziali sbagliate'));
    }

    if (!(await bcrypt.compare(body.password, user.password))) {
        return next(createHttpError.Unauthorized('Credenziali sbagliate'));
    }

    const token = await generateJWT(
        { userId: user._id },
        '1h' 
    );

    response.send({ token, user: user.toObject({ getters: true }) });
});

export default router;
