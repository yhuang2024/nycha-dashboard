import pandas as pd
import plotly.express as px
import plotly.io as pio

#rendering in browser for now bc dataset is so big
pio.renderers.default = "browser"

df = pd.read_csv("../data/cleaned_nycha.csv")
print("csv loaded")

#prepare data
df["service_connections"] = pd.to_numeric(df["service_connections"]).fillna(0)
borough_data = (
    df.groupby("borough", as_index=False)["service_connections"]
    .sum()
    #sorting highest to lowest for visualizaiton
    .sort_values("service_connections", ascending=False)
)

#building bar chart
fig = px.bar(
    borough_data,
    x="borough",
    y="service_connections",
    title="NYCHA Service Connections by Borough",
    labels={
        "borough": "Borough",
        "service_connections": "Total Service Connections"
    }
)

#render and open interactive chart
fig.show()