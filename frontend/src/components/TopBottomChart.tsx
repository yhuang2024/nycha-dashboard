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
        },
      ]}
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      config={{ responsive: true, displayModeBar: false }}
      layout={{
        autosize: true,
        margin: { l: 120, r: 20, t: 50, b: 40 },
        title: { text: "Top vs Bottom NYCHA Developments" },
      }}
    />
  )
}