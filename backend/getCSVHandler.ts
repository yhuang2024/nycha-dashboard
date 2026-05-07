import { Express, Request, Response } from "express"
import { sendError } from "./responseUtils.js"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs/promises"
import Papa from "papaparse"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

//registering endpoint for express backend server to get csv data to frontend visualizations
export function registerGetCSVHandler(app: Express) {
  app.get("/getcsv", async (req: Request, res: Response) => {
    let hasHeader: boolean = false

    if (!req.query.filepath) {
      return sendError(req, res, 400, "Missing 'filepath' query parameter.")
    } else if (typeof req.query.filepath !== "string") {
      return sendError(req, res, 400, "Invalid type for 'filepath' query parameter.")
    }

    if (req.query.hasHeader) {
      if (typeof req.query.hasHeader === "string") {
        const value = req.query.hasHeader.toLowerCase()
        if (value === "true" || value === "false") {
          hasHeader = value === "true"
        } else {
          return sendError(req, res, 400, "Invalid value for 'hasHeader' query parameter.")
        }
      } else {
        return sendError(req, res, 400, "Invalid type for 'hasHeader' query parameter.")
      }
    }

    try {
      const filepath = path.resolve(__dirname, "./data/final_merged_nycha.csv")
      const fileContent = await fs.readFile(filepath, "utf-8")
      const result = Papa.parse(fileContent, {
        header: hasHeader,
        skipEmptyLines: true,
      })

      if (result.errors.length > 0) {
        return sendError(req, res, 400, `CSV parse error: ${result.errors[0].message}`)
      }

      res.status(200).json({
        result: "success",
        data: result.data
      })
    } catch (error) {
      return sendError(req, res, 400, `Error reading or parsing file: ${(error as Error).message}`)
    }
  })
}
