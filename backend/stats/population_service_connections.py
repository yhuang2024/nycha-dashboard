import pandas as pd
import numpy as np
from scipy import stats

#load and clean data
df = pd.read_csv("../data/final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()

df["service_connections"] = pd.to_numeric(df["service_connections"], errors="coerce")
df["total_population"] = pd.to_numeric(df["total_population"], errors="coerce")
df = df.dropna(subset=["service_connections", "total_population"])
df = df[df["total_population"] > 0]

#calculate services per capita
df["services_per_capita"] = df["service_connections"] / df["total_population"]

# cap extreme outliers
df["services_per_capita"] = df["services_per_capita"].clip(upper=1)

#stats description
print("OVERALL STATISTICS")
print(df[["service_connections", "total_population", "services_per_capita"]].describe())

#correlation
print("CORRELATION")
corr = df[["total_population", "service_connections", "services_per_capita"]].corr()
print(corr)

#linear regression --> higher population = higher service connections?
slope, intercept, r_value, p_value, std_err = stats.linregress(
    df["total_population"], df["service_connections"]
)

print("POPULATION VS SERVICE CONNECTIONS LINEAR REGRESSION")
print(f"Slope: {slope:.4f}")
print(f"Intercept: {intercept:.2f}")
print(f"R^2: {r_value**2:.4f}")
print(f"P-value: {p_value:.4f}")

#borough-level analysis
print("MEAN, MEDIAN, STD, COUNT OF SERVICE PER CAPITA BY BOROUGH")
borough_stats = df.groupby("borough")["services_per_capita"].agg(
    ["mean", "median", "std", "count"]
)
print(borough_stats)

#weighted services per capita
print("WEIGHTED SERVICES PER CAPITA BY BOROUGH")
weighted = df.groupby("borough").apply(
    lambda x: x["service_connections"].sum() / x["total_population"].sum()
)
print(weighted)

#anova to analyze differences between boroughs
groups = [
    group["services_per_capita"].values
    for _, group in df.groupby("borough")
]

f_stat, p_value = stats.f_oneway(*groups)

print("ANOVA")
print(f"F-statistic: {f_stat:.4f}")
print(f"P-value: {p_value:.4f}")

#outlier detection
Q1 = df["services_per_capita"].quantile(0.25)
Q3 = df["services_per_capita"].quantile(0.75)
IQR = Q3 - Q1

outliers = df[
    (df["services_per_capita"] < Q1 - 1.5 * IQR) |
    (df["services_per_capita"] > Q3 + 1.5 * IQR)
]

print("OUTLIERS")
print(outliers[["borough", "total_population", "service_connections", "services_per_capita"]])

#top and bottom developments by services per capita
print("TOP 5 SERVED DEVELOPMENTS")
print(df.nlargest(5, "services_per_capita")[[
    "borough", "total_population", "service_connections", "services_per_capita"
]])

print("BOTTOM 5 SERVED DEVELOPMENTS")
print(df.nsmallest(5, "services_per_capita")[[
    "borough", "total_population", "service_connections", "services_per_capita"
]])