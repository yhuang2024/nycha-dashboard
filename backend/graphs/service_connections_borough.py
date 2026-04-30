import pandas as pd
import plotly.express as px
import plotly.io as pio

#render in browser
pio.renderers.default = "browser"
df = pd.read_csv("final_merged_nycha.csv")
print("csv loaded")

#clean data
df.columns = df.columns.str.strip().str.lower()

df["service_connections"] = pd.to_numeric(
    df["service_connections"],
    errors="coerce"
).fillna(0)

df["total_population"] = pd.to_numeric(
    df["total_population"],
    errors="coerce"
).fillna(0)

df["borough"] = df["borough"].str.strip().str.title()

# aggregate by borough
borough_data = (
    df.groupby("borough", as_index=False)
    .agg({
        "service_connections": "sum",
        "total_population": "sum"
    })
)

#metrics per capita
borough_data["service_connections_per_capita"] = (
    borough_data["service_connections"] /
    borough_data["total_population"].replace(0, pd.NA)
)

borough_data["service_connections_per_capita"] = (
    borough_data["service_connections_per_capita"].fillna(0)
)

borough_data = borough_data.sort_values(
    "service_connections_per_capita",
    ascending=False
)

#bar chart of service connections per capita by borough
fig = px.bar(
    borough_data,
    x="borough",
    y="service_connections_per_capita",
    title="NYCHA Service Connections per Capita by Borough",
    labels={
        "borough": "Borough",
        "service_connections_per_capita": "Service Connections per Capita"
    }
)
fig.show()
