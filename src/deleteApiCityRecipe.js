const CITY_API_KEY = process.env.API_KEY;
let recipesDB = []; // Stockage en mémoire des recettes

export const deleteApiCityRecipe = async (request, reply) => {
  try {
    const { cityId, recipeId } = request.params;
    const recipeIdNum = parseInt(recipeId, 10);

    // 🔹 1. Vérifier si la ville existe via City API
    const cityResponse = await fetch(
      `https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}?apiKey=${CITY_API_KEY}`
    );

    if (!cityResponse.ok) {
      return reply.status(404).send({ error: "City not found" });
    }

    // 🔹 2. Trouver la recette
    const recipeIndex = recipesDB.findIndex(
      (recipe) => recipe.id === recipeIdNum && recipe.cityId === cityId
    );

    if (recipeIndex === -1) {
      return reply.status(404).send({ error: "Recipe not found" });
    }

    // 🔹 3. Supprimer la recette
    recipesDB.splice(recipeIndex, 1);

    // 🔹 4. Répondre avec un statut 204 (No Content)
    return reply.status(204).send();
  } catch (error) {
    return reply.status(500).send({ error: "Internal Server Error" });
  }
};