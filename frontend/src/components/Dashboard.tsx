import type { NYCHARecord } from "../NYCHASchema"
import ServiceIntensityChart from "./ServiceIntensityChart"
import WageDistributionChart from "./WageDistributionChart"
import PipelineFunnelChart from "./PipelineFunnelChart"
import TopBottomChart from "./TopBottomChart"

export default function Dashboard({ data }: { data: NYCHARecord[] }) {
  return (
    <div>
      <ServiceIntensityChart data={data} />
      <WageDistributionChart data={data} />
      <PipelineFunnelChart data={data} />
      <TopBottomChart data={data} />
    </div>
  )
}
