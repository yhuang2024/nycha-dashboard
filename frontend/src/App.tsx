import { useEffect, useState } from "react"
import { NYCHASchema } from "./NYCHASchema"
import type { NYCHARecord } from "./NYCHASchema"
import Dashboard from "./components/Dashboard"
import { Routes, Route } from "react-router-dom"
import GraphPage from "./components/GraphPage"
import { normalizeCSVRow } from "./loadNYCHA"

export default function App() {
  const [data, setData] = useState<NYCHARecord[]>([])

  useEffect(() => {
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
    //different pages
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
              opportunity for NYCHA residents as a result of chronic underfunding by the federal government.
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
