# NYCHA Data Dashboard
*URBN 1250 Final Project*

This project visualizes a digital data dashboard of the New York City Housing Authority's connections between public housing developments and access to social services. As the United States is a delegated welfare state, organizations such as NYCHA play a crucial role in the distribution of social services; however, as demonstrated through my analysis, the effectiveness of NYCHA's outreach falls short, particularly in neighborhoods such as the Bronx (“Community Services Programs”). Larger neighborhoods do not necessarily correspond with greater access to social services, and the effectiveness of job development programs in particular is questionable. As such, NYCHA's social services are not only distributed unevenly across developments, but are also frequently underutilized, demonstrating that one major limitation of the delegated welfare state in New York City is its inability to equitably distribute effective resources where they are needed the most as a result of chronic underfunding by the federal government.

The statistical analysis reveals that inequality across NYCHA developments is driven primarily by access to services and program participation. Service availability is uneven across the system, as 26.2% of developments have little to no service access. In addition, while larger developments on the whole receive more services, services are not scaled proportionally to population, so many residents remain underserved (“NYCHA Public Housing Developments”). 

Similarly, the results in NYCHA’s resident job training pipeline highlight that very few residents are applying for or getting accepted in job training academies, most likely due to the fact that residents in many developments do not have easy access to NYCHA job training opportunities (“Resident Economic Empowerment and Sustainability (REES) for NYCHA Residents”). However, outcomes for those who participate in the job training academy are relatively strong, with a 51.7% job placement rate across boroughs. 

There are some borough-level differences, particularly between Brooklyn (with strong job placement rates and widespread access to services) and the Bronx (with a weaker job pipeline and more sparse access to services) (Community Service Society of New York). However, the analysis shows that these differences are primarily driven by a small number of high-performing developments rather than a broader systemic failure or advantage. A composite opportunity index measure was developed to highlight this pattern, demonstrating that opportunity is highly concentrated in a small subset of developments, while many other developments have a low opportunity index as a result of a lack of access to services rather than the poor performance of those services.

Overall, the findings suggest that expanding access, outreach, and program capacity rather than improving program quality alone will have the greatest impact on reducing inequality and improving economic mobility for NYCHA residents. The analysis also highlights that a key limitation of delegated governance is the uneven distribution of resources among residents, resulting in a fragmented system where access to social services depends largely on local “street-level” implementation rather than city-wide policy efforts. Therefore, NYCHA’s failure to provide all residents with adequate access to social services demonstrates that a delegated welfare state can actually exacerbate inequality by limiting the state’s ability to deliver welfare equitably across areas, particularly in a chronically underfunded and uncoordinated environment such as NYCHA (Ferré-Sadurní).

## Organization

This project was developed in Python (backend, data collection and analysis, modelling), TypeScript with React (frontend, data visualization, animations, UI), and a dash of HTML/CSS.

The `backend` folder contains the raw Plotly graphs and data analysis scripts for the data dashboard and the custom CSV parser used to extract and parse data from publically available NYCHA datasets. All statistics can be reviewed by navigating to `backend/stats` and running `python3 [NAME OF FILE].py`. 

## Datasets Used

“NYCHA Development Data Book.” NYC Open Data, 18 Aug. 2025, [data.cityofnewyork.us/Housing-Development/NYCHA-Development-Data-Book/evjd-dqpz/about_data](https://data.cityofnewyork.us/Housing-Development/NYCHA-Development-Data-Book/evjd-dqpz/about_data).

“NYCHA Public Housing Developments.” NYC Open Data, 10 Feb. 2026, [data.cityofnewyork.us/Housing-Development/NYCHA-Public-Housing-Developments/phvi-damg/about_data](https://data.cityofnewyork.us/Housing-Development/NYCHA-Public-Housing-Developments/phvi-damg/about_data).

“NYCHA Resident Data Book Summary.” NYC Open Data, 1 Aug. 2025, [data.cityofnewyork.us/Housing-Development/NYCHA-Resident-Data-Book-Summary/5r5y-pvs3/about_data](https://data.cityofnewyork.us/Housing-Development/NYCHA-Resident-Data-Book-Summary/5r5y-pvs3/about_data).

“Resident Economic Empowerment and Sustainability (REES) for NYCHA Residents.” NYC Open Data, 28 Oct. 2025, [data.cityofnewyork.us/Social-Services/Resident-Economic-Empowerment-and-Sustainability-R/dggd-3jfu/about_data](https://data.cityofnewyork.us/Social-Services/Resident-Economic-Empowerment-and-Sustainability-R/dggd-3jfu/about_data).

“Resident Services, Partnerships, and Initiatives Map.” New York City Housing Authority, [nycha.maps.arcgis.com/apps/webappviewer/index.html?id=5444a5413b2d4b84831d37553609619f](https://nycha.maps.arcgis.com/apps/webappviewer/index.html?id=5444a5413b2d4b84831d37553609619f).

## Text Bibliography

Burney, David. “What Happened to New York City Public Housing, and How Can We Fix It?” Common Edge, 4 Apr. 2024, [commonedge.org/what-happened-to-new-york-city-public-housing-and-how-can-we-fix-it](https://commonedge.org/what-happened-to-new-york-city-public-housing-and-how-can-we-fix-it/).

Community Service Society of New York. “New CSS Report: ‘A Call to Action,’ Highlights Persistent Hardships as the Bronx Recovers Slower Than the City Overall.” Community Service Society of New York, 27 June 2024, www.cssny.org/news/entry/new-css-report-a-call-to-action-highlights-persistent-hardships-as-the-bron.

“Community Services Programs.” BronxWorks, 7 July 2025, [bronxworks.org/our-services/workforce-development/community-services-programs](http://bronxworks.org/our-services/workforce-development/community-services-programs).

Dagen Bloom, Nicholas, and Matthew Gordon Lasner, editors. Affordable Housing in New York: The People, Places, and Policies That Transformed a City. Princeton UP, 2019.

Ferré-Sadurní, Luis. “The Rise and Fall of New York Public Housing: An Oral History.” The New York Times, 27 July 2018, www.nytimes.com/interactive/2018/06/25/nyregion/new-york-city-public-housing-history.html.

New York City Housing Authority. NYCHA Fact Sheet 2025. Jan. 2025, www.nyc.gov/assets/nycha/downloads/pdf/NYCHA_Fact_Sheet.pdf.
“Public Housing/Section 8.” Coalition for the Homeless, 31 July 2025, www.coalitionforthehomeless.org/get-help/im-in-need-of-housing/public-housing-section-8.

“Section 8 Housing Choice Voucher (HCV) Program.” New York State Homes and Community Renewal, July 2024, hcr.ny.gov/hcv.
Turner, Tatyana. “NYCHA’s RAD/PACT and Preservation Trust Plans, Explained.” City Limits, 15 Aug. 2023, [citylimits.org/nychas-rad-pact-and-preservation-trust-plans-explained](https://citylimits.org/nychas-rad-pact-and-preservation-trust-plans-explained/).

## Acknowledgments

Thank you to Professor Pacewicz for being such a great professor this semester! I loved URBN 1250 and am so excited that I was able to bring this project to life. Special thanks to Ava Stryker-Robbins and Jason Fu for being such great collaborators on our final presentation on the origins, history, and background behind NYCHA's deterioration.
