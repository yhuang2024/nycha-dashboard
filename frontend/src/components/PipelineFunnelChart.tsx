import PlotlyReact from "react-plotly.js"
const Plot = (PlotlyReact as any).default ?? PlotlyReact
import type { NYCHARecord } from "../NYCHASchema"

interface Props {
  data: NYCHARecord[]
}

export default function PipelineFunnel({ data }: Props) {
  const sum = (key: keyof NYCHARecord) =>
    data.reduce((acc, d) => acc + (Number(d[key]) || 0), 0)

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Plot
        data={[
          {
            type: "funnel",
            y: ["Applied", "Accepted", "Placed"],
            x: [sum("applied"), sum("accepted"), sum("placed")],
          },
        ]}
        layout={{
          title: { text: "NYCHA Training Pipeline", x: 0.5 },
          autosize: true,
          margin: { l: 40, r: 20, t: 40, b: 40 },
        }}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
        config={{ responsive: true }}
      />
    </div>
  )
}