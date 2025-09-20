import jwt from 'jsonwebtoken';
export function generateJWT(payload, expiresIn = '30d') {
    return new Promise((resolve, reject) => {
        const signOptions = {
            expiresIn: expiresIn
        };
        
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            signOptions,
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
