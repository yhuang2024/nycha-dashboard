import pandas as pd
import plotly.express as px

# load data
df = pd.read_csv("../data/final_merged_nycha.csv")

#cleaning
df.columns = df.columns.str.strip().str.lower()
df["service_connections"] = pd.to_numeric(df["service_connections"], errors="coerce").fillna(0)
df["total_population"] = pd.to_numeric(df["total_population"], errors="coerce").fillna(0)

df["borough"] = df["borough"].str.strip().str.title()

#borough-level data
borough_data = (
    df.groupby("borough", as_index=False)
    .agg({
        "service_connections": "sum",
        "total_population": "sum"
    })
)

#relative advantage
borough_data["service_intensity_total"] = (
    borough_data["service_intensity_per_capita"] -
    borough_data["service_intensity_per_capita"].mean()
) / borough_data["service_intensity_per_capita"].std()

#cool map whoa
#shows service intensity per capita by borough visualized over a map of NYC
fig = px.choropleth_mapbox(
    borough_data,
    geojson="https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/new-york-city-boroughs.geojson",
    locations="borough",
    featureidkey="properties.name",
    color="service_intensity_per_capita",
    color_continuous_scale="RdBu",
    mapbox_style="carto-positron",
    zoom=9.5,
    center={"lat": 40.7128, "lon": -74.0060},
    opacity=0.7,
    title="NYCHA Service Intensity per Capita by Borough",
    hover_data={
        "service_connections": True,
        "total_population": True,
        "service_intensity_per_capita": ":.4f"
    }
)
fig.update_coloraxes(cmid=0)
fig.show()

