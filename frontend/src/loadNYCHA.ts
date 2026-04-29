import Papa from "papaparse"
import { NYCHASchema } from "../src/NYCHASchema"
import type { NYCHARecord } from "../src/NYCHASchema"

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

        serviceConnections: row.service_connections,
        population: row.total_population,

        avgWage: row.average_wage_of_such_residents,

        applied:
            row.total_number_of_residents_that_applied_for_the_nycha_resident_training_academy,

        accepted:
            row.total_number_of_residents_that_were_accepted_and_enrolled,

        placed:
            row.total_number_residents_placed_into_full_time_or_part_time_jobs,

        servicesPerCapita: row.services_per_capita,
        }

        const result = NYCHASchema.safeParse(cleaned)

        return result.success ? result.data : null
    }).filter((item): item is NYCHARecord => item !== null)
}
