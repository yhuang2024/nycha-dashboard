import type { NYCHARecord } from "../NYCHASchema"
import ServiceIntensityChart from "./ServiceIntensityChart"
import PipelineFunnelChart from "./PipelineFunnelChart"
import TopBottomChart from "./TopBottomChart"
import NYCHAMap from "./Map"
import { Link } from "react-router-dom"

//dashboard that renders each data visualization on main page with links to the full pages with statistics and descriptions embedded
export default function Dashboard({ data }: { data: NYCHARecord[] }) {
  return (
    <div className="dashboard-grid">
      {/* development map card */}
      <Link to="/graph/map" className="chart-card">
        <div className="chart-title">Map of NYCHA Developments and Social Service Providers</div>
        <NYCHAMap />
      </Link>

      {/* service connections graph card */}
      <Link to="/graph/serviceIntensity" className="chart-card">
        <div className="chart-title">Inequality in Service Access</div>
        <ServiceIntensityChart data={data} />
      </Link>

      {/* development performance graph card */}
      <Link to="/graph/topBottomDevelopments" className="chart-card">
        <div className="chart-title">Top 10 Best and Worst-Performing Developments</div>
        <TopBottomChart data={data} />
      </Link>

      {/* job pipeline graph card */}
      <Link to="/graph/jobPipeline" className="chart-card">
        <div className="chart-title">Inequality in Economic Mobility Outcomes</div>
        <PipelineFunnelChart data={data} />
      </Link>
    </div>
  )
}
