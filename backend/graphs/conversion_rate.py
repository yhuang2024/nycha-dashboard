import pandas as pd
import plotly.express as px
import plotly.io as pio

pio.renderers.default = "browser"

df = pd.read_csv("../data/final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()

#finding conversion rate of job placements to applications for each borough
df["conversion_rate"] = (
    df["total_number_residents_placed_into_full-time_or_part-time_jobs"] /
    df["total_number_of_residents_that_applied_for_the_nycha_resident_training_academy"].replace(0, pd.NA)
)
df["conversion_rate"] = df["conversion_rate"].fillna(0)
borough_conv = df.groupby("borough", as_index=False)["conversion_rate"].mean()

#bar chart of conversion rate by borough
fig = px.bar(
    borough_conv,
    x="borough",
    y="conversion_rate",
    title="NYCHA Job Conversion Rate by Borough"
)
fig.show()

