import { Schema } from 'mongoose';

const commentSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true, // aggiunge createdAt e updatedAt
    }
);

// NON FARE IL MODEL PER GLI SCHEMA CHE VERRANNO EMBEDDATI
// ALTRIMENTI MONGOOSE CREA LA COLLECTION
// const Comment = model('Comment', commentSchema);

export default commentSchema;
