import 'dotenv/config'
import Fastify from 'fastify'
import { submitForReview } from './submission.js'
import { getCityInfo } from "./getApiCity.js";

const fastify = Fastify({
  logger: true,
})

// Route GET /cities/:cityId/infos
fastify.get("/cities/:cityId/infos", async (request, reply) => {
  try {
    const { cityId } = request.params;
    const cityInfo = await getCityInfo(cityId);
    return reply.send(cityInfo);
  } catch (error) {
    if (error.message === "City not found") {
      return reply.status(404).send({ error: "City not found" });
    }
    return reply.status(500).send({ error: "Internal Server Error" });
  }
});

fastify.listen(
  {
    port: process.env.PORT || 3000,
    host: process.env.RENDER_EXTERNAL_URL ? '0.0.0.0' : process.env.HOST || 'localhost',
  },
  function (err) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }

    //////////////////////////////////////////////////////////////////////
    // Don't delete this line, it is used to submit your API for review //
    // everytime your start your server.                                //
    //////////////////////////////////////////////////////////////////////
    submitForReview(fastify)
  }
)
