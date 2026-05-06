import { useEffect, useState } from "react"
import { NYCHASchema } from "./NYCHASchema"
import type { NYCHARecord } from "./NYCHASchema"
import Dashboard from "./components/Dashboard"
import { Routes, Route } from "react-router-dom"
import GraphPage from "./components/GraphPage"

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

function normalizeCSVRow(row: any): NYCHARecord | null {
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
}

export default function App() {
  const [data, setData] = useState<NYCHARecord[]>([])

  useEffect(() => {
    //fetch("http://localhost:3001/getcsv?filepath=final_merged_nycha.csv&hasHeader=true")
    fetch("https://nycha-dashboard-backend.vercel.app/getcsv?filepath=final_merged_nycha.csv&hasHeader=true")
      .then((res) => res.json())
      .then((json) => {
        const records = (json.data as any[])
          .map(normalizeCSVRow)
          .filter((item): item is NYCHARecord => item !== null)

        setData(records)
      })
      .catch((error) => {
        console.error("Error loading NYCHA data:", error)
      })
  }, [])

  return (
    <Routes>
      {/* home page */}
      <Route
        path="/"
        element={
          <div style={{ padding: 20 }}>
            <h1>Warning: No Service - An Analysis and Visualization of Unequal Social Service Distribution within NYCHA</h1>
            <p>
              This dashboard examines how access to social services varies across NYCHA developments and
              how those differences are related to workforce participation and economic mobility outcomes.
              By comparing access to services and job training program pipelines across boroughs, this
              dashboard highlights where structural gaps in access to social services may be limiting
              opportunity for NYCHA residents, most likely as a result of chronic underfunding by federal government.
            </p>

            <Dashboard data={data} />
          </div>
        }
      />

      {/* GRAPH PAGES */}
      <Route
        path="/graph/:id"
        element={<GraphPage data={data} />}
      />
    </Routes>
  )
}
