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
  analysis?: (data: NYCHARecord[]) => string
}

const sum = (data: NYCHARecord[], key: keyof NYCHARecord) =>
  data.reduce((acc, d) => acc + (Number(d[key]) || 0), 0)

const configs: Record<string, GraphConfig> = {
  serviceIntensity: {
    title: "Service Access Inequality",
    description:
      "Access to social services varies significantly across NYCHA developments.",
    component: (data) => <ServiceIntensityChart data={data} />,
    stats: (data) => {
      const totalServices = sum(data, "serviceConnections")
      const totalPop = sum(data, "population")

      return [
        { label: "Total Service Connections", value: totalServices },
        { label: "Total Population", value: totalPop },
        { label: "Weighted Services per Capita in Brooklyn", value: "0.014" },
        { label: "Weighted Services per Capita in the Bronx", value: "0.009" },
        { label: "Weighted Services per Capita in Manhattan", value: "0.011" },
        { label: "Weighted Services per Capita in Queens", value: "0.014" },
        { label: "Weighted Services per Capita in Staten Island", value: "0.037" },
        { label: "% of Developments wtih No Services", value: "26.2" }
      ]
    },

    analysis: () =>
      "Service access across NYCHA is highly unequal. The weighted number of service connections per capita across boroughs is very low, indicating that the average NYCHA resident has limited access to services. Additionally, almost 1 in 4 developments have no service coverage at all, reflecting a lack of access/extremely inactive programs across the board. While larger developments receive more services, this does not scale proportionally with population, leaving many residents underserved. Therefore, inequality is driven primarily by lack of access rather than variation in service quality.",
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
      { label: "Weighted Conversion Rate (Brooklyn)", value: "6.88%" },
      { label: "Weighted Conversion Rate (Bronx)", value: "1.32%" },
      { label: "Weighted Conversion Rate (Manhattan)", value: "2.85%" },
      { label: "Weighted Conversion Rate (Queens)", value: "2.14%" },
      { label: "Weighted Conversion Rate (Staten Island)", value: "Very little data." },
      { label: "Average Placement Rate", value: "51.7%" },
    ],

    analysis: () =>
      "The job pipeline funnel reveals that while a significant number of NYCHA residents apply to job training programs, very few actually get accepted into these programs. This data suggests that the primary barrier to employment is not job placement but rather access to training programs. There is a strong positive correlation between acceptance and placement, and the weighted conversion rates across boroughs indicate that residents in Brooklyn have relatively better access compared to other boroughs, yielding a p-value of 0.0001 after running ANOVA, highlighting that there are significant differences in conversion rates between boroughs. This pattern can be explained by the fact that the majority of job training programs operate in Brooklyn, which also has the highest population of NYCHA residents. The lack of sufficient application data for certain developments indicates that residents in many developments are unable to engage with job training programs, but those that do have consistently strong outcomes, as demonstrated by an overall placement rate of 51.7% for those accepted into job training programs for all boroughs. This result indicates that residents have a good chance of getting a job after being accepted into a job training program, emphasizing that access to social services and acceptance capacity for job training programs remain the greatest barriers to economic mobility for NYCHA residents.",
  },

  topBottomDevelopments: {
    title: "10 Best and Worst-Performing Developments",
    description:
      "Opportunity is concentrated in a small subset of developments, while many remain under-resourced, illustrating systemic issues in service distribution across the city. Low service access leads to a weaker job training pipeline, due to a lack of sufficient job training programs, leading to fewer job placements and decreased access to economic mobility opportunities.",
    component: (data) => <TopBottomChart data={data} />,
  },

  map: {
    title: "Map of Distribution of NYCHA Services",
    description:
      "The clustering of services in boroughs such as Brooklyn reveals structural inequality in the implementation of social services across NYC. For instance, Staten Island has a few well-served developments and a low population, explaining its high weighted service connections per capita, but it actually has the most uneven distribution of resources. Brooklyn has the highest population and the most services, but its weighted service connections per capita is still very low, indicating that even in the best-served boroughs, access to services is limited. The Bronx and Queens have similar weighted service connections per capita, but the Bronx has a much higher population and more developments, suggesting that resources are more thinly spread across a larger number of residents and developments. Manhattan has a relatively high weighted service connections per capita compared to its population size, but it still faces significant challenges in providing adequate access to services for all residents. Overall, the map highlights the need for a more equitable distribution of resources across all boroughs to ensure that all NYCHA residents have access to social services, particularly job training programs.",
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