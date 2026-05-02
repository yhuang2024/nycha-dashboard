import pandas as pd
import numpy as np

df = pd.read_csv("data/final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()

#data cleaning
df["average_wage_of_such_residents"] = pd.to_numeric(df["average_wage_of_such_residents"], errors="coerce")
df["job_placements"] = pd.to_numeric(df["total_number_residents_placed_into_full-time_or_part-time_jobs"], errors="coerce")
df["job_applications"] = pd.to_numeric(df["total_number_of_residents_that_applied_for_the_nycha_resident_training_academy"], errors="coerce")
df["service_connections"] = pd.to_numeric(df["service_connections"], errors="coerce")
df["total_population"] = pd.to_numeric(df["total_population"], errors="coerce")

#created metrics
df["job_efficiency"] = df["job_placements"] / df["job_applications"].replace(0, np.nan)
df["job_efficiency"] = df["job_efficiency"].fillna(0)
df["services_per_capita"] = df["service_connections"] / df["total_population"].replace(0, np.nan)
df["services_per_capita"] = df["services_per_capita"].fillna(0)

#normalize by z score
def zscore(col):
    return (col - col.mean()) / col.std()

df["wage_z"] = zscore(df["average_wage_of_such_residents"])
df["job_z"] = zscore(df["job_efficiency"])
df["service_z"] = zscore(df["services_per_capita"])

#opportunity index
df["nycha_opportunity_index"] = (
    0.4 * df["wage_z"] +
    0.3 * df["job_z"] +
    0.3 * df["service_z"]
)

#aggregate by development
dev_index = df.groupby("nycha_development", as_index=False)["nycha_opportunity_index"].mean()

#rank developments
dev_index = dev_index.sort_values("nycha_opportunity_index", ascending=False)

#best and worst developments
print("TOP 10 OPPORTUNITY DEVELOPMENTS")
print(dev_index.head(10))

print("BOTTOM 10 OPPORTUNITY DEVELOPMENTS")
print(dev_index.tail(10))

#borugh comparison
df["borough"] = df["borough"].str.title()
borough_index = df.groupby("borough")["nycha_opportunity_index"].agg([
    "mean", "median", "std", "count"
]).sort_values("mean", ascending=False)

print("BOROUGH OPPORTUNITY INDEX")
print(borough_index)

print("INDEX SUMMARY")
print(df["nycha_opportunity_index"].describe())
