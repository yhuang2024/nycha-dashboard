import type { NYCHARecord } from "../NYCHASchema"
import ServiceIntensityChart from "./ServiceIntensityChart"
import PipelineFunnelChart from "./PipelineFunnelChart"
import TopBottomChart from "./TopBottomChart"
import NYCHAMap from "./Map"
import { Link } from "react-router-dom"

export default function Dashboard({ data }: { data: NYCHARecord[] }) {
  return (
    <div className="dashboard-grid">
      <Link to="/graph/nychaMap" className="chart-card">
        <div className="chart-title">NYCHA Developments Map</div>
        <NYCHAMap />
      </Link>

      <Link to="/graph/serviceIntensity" className="chart-card">
        <div className="chart-title">Inequality in Service Access</div>
        <ServiceIntensityChart data={data} />
      </Link>

      <Link to="/graph/topBottomDevelopments" className="chart-card">
        <div className="chart-title">Top 10 Best and Worst-Performing Developments</div>
        <TopBottomChart data={data} />
      </Link>

      <Link to="/graph/jobPipeline" className="chart-card">
        <div className="chart-title">Inequality in Economic Mobility Outcomes</div>
        <PipelineFunnelChart data={data} />
      </Link>
    </div>
  )
}
