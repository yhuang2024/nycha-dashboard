import { useParams } from "react-router-dom"
import PipelineFunnelChart from "./PipelineFunnelChart"
import ServiceIntensityChart from "./ServiceIntensityChart"
import TopBottomChart from "./TopBottomChart"
import WageDistributionChart from "./WageDistributionChart"
import type { NYCHARecord } from "../NYCHASchema"
import { type JSX } from "react"

interface GraphPageProps {
  data: NYCHARecord[]
}

export default function GraphPage({ data }: GraphPageProps) {
  const { id } = useParams()
  if (!id) {
    return <p>No chart selected.</p>
  }

  const charts: Record<string, JSX.Element> = {
    serviceConnections: <ServiceIntensityChart data={data} />,
    population: <PipelineFunnelChart data={data} />,
    avgWage: <TopBottomChart data={data} />,
    applied: <WageDistributionChart data={data} />,
  }

  return (
    <div>
      <h2>{id}</h2>
      {charts[id] ?? <p>work in progresssssss</p>}
    </div>
  )
}
