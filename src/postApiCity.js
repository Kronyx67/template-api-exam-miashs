const CITY_API_KEY = 'm_KL1335y';
let recipesDB = []; // Stockage en mémoire des recettes

export const postApiCityRecipe = async (request, reply) => {
  try {
    const { cityId } = request.params;
    const { content } = request.body;

    // 🔹 1. Vérifier si la ville existe via City API
    const cityResponse = await fetch(
      `https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}?apiKey=${CITY_API_KEY}`,
      {
        headers: {
          Accept: 'application/json', // Demander des données JSON
        },
      }
    );

    if (!cityResponse.ok) {
      // Log détaillé en cas d'échec
      const errorDetails = await cityResponse.text();
      console.error("City API error:", errorDetails);

      return reply.status(404).send({ error: `City not found: ${cityId}` });
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

    // 🔹 3. Ajouter la recette en mémoire avec un ID unique
    const newRecipe = {
      id: recipesDB.length + 1, // ID unique sous forme d'entier
      cityId,
      content,
    };

    recipesDB.push(newRecipe);

    // 🔹 4. Retourner la réponse avec status 201
    return reply.status(201).send({
      id: newRecipe.id,   // Identifiant unique de la recette
      content: newRecipe.content, // Le contenu de la recette
    });
  } catch (error) {
    // Log détaillé des erreurs internes
    console.error("Internal Server Error:", error);

    return reply.status(500).send({ error: "Internal Server Error" });
  }
};




