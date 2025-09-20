import { model, Schema } from 'mongoose';
import commentSchema from './Comment.js';

const tagSchema = new Schema(
    {
        name: String,
        weight: Number,
    },
    {
        _id: false,
    }
);

const recipeSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        cookingTime: {
            type: Number,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: '{VALUE} Deve essere un intero',
            },
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        comments: [commentSchema],
        tags: [tagSchema],
    },
    {
        timestamps: true, // Aggiunto: abilita i campi createdAt e updatedAt
    }
);

const Recipe = model('Recipe', recipeSchema);

export default Recipe;