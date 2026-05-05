import { useParams } from "react-router-dom"
import PipelineFunnelChart from "./PipelineFunnelChart"
import ServiceIntensityChart from "./ServiceIntensityChart"
import TopBottomChart from "./TopBottomChart"
import NYCHAMap from "./Map"
import type { NYCHARecord } from "../NYCHASchema"
import { type JSX } from "react"
import { AnimatedNumber } from "./animations"

interface GraphPageProps {
  data: NYCHARecord[]
}

interface GraphConfig {
  title: string
  description: string
  component: (data: NYCHARecord[]) => JSX.Element
  stats?: (data: NYCHARecord[]) => { label: string; value: string | number }[]
}

const sum = (data: NYCHARecord[], key: keyof NYCHARecord) =>
  data.reduce((acc, d) => acc + (Number(d[key]) || 0), 0)

const configs: Record<string, GraphConfig> = {
  serviceIntensity: {
    title: "Service Access Inequality",
    description:
      "Access to social services varies significantly across NYCHA developments.",
    component: (data) => <ServiceIntensityChart data={data} />,
    stats: (data) => [
      {
        label: "Total Service Connections",
        value: sum(data, "serviceConnections"),
      },
      {
        label: "Total Population",
        value: sum(data, "population"),
      },
    ],
  },

  jobPipeline: {
    title: "Job Pipeline Funnel",
    description:
      "NYCHA residents face barriers to job training program entry, not job placement, suggesting external barriers to access.",
    component: (data) => <PipelineFunnelChart data={data} />,
    stats: (data) => [
      { label: "Applied", value: sum(data, "applied") },
      { label: "Accepted", value: sum(data, "accepted") },
      { label: "Placed", value: sum(data, "placed") },
    ],
  },

  topBottomDevelopments: {
    title: "10 Best and Worst-Performing Developments",
    description:
      "Opportunity is concentrated in a small subset of developments, while many remain under-resourced.",
    component: (data) => <TopBottomChart data={data} />,
  },

  map: {
    title: "Map of Distribution of NYCHA Services",
    description:
      "The clustering of services in boroughs such as Brooklyn reveals structural inequality in the implementation of social services across NYC.",
    component: () => <NYCHAMap />,
  },
}

export default function GraphPage({ data }: GraphPageProps) {
  const { id } = useParams()

  if (!id || !configs[id]) {
    return <p>Chart not found.</p>
  }

  const page = configs[id]

  return (
    <div className="graph-page">
      <h2>{page.title}</h2>

      <p className="graph-description">{page.description}</p>

      {page.stats && (
        <div className="stat-row">
          {page.stats(data).map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">
                <AnimatedNumber value={Number(s.value)} duration={2} />
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="graph-container">
        {page.component(data)}
      </div>
    </div>
  )
}