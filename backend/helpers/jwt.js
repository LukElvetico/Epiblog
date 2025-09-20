import jwt from 'jsonwebtoken';

/**
 * Genera un token JWT.
 * @param {object} payload - I dati da includere nel token (es. { userId: '...' }).
 * @param {string} expiresIn - Il tempo di scadenza del token (es. '1h', '30d').
 */
export function generateJWT(payload, expiresIn = '30d') {
    return new Promise((resolve, reject) => {
        // Le opzioni di firma vengono create usando il tempo di scadenza fornito
        const signOptions = {
            expiresIn: expiresIn // <-- Usa il parametro passato, altrimenti il default ('30d')
        };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            signOptions, // <-- Passa le opzioni
            (error, token) => {
                if (error) reject(error);
                else resolve(token);
            }
        );
    });
}

export function verifyJWT(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
            if (error) reject(error);
            else resolve(payload);
        });
    });
}