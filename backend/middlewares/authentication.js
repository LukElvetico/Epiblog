import createHttpError from 'http-errors';
import { verifyJWT } from '../helpers/jwt.js';
import User from '../models/User.js';

async function authentication(request, response, next) {
    if (!request.headers.authorization)
        return next(createHttpError.Unauthorized());

    const parts = request.headers.authorization.split(' ');
    if (parts.length != 2) return next(createHttpError.Unauthorized());
    if (parts[0] != 'Bearer') return next(createHttpError.Unauthorized());

    const jwtToken = parts[1];

    try {
        // verificare il token jwt
        const payload = await verifyJWT(jwtToken);
        // se va bene
        // recuperiamo l'utente dal db
        console.log(payload);
        const authUser = await User.findById(payload.userId);
        if (!authUser) throw new Error('No user');

        // aggiungo l'utente alla request authUser
        request.authUser = authUser;
        next();
    } catch {
        // se fallisce la verifica -> errore
        next(createHttpError.Unauthorized());
    }
}

export default authentication;
