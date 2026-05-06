import express, { Express } from "express"
import cors from "cors"
import { registerGetCSVHandler } from "./getCSVHandler.js"

const app: Express = express()

app.use(cors())
app.use(express.json({ limit: "5mb" }))

registerGetCSVHandler(app)
console.log("Server initialized")

export default app