import pandas as pd
import plotly.express as px
import plotly.io as pio

pio.renderers.default = "browser"

df = pd.read_csv("../data/final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()

#finding mean services per capita by development
dev_scores = (
    df.groupby("nycha_development", as_index=False)["services_per_capita"]
    .mean()
)

#highest performing and lowest performing developments by number of services per capita
top10 = dev_scores.sort_values("services_per_capita", ascending=False).head(10)
bottom10 = dev_scores.sort_values("services_per_capita", ascending=True).head(10)

#combining and sorting for visualization
combined = pd.concat([top10, bottom10])
combined["group"] = combined["services_per_capita"].apply(
    lambda x: "Top 10" if x >= top10["services_per_capita"].min() else "Bottom 10"
)
combined = combined.sort_values("services_per_capita", ascending=True)

#combined horizontal bar chart of top vs bottom 10 developments by how much service they get
fig = px.bar(
    combined,
    x="services_per_capita",
    y="nycha_development",
    color="group",
    orientation="h",
    title="Top vs Bottom 10 NYCHA Developments by Service Intensity",
    labels={
        "services_per_capita": "Service Intensity per Capita",
        "nycha_development": "NYCHA Development"
    }
)
fig.show()

