import pandas as pd
import plotly.express as px
import plotly.io as pio

pio.renderers.default = "browser"

df = pd.read_csv("final_merged_nycha.csv")

#cleaning
df.columns = df.columns.str.strip().str.lower()
df["borough"] = df["borough"].str.strip().str.title()
df["job_placements"] = pd.to_numeric(
    df["total_number_of_resident_job_placements"],
    errors="coerce"
).fillna(0)
df["job_applications"] = pd.to_numeric(
    df["total_number_of_residents_that_applied_for_the_nycha_resident_training_academy"],
    errors="coerce"
).fillna(0)

#new metric
#job placement efficiency is how many people get jobs based on how many apply for the training academy (how well is the training academy doing?)
df["job_placement_efficiency"] = (
    df["job_placements"] /
    df["job_applications"].replace(0, pd.NA)
)
df["job_placement_efficiency"] = df["job_placement_efficiency"].fillna(0)

#plotting scatter plot of job applications vs placements colored by borough and sized by efficiency
fig = px.scatter(
    df,
    x="job_applications",
    y="job_placements",
    color="borough",
    size="job_placement_efficiency",
    hover_data=["nycha_development"],
    title="NYCHA Job Placement Efficiency",
    labels={
        "job_applications": "Job Applications",
        "job_placements": "Job Placements"
    }
)
fig.show()

