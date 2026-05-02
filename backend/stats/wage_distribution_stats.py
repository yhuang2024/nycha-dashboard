import pandas as pd
import numpy as np
from scipy import stats

#load and clean data
df = pd.read_csv("../data/final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()

df["borough"] = df["borough"].str.strip().str.title()
df["average_wage_of_such_residents"] = pd.to_numeric(df["average_wage_of_such_residents"], errors="coerce")

df = df.dropna(subset=["average_wage_of_such_residents"])
# remove extreme placeholder/invalid values if needed
df = df[df["average_wage_of_such_residents"] > 0]
df = df[df["average_wage_of_such_residents"] <= 100]

wage = df["average_wage_of_such_residents"]

#general stats
print("OVERALL STATISTICS")
print(wage.describe())

print("\nSkewness:", wage.skew())
print("Kurtosis:", wage.kurtosis())

#inequality with gini
def gini(x):
    x = np.sort(x)
    n = len(x)
    cumx = np.cumsum(x)
    return (n + 1 - 2 * np.sum(cumx) / cumx[-1]) / n

print("Gini:", gini(wage.values))

#borough-level analysis
print("BY BOROUGH")
borough_stats = df.groupby("borough")["average_wage_of_such_residents"].agg(["mean", "median", "std", "count"])
print(borough_stats.sort_values("mean", ascending=False))

#anova to analyze differences between boroughs
groups = [
    group["average_wage_of_such_residents"].values
    for _, group in df.groupby("borough")
]

f_stat, p_val = stats.f_oneway(*groups)

print("ANOVA")
print(f"F-statistic: {f_stat:.4f}")
print(f"P-value: {p_val:.6f}")

#outliers
print("TOP 10 HIGHEST DEVELOPMENTS BY WAGE")
print(
    df.nlargest(10, "average_wage_of_such_residents")[
        ["borough", "average_wage_of_such_residents"]
    ]
)

print("BOTTOM 10 LOWEST DEVELOPMENTS BY WAGE")
print(
    df.nsmallest(10, "average_wage_of_such_residents")[
        ["borough", "average_wage_of_such_residents"]
    ]
)