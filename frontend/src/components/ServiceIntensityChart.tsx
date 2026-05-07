import PlotlyReact from "react-plotly.js"
const Plot = (PlotlyReact as any).default ?? PlotlyReact
import type { NYCHARecord } from "../NYCHASchema"

interface Props {
  data: NYCHARecord[]
}

//bar chart that shows service connections per capita by borough
export default function ServiceIntensity({ data }: Props) {
  if (!Array.isArray(data) || data.length === 0) {
    return <div>No data available</div>
  }

  const boroughMap: Record<string, { s: number; p: number }> = {}

  data.forEach((d) => {
    if (!d?.borough || d.borough.trim() === "") {
      return
    }

    const b = d.borough.trim()
    const s = Number(d?.serviceConnections ?? 0)
    const p = Number(d?.population ?? 0)

    if (!boroughMap[b]) {
      boroughMap[b] = { s: 0, p: 0 }
    }

    boroughMap[b].s += isFinite(s) ? s : 0
    boroughMap[b].p += isFinite(p) ? p : 0
  })

  const entries = Object.entries(boroughMap)

  const x = entries.map(([b]) => b)
  const y = entries.map(([_, v]) => v.p > 0 ? v.s / v.p : 0)

  return (
    <Plot
      data={[
        {
          type: "bar", x, y,

          marker: {
            color: "#C94A67",
            line: {
              color: "#9A263F",
              width: 1.5,
            },
          },

          hovertemplate:
            "<b>%{x}</b><br>Services per capita: %{y:.4f}<extra></extra>",
        },
      ]}
      //stylizing graph with colors and fonts
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true }}
      layout={{
        autosize: true,
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",

        margin: { l: 50, r: 20, t: 50, b: 50 },

        title: {
          text: "Service Intensity per Capita by Borough",
          font: { size: 16, color: "#6b6375" },
        },

        xaxis: {
          tickfont: { color: "#6b6375" },
          showgrid: false,
        },

        yaxis: {
          title: { text: "Services per Capita" },
          tickfont: { color: "#6b6375" },
          gridcolor: "#e5e4e7",
          zeroline: false,
        },

        font: {
          family: "Merriweather, Georgia, serif",
          color: "#6b6375",
        },
      }}
    />
  )
}