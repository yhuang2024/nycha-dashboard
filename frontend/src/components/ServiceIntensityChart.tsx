import PlotlyReact from "react-plotly.js"
const Plot = (PlotlyReact as any).default || PlotlyReact
import type { NYCHARecord } from "../NYCHASchema"

interface Props {
  data: NYCHARecord[]
}

export default function ServiceIntensity({ data }: Props) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>
  }

  const boroughMap: Record<string, { s: number; p: number }> = {}

  data.forEach((d) => {
    if (!d) return

    const b = d.borough ?? "Unknown"

    const s = Number(d.serviceConnections ?? 0)
    const p = Number(d.population ?? 0)

    if (!boroughMap[b]) {
      boroughMap[b] = { s: 0, p: 0 }
    }

    boroughMap[b].s += isNaN(s) ? 0 : s
    boroughMap[b].p += isNaN(p) ? 0 : p
  })

  const entries = Object.entries(boroughMap)

  const x = entries.map(([b]) => b)

  const y = entries.map(([_, v]) =>
    v.p > 0 ? v.s / v.p : 0
  )

  const safeY = y.map((v) => (isFinite(v) ? v : 0))

  return (
    <Plot
      data={[
        {
          type: "bar",
          x,
          y: safeY,
        },
      ]}
      layout={{
        title: "Service Intensity per Capita by Borough",
        yaxis: { title: "Services per Capita" },
      }}
    />
  )
}

console.log("Plot in file =", Plot)
