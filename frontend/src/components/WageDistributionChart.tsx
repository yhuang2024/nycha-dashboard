import PlotlyReact from "react-plotly.js"
const Plot = (PlotlyReact as any).default ?? PlotlyReact
import type { NYCHARecord } from "../NYCHASchema"

interface Props {
  data: NYCHARecord[]
}

export default function WageDistribution({ data }: Props) {
  const boroughs = Array.from(new Set(data.map((d) => d.borough)))

  return (
    <Plot
      data={boroughs.map((b) => ({
        type: "box",
        name: b,
        y: data
          .filter((d) => d.borough === b)
          .map((d) => Number(d.avgWage) || 0),
      }))}
      layout={{ title: { text:"Wage Distribution by Borough"} }}
    />
  )
}

console.log("Plot in file =", Plot)