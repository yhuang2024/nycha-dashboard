import { useState } from "react"
import type { NYCHARecord } from "../NYCHASchema"
import ServiceIntensity from "./ServiceIntensityChart"
import WageDistribution from "./WageDistributionChart"
import PipelineFunnel from "./PipelineFunnelChart"
import TopBottom from "./TopBottomChart"

interface Props {
  data: NYCHARecord[]
}

export default function Tabs({ data }: Props) {
  const [tab, setTab] = useState<"inequality" | "mobility" | "pipeline" | "geo">(
    "inequality"
  )

  return (
    <div>
      <div style={{ display: "flex", gap: 10 }}>
        <button onClick={() => setTab("inequality")}>Inequality</button>
        <button onClick={() => setTab("mobility")}>Mobility</button>
        <button onClick={() => setTab("pipeline")}>Pipeline</button>
        <button onClick={() => setTab("geo")}>Geography</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {tab === "inequality" && <ServiceIntensity data={data} />}
        {tab === "mobility" && <WageDistribution data={data} />}
        {tab === "pipeline" && <PipelineFunnel data={data} />}
        {tab === "geo" && <TopBottom data={data} />}
      </div>
    </div>
  )
}
