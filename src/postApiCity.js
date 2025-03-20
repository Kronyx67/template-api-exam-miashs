const CITY_API_KEY = 'm_KL1335y'; // Assure-toi que cette clé est définie correctement
let recipesDB = []; // Stockage en mémoire des recettes

export const postApiCityRecipe = async (request, reply) => {
  try {
    const { cityId } = request.params; // Récupérer l'ID de la ville depuis l'URL
    const { content } = request.body;  // Récupérer le contenu de la recette dans le corps de la requête

    // 🔹 1. Vérification si la ville existe via l'API City API
    const cityResponse = await fetch(
      `https://template-api-exam-miashs-3zav.onrender.com/cities/${cityId}?apiKey=${CITY_API_KEY}`,
      {
        headers: {
          Accept: 'application/json', // Demander la réponse en format JSON
        },
      }
    );

    if (!cityResponse.ok) {
      // Si la ville n'existe pas ou que l'API renvoie une erreur
      const errorDetails = await cityResponse.text();
      console.error("City API error:", errorDetails);

      return reply.status(404).send({ error: `City with ID ${cityId} not found.` });
    }

    // 🔹 2. Validation du contenu de la recette
    if (!content || content.trim() === "") {
      return reply.status(400).send({ error: "Content cannot be empty." });
    }
    if (content.length < 10) {
      return reply.status(400).send({ error: "Content must be at least 10 characters long." });
    }
    if (content.length > 2000) {
      return reply.status(400).send({ error: "Content must be less than 2000 characters long." });
    }

    // 🔹 3. Ajouter la recette à la base de données en mémoire avec un ID unique
    const newRecipe = {
      id: recipesDB.length + 1,  // ID unique sous forme d'entier pour identifier la recette
      cityId,  // L'ID de la ville auquel la recette est associée
      content,  // Le contenu de la recette
    };

    recipesDB.push(newRecipe);  // Sauvegarde la recette dans la "base de données" en mémoire

    // 🔹 4. Retourner la réponse avec le statut 201 et la recette créée
    return reply.status(201).send({
      id: newRecipe.id,   // ID unique de la recette
      content: newRecipe.content,  // Le contenu de la recette
    });
  } catch (error) {
    // Log détaillé pour les erreurs internes
    console.error("Internal Server Error:", error);

    return reply.status(500).send({ error: "Internal Server Error" });
  }
};




