import pandas as pd
import plotly.express as px
import plotly.io as pio

pio.renderers.default = "browser"

df = pd.read_csv("final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()

#pipeline stages
applied = df["total_number_of_residents_that_applied_for_the_nycha_resident_training_academy"].sum()
accepted = df["total_number_of_residents_that_were_accepted_and_enrolled"].sum()
placed = df["total_number_residents_placed_into_full-time_or_part-time_jobs"].sum()

#funnel chart
funnel_df = pd.DataFrame({
    "stage": ["Applied", "Accepted/Enrolled", "Job Placement"],
    "count": [applied, accepted, placed]
})

#actual plotting
#shows dropoff at each stage of resident training pipeline
fig = px.funnel(
    funnel_df,
    x="count",
    y="stage",
    title="NYCHA Resident Training Pipeline Effectiveness"
)
fig.show()

