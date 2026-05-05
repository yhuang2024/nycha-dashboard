import PlotlyReact from "react-plotly.js"
const Plot = (PlotlyReact as any).default ?? PlotlyReact
import type { NYCHARecord } from "../NYCHASchema"

interface Props {
  data: NYCHARecord[]
}

export default function TopBottom({ data }: Props) {
  const map: Record<string, number> = {}

  data.forEach((d) => {
    const dev = d.development || "Unknown"
    map[dev] = (map[dev] || 0) + (Number(d.servicesPerCapita) || 0)
  })

  const sorted = Object.entries(map).sort((a, b) => a[1] - b[1])

  const bottom10 = sorted.slice(0, 10)
  const top10 = sorted.slice(-10)

  const combined = [...bottom10, ...top10]

  return (
    <Plot
      data={[
        {
          type: "bar",
          orientation: "h",
          x: combined.map((d) => d[1]),
          y: combined.map((d) => d[0]),

          marker: {
            color: combined.map((_, i) =>
              i < 10 ? "#9A263F" : "#C94A67"
            ),
          },
        },
      ]}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true, displayModeBar: false }}
      layout={{
        autosize: true,

        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",

        margin: { l: 140, r: 20, t: 40, b: 40 },

        title: {
          text: "10 Best- and Worst-Performing NYCHA Developments", 
        },

        xaxis: {
          color: "#6b6375",
          gridcolor: "#e5e4e7",
          zeroline: false,
        },

        yaxis: {
          color: "#6b6375",
        },

        font: {
          family: "Spectral, Georgia, serif",
          color: "#6b6375",
        },
      }}
    />
  )
}