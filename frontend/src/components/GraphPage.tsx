import { useParams, useNavigate } from "react-router-dom"
import PipelineFunnelChart from "./PipelineFunnelChart"
import ServiceIntensityChart from "./ServiceIntensityChart"
import TopBottomChart from "./TopBottomChart"
import NYCHAMap from "./Map"
import type { NYCHARecord } from "../NYCHASchema"
import { type JSX } from "react"

interface GraphPageProps {
  data: NYCHARecord[]
}

interface GraphConfig {
  title: string
  description: string
  component: (data: NYCHARecord[]) => JSX.Element
  stats?: (data: NYCHARecord[]) => { label: string; value: string | number; suffix?: string}[]
}

const configs: Record<string, GraphConfig> = {
  serviceIntensity: {
    title: "Service Access Inequality",
    description:
      "The weighted number of service connections per capita across boroughs hovers at a low 0.008, indicating that the average NYCHA resident has very limited access to NYCHA-facilitated social services. Additionally, more than 26% of developments have no service coverage at all, reflecting an overall lack of access to social services and/or extremely inactive social service programs that are unable to efficiently serve developments with large populations.",
    component: (data) => <ServiceIntensityChart data={data} />,
    stats: () => {
      return [
        { label: "% of Developments wtih No Services", value: 26.2 },
        { label: "Weighted Services per Capita in Brooklyn", value: 0.014 },
        { label: "Weighted Services per Capita in the Bronx", value: 0.009 },
        { label: "Weighted Services per Capita in Manhattan", value: 0.011 },
        { label: "Weighted Services per Capita in Queens", value: 0.014 },
        { label: "Weighted Services per Capita in Staten Island", value: 0.037 }
      ]
    }
  },

  jobPipeline: {
    title: "Job Pipeline Funnel",
    description: `While 8476 NYCHA residents applied to job training programs, only around 9% were actually accepted into these programs. There is a strong positive correlation between acceptance and placement, and analysis of the weighted conversion rates across boroughs demonstrates that residents in Brooklyn have statistically significant better access to services than residents in other boroughs, yielding a p-value of 0.0001 after running ANOVA. The data also highlights that there are significant differences in conversion rates between boroughs, explained by the fact that the majority of job training programs operate in Brooklyn, which also has the highest population of NYCHA residents. 

      The lack of sufficient application data for certain developments, particularly in Staten Island, indicates that residents in many developments are unable to engage with job training programs. However, those that do have consistently strong outcomes, demonstrated by an overall placement rate of 51.7% across all boroughs. These results indicate that residents have a good chance of getting a job after being accepted into a job training program, emphasizing that access to social services and acceptance capacity for job training programs remain the greatest barriers to economic mobility for NYCHA residents.
    `,
    component: (data) => <PipelineFunnelChart data={data} />,
    stats: () => [
      { label: "Average Placement Rate", value: 51.7, suffix: "%" },
      { label: "Weighted Conversion Rate (Brooklyn)", value: 6.88, suffix: "%"},
      { label: "Weighted Conversion Rate (Bronx)", value: 1.32, suffix: "%" },
      { label: "Weighted Conversion Rate (Manhattan)", value: 2.85, suffix: "%" },
      { label: "Weighted Conversion Rate (Queens)", value: 2.14, suffix: "%" },
      { label: "Weighted Conversion Rate (Staten Island)", value: "No Data" },
    ],
  },

  topBottomDevelopments: {
    title: "10 Best- and Worst-Performing Developments",
    description:
      "The data reveals that a few developments have very concentrated access to services. However, many developments remain underserved, illustrating systemic inequalities in the distribution of social services for NYCHA residents across New York City. The lack of sufficient services such as job training programs thus contributes to a weaker job training pipeline, keeping job placement rates low and decreasing opportunities for economic mobility.",
    component: (data) => <TopBottomChart data={data} />,
  },

  map: {
    title: "Map of Distribution of NYCHA Services",
    description: `The map shows that social services are frequently clustered in boroughs such as Brooklyn, revealing structural inequality in the distribution and implementation of social welfare programs. 

      For instance, Staten Island has a few well-served developments and a low population, explaining its high weighted service connections per capita, but it also has the most uneven distribution of resources. While Brooklyn has the most social welfare programs, its weighted service connections per capita is still very low as a result of its high population, indicating that the number of programs in Brooklyn may still not be enough to sustain all residents. Furthermore, the Bronx and Queens have similar weighted service connections per capita, but the Bronx has a much higher population and more developments, suggesting that resources are thinly spread out across boroughs, causing residents to be chronically underserved. Manhattan has a relatively high weighted service connections per capita, but the borough still struggles to provide adequate access to services for all residents in NYCHA developments. 

      NYCHA’s unstable funding structure certainly plays a role in this uneven distribution. The Trump administration’s recent $33.6 billion federal cuts to HUD funding have put pressure on the budget while personnel costs have been rising, highlighting a lack of sufficient funding for social service programs and development maintenance, which has contributed to poor living conditions within NYCHA facilities. 

      Overall, the map highlights the need for a more equitable distribution of resources across all boroughs to ensure that all NYCHA residents have access to social services, particularly job training programs. These disparities can be explained in part due to a lack of federal funding for social welfare programs and poor management within NYCHA’s bureaucracy. 
    `,
    component: () => <NYCHAMap />,
  },
}

export default function GraphPage({ data }: GraphPageProps) {
  const { id } = useParams()
  const navigate = useNavigate()

  if (!id || !configs[id]) {
    return <p>Chart not found.</p>
  }

  const page = configs[id]

  return (
    <div className="graph-page">
      <button
        onClick={() => navigate("/")}
        className="back-button"
      >
        ← Back to Dashboard
      </button>

      <h2>{page.title}</h2>
      <p className="graph-description">
        {page.description}
      </p>

      {page.stats && (
        <div className="stat-row">
          {page.stats(data).map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">
                {s.value}{s.suffix}
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