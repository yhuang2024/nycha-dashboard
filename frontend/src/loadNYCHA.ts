import Papa from "papaparse"
import { NYCHASchema } from "./NYCHASchema"
import type { NYCHARecord } from "./NYCHASchema"

function parseNumber(value: unknown): number {
  if (typeof value === "number") {
    return value
  }

  if (typeof value === "string") {
    const cleaned = value
      .replace(/[$,%]/g, "")
      .replace(/,/g, "")
      .trim()

    const parsed = Number(cleaned)
    return Number.isFinite(parsed) ? parsed : 0
  }

  return 0
}

export function loadNYCHA(csvText: string): NYCHARecord[] {
  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
  })

  return parsed.data
    .map((row: any) => {
      const cleaned = {
        borough: row.borough,
        development: row.nycha_development,

        serviceConnections: parseNumber(row.service_connections),
        population: parseNumber(row.total_population),

        avgWage: parseNumber(row.average_wage_of_such_residents),

        applied: parseNumber(
          row.total_number_of_residents_that_applied_for_the_nycha_resident_training_academy
        ),
        accepted: parseNumber(
          row.total_number_of_residents_that_were_accepted_and_enrolled
        ),
        placed: parseNumber(
          row["total_number_residents_placed_into_full-time_or-part-time_jobs"]
        ),

        servicesPerCapita: parseNumber(row.services_per_capita),
      }

      const result = NYCHASchema.safeParse(cleaned)
      return result.success ? result.data : null
    })
    .filter((item): item is NYCHARecord => item !== null)
}