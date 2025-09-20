import nodemailer from 'nodemailer';

// Determina se la connessione deve essere sicura, basandosi sul tuo file .env
const isSecure = process.env.EMAIL_SECURE === 'true' || process.env.EMAIL_PORT === '465'; 

const mailer = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: isSecure, 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    // CORREZIONE PER L'ERRORE self-signed certificate:
    tls: {
        // Ignora gli errori di verifica del certificato per la connessione SMTP
        rejectUnauthorized: false, 
    },
    // Aggiunto per debug
    logger: true,
    debug: true
});

export default mailer;