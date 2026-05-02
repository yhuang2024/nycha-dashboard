import pandas as pd
import numpy as np
from scipy import stats

#load and clean data
df = pd.read_csv("../data/final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()

df["nycha_development"] = df["nycha_development"].str.strip()
df["borough"] = df["borough"].str.strip().str.title()
df["service_connections"] = pd.to_numeric(df["service_connections"], errors="coerce")
df["total_population"] = pd.to_numeric(df["total_population"], errors="coerce")

df = df.dropna(subset=["nycha_development", "service_connections", "total_population"])
df = df[df["total_population"] > 0]
df = df[df["service_connections"] >= 0]

#services per capita metric
df["services_per_capita"] = df["service_connections"] / df["total_population"]

# remove some extreme noise
df = df[df["total_population"] >= 50]
df["services_per_capita"] = df["services_per_capita"].clip(upper=0.1)

#aggregate by development to analyze inequality at development level
dev_stats = df.groupby("nycha_development").agg({
    "service_connections": "sum",
    "total_population": "sum"
}).reset_index()

dev_stats["services_per_capita"] = (
    dev_stats["service_connections"] / dev_stats["total_population"]
)

#stats description
print("DEVELOPMENT-LEVEL STATISTICS")
print(dev_stats["services_per_capita"].describe())

print("\n% of developments with zero services:")
print((dev_stats["service_connections"] == 0).mean())

#measure of inequality
def gini(x):
    x = np.sort(x)
    n = len(x)
    return (np.sum((2 * np.arange(1, n + 1) - n - 1) * x)) / (n * np.sum(x) + 1e-9)

print("INEQUALITY ANALYSIS")
print(f"Gini: {gini(dev_stats['services_per_capita']):.4f}")

#best and worst performing developments by services per capita
print("TOP 10 DEVELOPMENTS")
print(dev_stats.nlargest(10, "services_per_capita"))

print("BOTTOM 10 DEVELOPMENTS")
print(dev_stats.nsmallest(10, "services_per_capita"))

#outliers
Q1 = dev_stats["services_per_capita"].quantile(0.25)
Q3 = dev_stats["services_per_capita"].quantile(0.75)
IQR = Q3 - Q1

outliers = dev_stats[
    (dev_stats["services_per_capita"] > Q3 + 1.5 * IQR) |
    (dev_stats["services_per_capita"] < Q1 - 1.5 * IQR)
]

print("OUTLIERS")
print(outliers)

#variance analysis by borough
borough_map = (
    df.groupby("nycha_development")["borough"]
    .agg(lambda x: x.mode().iloc[0] if len(x.mode()) > 0 else np.nan)
)

dev_stats = dev_stats.merge(
    borough_map,
    on="nycha_development",
    how="left"
)

groups = [
    group["services_per_capita"].values
    for name, group in dev_stats.groupby("borough")
]

f_stat, p_val = stats.f_oneway(*groups)

print("ANOVA")
print(f"F-statistic: {f_stat:.4f}")
print(f"P-value: {p_val:.4f}")

#how much of services are concentrated in the top 10% of developments
dev_sorted = dev_stats.sort_values("services_per_capita", ascending=False)
top_10pct = int(0.1 * len(dev_sorted))
share_top10 = (
    dev_sorted.head(top_10pct)["service_connections"].sum() /
    dev_sorted["service_connections"].sum()
)

print("CONCENTRATION")
print(f"Top 10% of developments account for {share_top10:.2%} of services")