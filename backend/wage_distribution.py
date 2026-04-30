import pandas as pd
import plotly.express as px
import plotly.io as pio

pio.renderers.default = "browser"

df = pd.read_csv("final_merged_nycha.csv")

#cleaning
df.columns = df.columns.str.strip().str.lower()
df["borough"] = df["borough"].str.strip().str.title()
df["average_wage_of_such_residents"] = pd.to_numeric(
    df["average_wage_of_such_residents"],
    errors="coerce"
)
df = df.dropna(subset=["average_wage_of_such_residents"])

#box plot of wage distribution by borough
fig = px.box(
    df,
    x="borough",
    y="average_wage_of_such_residents",
    title="NYCHA Wage Distribution by Borough",
    labels={
        "borough": "Borough",
        "average_wage_of_such_residents": "Average Wage ($)"
    },
    points="outliers"
)
fig.show()

