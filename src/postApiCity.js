const CITY_API_KEY = 'm_KL1335y';
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

    // 🔹 3. Générer un ID unique pour la recette (en utilisant Date.now et un nombre aléatoire)
    const generateUniqueId = () => {
      return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };

    const newRecipe = {
      id: generateUniqueId(), // Générer un ID unique sans module
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
    // Log détaillé des erreurs internes
    console.error("Internal Server Error:", error);

    return reply.status(500).send({ error: "Internal Server Error" });
  }
};

