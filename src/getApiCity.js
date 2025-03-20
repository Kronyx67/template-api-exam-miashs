import dotenv from "dotenv";

dotenv.config();

const CITY_API_KEY = 'm_KL1335y';
const WEATHER_API_KEY = 'm_KL1335y';
/**
 * Récupère les informations d'une ville depuis City API et Weather API.
 * @param {string} cityId - L'ID de la ville.
 * @returns {object} - Les informations formatées de la ville.
 */
export const getApiCity = async (request, reply) => {
    try {
        const { cityId } = request.params;
        
        // 🔹 1. Requête vers City API pour obtenir l'ID de la ville

        console.log(`Searching for city: ${cityId}`);
        const citySearchResponse = await fetch(
            `https://api-ugi2pflmha-ew.a.run.app/cities?search=${cityId}&apiKey=${CITY_API_KEY}`,
            {
                headers: {
                    Accept: 'application/json' // Ajout du header pour obtenir des données JSON
                }
            }
        );
  
        if (!citySearchResponse.ok) {
            console.log(`City search failed with status: ${citySearchResponse.status}`);
            return reply.status(404).send({ error: "City not found" });
        }
  
        const citySearchData = await citySearchResponse.json();
  
        // Si aucune ville n'est trouvée
        if (citySearchData.length === 0) {
            return reply.status(404).send({ error: "City not found" });
        }
  
        // Récupérer l'ID de la première ville trouvée
        const city = citySearchData[0];
        const cityUniqueId = city.id; // City ID
  
        // 🔹 2. Requête vers City API pour obtenir les infos de la ville
        const cityResponse = await fetch(
            `https://api-ugi2pflmha-ew.a.run.app/cities/${cityUniqueId}/insights?apiKey=${CITY_API_KEY}`,
            {
                headers: {
                    Accept: 'application/json' // Ajout du header pour obtenir des données JSON
                }
            }
        );
  
        if (!cityResponse.ok) {
            return reply.status(404).send({ error: "City insights not found" });
        }
  
        const cityData = await cityResponse.json();
  
        // 🔹 3. Requête vers Weather API pour obtenir les prévisions météo
        const weatherResponse = await fetch(
            `https://api-ugi2pflmha-ew.a.run.app/weather-predictions?cityId=${cityUniqueId}&apiKey=${WEATHER_API_KEY}`,
            {
                headers: {
                    Accept: 'application/json' // Ajout du header pour obtenir des données JSON
                }
            }
        );
  
        if (!weatherResponse.ok) {
            return reply.status(500).send({ error: "Weather data not available" });
        }
  
        const weatherData = await weatherResponse.json();
  
        // Adapter la structure des données météo
        const weatherPredictions = weatherData[0]?.predictions?.map((day) => ({
            when: day.when,
            min: day.min,
            max: day.max,
        })) || [];
  
        // 🔹 4. Filtrer les recettes pour cette ville
        //const cityRecipes = recipesDB.filter((recipe) => recipe.cityId === cityId);
  
        // 🔹 5. Retourner la réponse formatée
        return reply.send({
            coordinates: cityData.coordinates ? [
                cityData.coordinates.latitude,  // Récupérer latitude de l'objet
                cityData.coordinates.longitude, // Récupérer longitude de l'objet
            ] : [],  // Si les coordonnées sont manquantes, retourner un tableau vide
            population: cityData.population || 0,  // Si la population est manquante, retourner 0
            knownFor: cityData.knownFor || [],  // Si la liste "knownFor" est manquante, retourner un tableau vide
            weatherPredictions,  // Prévisions météo
            //recipes: cityRecipes,  // Recettes associées à la ville
        });
    } catch (error) {
        console.error("Internal Server Error:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
};
