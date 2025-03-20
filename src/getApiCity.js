/**
 * Récupère les informations d'une ville depuis City API.
 * @param {string} cityId - L'ID de la ville.
 * @returns {object} - Les informations formatées de la ville.
 */

export const getCityInfo = async (cityId) => {
    try {
      // 🔹 1. Requête vers City API
      const cityResponse = await fetch(
        `https://api-ugi2pflmha-ew.a.run.app/cities/${cityId}?apiKey=${CITY_API_KEY}`
      );
  
      if (!cityResponse.ok) {
        throw new Error("City not found");
      }
  
      const cityData = await cityResponse.json();
  
      // 🔹 2. Retourner les données formatées
      return {
        coordinates: cityData.coordinates, // [lat, lon]
        population: cityData.population,
        knownFor: cityData.knownFor || [],
        weatherPredictions: [], // Pas de météo
        recipes: [], // Tableau vide
      };
    } catch (error) {
      throw new Error(error.message);
    }
  };

