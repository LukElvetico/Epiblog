// /posts/:postId/comments/:commentId
/*import { Router } from 'express';
import Recipe from '../models/Recipes.js';
import createHttpError from 'http-errors';
import authentication from '../middlewares/authentication.js';

const router = Router();

router.get('/recipes/:recipeId/comments', async (request, response, next) => {
    const recipe = await Recipe.findById(request.params.recipeId).populate(
        'comments.user'
    );
    if (!recipe) return next(createHttpError.NotFound('recipe not found'));

    const comments = recipe.comments;

    // eventuale paginazione

    response.send({ data: comments });
});

router.get(
    '/recipes/:recipeId/comments/:commentId',
    async (request, response, next) => {
        const recipe = await Recipe.findById(request.params.recipeId).populate(
            'comments.user'
        );
        if (!recipe) return next(createHttpError.NotFound('recipe not found'));

        const comment = recipe.comments.id(request.params.commentId);
        if (!comment)
            return next(createHttpError.NotFound('comment not found'));

        response.send(comment);
    }
);

router.post('/recipes/:recipeId/comments', authentication, async (request, response, next) => {
    const recipe = await Recipe.findById(request.params.recipeId).populate(
        'comments.user'
    );
    if (!recipe) return next(createHttpError.NotFound('recipe not found'));

    // Aggiungi l'ID dell'utente loggato al commento
    const newComment = recipe.comments.create({
        ...request.body,
        user: request.authUser.id,
    });
    recipe.comments.push(newComment);
    const modifiedRecipe = await recipe.save();
    await modifiedRecipe.populate('comments.user');
    const updatedComment = modifiedRecipe.comments.id(newComment._id);

    response.send(updatedComment);
});

router.patch(
    '/recipes/:recipeId/comments/:commentId',
    authentication,
    async (request, response, next) => {
        const commentId = request.params.commentId;

        const recipe = await Recipe.findById(request.params.recipeId).populate(
            'comments.user'
        );
        if (!recipe) return next(createHttpError.NotFound('recipe not found'));

        const comment = recipe.comments.id(commentId);
        if (!comment)
            return next(createHttpError.NotFound('comment not found'));

        // Verifica che l'utente sia l'autore del commento
        if (comment.user.toString() !== request.authUser.id.toString()) {
            return next(createHttpError.Forbidden('Non sei autorizzato a modificare questo commento.'));
        }
        
        for (let key in request.body) {
            comment[key] = request.body[key];
        }

        const modifiedRecipe = await recipe.save();
        const updatedComment = modifiedRecipe.comments.id(commentId);

        response.send(updatedComment);
    }
);

router.delete(
    '/recipes/:recipeId/comments/:commentId',
    authentication,
    async (request, response, next) => {
        const commentId = request.params.commentId;
        const recipe = await Recipe.findById(request.params.recipeId);
        if (!recipe) return next(createHttpError.NotFound('recipe not found'));

        const comment = recipe.comments.id(commentId);
        if (!comment)
            return next(createHttpError.NotFound('comment not found'));

        // Verifica che l'utente sia l'autore del commento
        if (comment.user.toString() !== request.authUser.id.toString()) {
            return next(createHttpError.Forbidden('Non sei autorizzato a cancellare questo commento.'));
        }

        comment.deleteOne();

        const modifiedRecipe = await recipe.save();
        response.send(modifiedRecipe);
    }
);

export default router;
*/