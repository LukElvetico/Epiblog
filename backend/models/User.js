import { model, Schema } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true, // campo obbligatorio
        trim: true, // toglie gli spazi a inizio e fine
        minlength: 2, // min num di caratteri
        maxlength: 15, // max num di caratteri
    },
    lastName: {
        type: String,
        trim: true,
        minlength: 2,
        maxlength: 15,
    },
    email: {
        type: String,
        required: true,
        unique: true, // duplicati non accettati
        lowercase: true, // converte il testo in minuscolo
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/,
            'Please fill a valid email address',
        ], // validazione dell'input attraverso una RegEx
    },
    password: {
        type: String,
        select: false, // non include la password di default nelle risposte
    },
    profile: {
        type: {
            path: String,
            filename: String,
        },
    },
});

const User = model('User', userSchema);
// const User = model('User', userSchema, 'utenti'); // se non avete rispettato le convenzioni di nomenclatura delle collections nel database (plurale minuscolo in inglese)

export default User;
