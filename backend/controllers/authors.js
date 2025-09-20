import Author from "../models/Author.js";

export async function getAll(request, response) {
    try{
        const authors = await Author.find()
        response.status(200).json(authors)
    } catch (error) {
        response.status(500).json({message: "errore nel recupero degli autori, ancora nessun autore presente", error})
    }   
}
