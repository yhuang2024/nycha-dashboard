import type { VercelRequest, VercelResponse } from "@vercel/node"
import path from "path"
import fs from "fs/promises"
import Papa from "papaparse"

function sendError(res: VercelResponse, status: number, message: string) {
  return res.status(status).json({
    result: "error",
    message
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let hasHeader = false

  const { filepath, hasHeader: hasHeaderQuery } = req.query

  if (!filepath || typeof filepath !== "string") {
    return sendError(res, 400, "Missing or invalid 'filepath' parameter.")
  }

  if (hasHeaderQuery) {
    if (typeof hasHeaderQuery !== "string") {
      return sendError(res, 400, "Invalid 'hasHeader' parameter.")
    }

    const value = hasHeaderQuery.toLowerCase()
    if (value !== "true" && value !== "false") {
      return sendError(res, 400, "Invalid value for 'hasHeader'.")
    }

    hasHeader = value === "true"
  }

  try {
    const filepathResolved = path.join(process.cwd(), filepath)

    const fileContent = await fs.readFile(filepathResolved, "utf-8")

    const result = Papa.parse(fileContent, {
      header: hasHeader,
      skipEmptyLines: true,
    })

    if (result.errors.length > 0) {
      return sendError(res, 400, result.errors[0].message)
    }

    return res.status(200).json({
      result: "success",
      data: result.data
    })

  } catch (err) {
    return sendError(res, 500, `Error reading file: ${(err as Error).message}`)
  }
}