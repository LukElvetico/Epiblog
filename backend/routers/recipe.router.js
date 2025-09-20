import { Router } from 'express';
import Recipe from '../models/Recipes.js';
import authentication from '../middlewares/authentication.js';
import createHttpError from 'http-errors';

const router = Router();

// Ottieni tutti i post in ordine cronologico inverso
router.get('/', async (request, response, next) => {
    try {
        // CORREZIONE: Uso di .find({}) e .sort() per ordinare i post
        const recipes = await Recipe.find({})
            .sort({ createdAt: -1 }) // Ordina dal più recente al più vecchio
            .populate('user');
        
        response.send({
            data: recipes,
        });
    } catch (error) {
        next(createHttpError.InternalServerError(error.message));
    }
});

// Ottieni i post dell'utente loggato
router.get('/my-posts', authentication, async (request, response, next) => {
    try {
        const recipes = await Recipe.find({ user: request.authUser.id }).populate('user');
        response.send({ data: recipes });
    } catch (error) {
        next(createHttpError.InternalServerError(error.message));
    }
});

// Rotta per la ricerca dei post (POSIZIONE CORRETTA)
router.get('/search', async (req, res, next) => {
    try {
        const { q } = req.query;
        if (!q || q.length < 3) {
            return res.status(200).send({ data: [] });
        }
        
        const recipes = await Recipe.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { content: { $regex: q, $options: 'i' } }
            ]
        }).limit(5);

        res.status(200).send({ data: recipes });
    } catch (error) {
        next(createHttpError.InternalServerError(error.message));
    }
});

// Ottieni un singolo post per ID
router.get('/:recipeId', async (request, response, next) => {
    try {
        const recipe = await Recipe.findById(request.params.recipeId)
            .populate('user')
            .populate('comments.user');

        if (!recipe) {
            return next(createHttpError.NotFound('Post non trovato.'));
        }

        response.send(recipe);
    } catch (error) {
        if (error.name === 'CastError') {
            return next(createHttpError.BadRequest('ID del post non valido.'));
        }
        next(createHttpError.InternalServerError(error.message));
    }
});

// Post per creare una nuova ricetta
router.post('/', authentication, async (request, response, next) => {
    try {
        const recipe = await Recipe.create({
            ...request.body,
            user: request.authUser.id,
        });
        response.status(201).send(recipe);
    } catch (error) {
        next(createHttpError.InternalServerError(error.message));
    }
});

// Aggiungi un commento a un post
router.post('/:recipeId/comments', authentication, async (request, response, next) => {
    try {
        const recipe = await Recipe.findById(request.params.recipeId);

        if (!recipe) {
            return next(createHttpError.NotFound('Post non trovato.'));
        }

        const newComment = {
            text: request.body.text,
            user: request.authUser.id,
        };
        recipe.comments.push(newComment);
        await recipe.save();

        const lastCommentIndex = recipe.comments.length - 1;
        await recipe.populate(`comments.${lastCommentIndex}.user`);
        const populatedComment = recipe.comments[lastCommentIndex];

        response.status(201).send(populatedComment);
    } catch (error) {
        next(createHttpError.InternalServerError(error.message));
    }
});

// Aggiorna un post
router.patch('/:recipeId', authentication, async (request, response, next) => {
    try {
        const recipeId = request.params.recipeId;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return next(createHttpError.NotFound('Post non trovato'));

        if (recipe.user.toString() !== request.authUser.id.toString()) {
            return next(createHttpError.Forbidden('Non sei autorizzato a modificare questo post.'));
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            recipeId,
            request.body,
            { new: true, runValidators: true }
        );
        response.send(updatedRecipe);
    } catch (error) {
        next(createHttpError.InternalServerError(error.message));
    }
});

// Cancella un post
router.delete('/:recipeId', authentication, async (request, response, next) => {
    try {
        const recipeId = request.params.recipeId;
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return next(createHttpError.NotFound('Post non trovato'));

        if (recipe.user.toString() !== request.authUser.id.toString()) {
            return next(createHttpError.Forbidden('Non sei autorizzato a cancellare questo post.'));
        }

        await Recipe.findByIdAndDelete(recipeId);
        response.send({ message: 'Post cancellato con successo.' });
    } catch (error) {
        next(createHttpError.InternalServerError(error.message));
    }
});

export default router;