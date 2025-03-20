const CITY_API_KEY = process.env.CITY_API_KEY;
let recipesDB = []; // Stockage en mémoire des recettes

export const postApiCityRecipe = async (request, reply) => {
  try {
    const { cityId } = request.params;
    const { content } = request.body;

    // 🔹 1. Vérifier si la ville existe via City API
    const cityResponse = await fetch(
      `https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}?apiKey=${CITY_API_KEY}`
    );

    if (!cityResponse.ok) {
      return reply.status(404).send({ error: "City not found" });
    }

    // 🔹 2. Vérifier le contenu de la recette
    if (!content || content.trim() === "") {
      return reply.status(400).send({ error: "Content cannot be empty" });
    }
    if (content.length < 10) {
      return reply
        .status(400)
        .send({ error: "Content must be at least 10 characters long" });
    }
    if (content.length > 2000) {
      return reply
        .status(400)
        .send({ error: "Content must be less than 2000 characters long" });
    }

    // 🔹 3. Ajouter la recette en mémoire
    const newRecipe = {
      id: recipesDB.length + 1, // Générer un ID unique
      cityId,
      content,
    };

    recipesDB.push(newRecipe);

    // 🔹 4. Retourner la réponse avec status 201
    return reply.status(201).send({
      id: newRecipe.id,
      content: newRecipe.content,
    });
  } catch (error) {
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};