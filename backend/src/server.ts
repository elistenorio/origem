import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import swaggerUi from "swagger-ui-express"
import { env, isProduction } from "./shared/env"
import { router } from "./application/routes"
import { openapi } from "./application/docs/openapi"
import { iniciarCache } from "./infrastructure/cache/redis"
import { errorHandler, notFoundHandler } from "./middleware/errorHandler"

const app = express()

// No Render o app fica atrás de um proxy HTTPS: sem isso o Express acha que a conexão é http.
if (isProduction) app.set("trust proxy", 1)

// Só o frontend do Origem pode chamar a API, enviando o cookie (credentials). Nunca "*" com credentials.
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Verificação rápida de que o servidor está no ar (usada também pelo Render).
app.get("/", (_req, res) => {
  res.json({ status: "ok", api: "Origem" })
})

// Swagger: documentação interativa de todas as rotas (src/application/docs/openapi.ts).
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi, { customSiteTitle: "API do Origem" }))

app.use("/api", router)

// Depois de todas as rotas: 404 e tratamento global de erros.
app.use(notFoundHandler)
app.use(errorHandler)

// Conecta ao Redis já na subida (sem REDIS_URL, a API roda sem cache).
iniciarCache()

app.listen(env.PORT, () => {
  console.log(`API do Origem rodando em http://localhost:${env.PORT}`)
})
