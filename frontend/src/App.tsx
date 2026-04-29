import { useEffect, useState } from "react"
import { loadNYCHA } from "./loadNYCHA"
import type { NYCHARecord } from "./NYCHASchema"
import Dashboard from "./components/Dashboard"

export default function App() {
  const [data, setData] = useState<NYCHARecord[]>([])
  const [borough, setBorough] = useState<string>("All")

  useEffect(() => {
    fetch("")
      .then((res) => res.text())
      .then((text) => {
        const cleaned = loadNYCHA(text)
        setData(cleaned)
      })
  }, [])

  const filteredData =
    borough === "All"
      ? data
      : data.filter((d) => d.borough === borough)

  return (
    <div style={{ padding: 20 }}>
      <h1>NYCHA Dashboard</h1>

      <select onChange={(e) => setBorough(e.target.value)}>
        <option>All</option>
        {[...new Set(data.map((d) => d.borough))].map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>

      <Dashboard data={filteredData} />
    </div>
  )
}
