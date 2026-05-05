import express, { Express } from "express"
import cors from "cors"
import { fileURLToPath } from "url"
import path from "path"
import { registerGetCSVHandler } from "./getCSVHandler.js"

export class ServerApp {
  public app: Express
  private port: number

  constructor(port: number = 3001) {
    this.app = express()
    this.port = port
    this.configureMiddleware()
    this.registerHandlers()
  }

  private configureMiddleware() {
    this.app.use(cors())
    this.app.use(express.json({ limit: "5mb" }))
  }

  private registerHandlers() {
    registerGetCSVHandler(this.app)
  }

  public start() {
    this.app.listen(this.port, () => {
      console.log(` Backend running at http://localhost:${this.port}`)
    })
  }

  public getApp(): Express {
    return this.app
  }
}

const __filename = fileURLToPath(import.meta.url)
const isMain = path.resolve(process.argv[1]) === path.resolve(__filename)

if (isMain) {
  const server = new ServerApp()
  server.start()
}

