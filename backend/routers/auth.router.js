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

        // Verifica se l'utente esiste già
        const user = await User.findOne({ email: body.email.toLowerCase() });
        if (user) {
            return next(createHttpError.Conflict('Email già usata'));
        }

        // Hasha la password
        const hash = await bcrypt.hash(body.password, 10);
        const insertedUser = await User.create({ ...body, password: hash });

        // Invia l'email di benvenuto
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

        // Invia la risposta SOLO dopo che tutte le operazioni sono state completate con successo
        // MESSAGGIO DI CORRETTA REGISTRAZIONE AGGIUNTO QUI 👇
        response.send({ message: 'Registrazione effettuata correttamente, procedi con l\'accesso' });

    } catch (error) {
        // Se c'è un errore (es. fallimento dell'invio email), passa l'errore al middleware
        next(error);
    }
});

router.post('/verify', async (request, response, next) => {
    // Qui devi decodificare il token, cercare l'utente nel DB
    // e aggiornare lo stato di "verificato"
});

router.post('/login', async (request, response, next) => {
    const body = request.body;

    // Cerchiamo l'utente con la mail
    const user = await User.findOne({ email: body.email.toLowerCase() }).select(
        '+password'
    );

    // Se non lo troviamo -> errore
    if (!user) {
        return next(createHttpError.Unauthorized('Credenziali sbagliate'));
    }

    // Verifichiamo la password
    if (!(await bcrypt.compare(body.password, user.password))) {
        return next(createHttpError.Unauthorized('Credenziali sbagliate'));
    }

    // Genera il token JWT con scadenza di 1 ora
    const token = await generateJWT(
        { userId: user._id },
        '1h' // Passa il tempo di scadenza desiderato
    );

    // Invia il token e i dati dell'utente per aggiornare il frontend
    response.send({ token, user: user.toObject({ getters: true }) });
});

export default router;