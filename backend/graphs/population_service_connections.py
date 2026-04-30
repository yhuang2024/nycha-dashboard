import pandas as pd
import plotly.express as px
import plotly.io as pio

pio.renderers.default = "browser"

df = pd.read_csv("final_merged_nycha.csv")

#cleaning
df.columns = df.columns.str.strip().str.lower()
df["service_connections"] = pd.to_numeric(df["service_connections"], errors="coerce").fillna(0)
df["total_population"] = pd.to_numeric(df["total_population"], errors="coerce").fillna(0)

#scatter plot of population vs service connections
fig = px.scatter(
    df,
    x="total_population",
    y="service_connections",
    color="borough",
    title="NYCHA Population vs Service Connections"
)
fig.show()

