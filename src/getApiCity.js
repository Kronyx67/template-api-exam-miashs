/**
 * Récupère les informations d'une ville depuis City API.
 * @param {string} cityId - L'ID de la ville.
 * @returns {object} - Les informations formatées de la ville.
 */

const CITY_API_KEY = process.env.API_KEY;

export const getApiCity = async (request, reply) => {
    try {
      const { cityId } = request.params;
  
      // 🔹 1. Requête vers City API
      const cityResponse = await fetch(
        `https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}?apiKey=${CITY_API_KEY}`
      );
  
      if (!cityResponse.ok) {
        return reply.status(404).send({ error: "City not found" });
      }
  
      const cityData = await cityResponse.json();
  
      // 🔹 2. Retourner les données formatées
      return reply.send({
        coordinates: cityData.coordinates, // [lat, lon]
        population: cityData.population,
        knownFor: cityData.knownFor || [],
        weatherPredictions: [], // Pas de météo
        recipes: [], // Tableau vide
      });
    } catch (error) {
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  };

