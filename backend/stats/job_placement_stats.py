import pandas as pd
import numpy as np
from scipy import stats

#load and clean data
df = pd.read_csv("../data/final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()
df["borough"] = df["borough"].str.strip().str.title()
df["job_placements"] = pd.to_numeric(df["total_number_of_resident_job_placements"] ,errors="coerce")
df["job_applications"] = pd.to_numeric(df["total_number_of_residents_that_applied_for_the_nycha_resident_training_academy"], errors="coerce")

#filtering out zero rows and missing boroughs to ensure valid comparisons
df = df[
    (df["job_applications"] > 0) &
    (df["borough"].notna())
].copy()
df = df[df["job_applications"] >= 5]

#new metrics
df["job_placement_efficiency"] = (df["job_placements"] / df["job_applications"])
df["job_placement_efficiency"] = df["job_placement_efficiency"].replace([np.inf, -np.inf], np.nan)
df = df.dropna(subset=["job_placement_efficiency"])

#capping extreme values to reduce outlier impact
cap = df["job_placement_efficiency"].quantile(0.95)
df["efficiency_capped"] = np.minimum(df["job_placement_efficiency"], cap)

#printing stats out
print("OVERALL EFFICIENCY")
print(df["efficiency_capped"].describe())

#stats by borough
print("BOROUGH MEAN, MEDIAN, STD, COUNT")
borough_stats = df.groupby("borough")["efficiency_capped"].agg(
    ["mean", "median", "std", "count"]
)
print(borough_stats)

#weighted efficiency by borough
print("WEIGHTED EFFICIENCY BY BOROUGH")
weighted = df.groupby("borough").apply(
    lambda g: g["job_placements"].sum() / g["job_applications"].sum()
)
print(weighted.sort_values(ascending=False))

#correlation between applications, placements, and efficiency
print("\n=== CORRELATION ===")
corr = df[["job_applications", "job_placements", "job_placement_efficiency"]].corr()
print(corr)

#linear regression analysis -> more applications = more placements?
#expectation is yes
slope, intercept, r_value, p_value, std_err = stats.linregress(
    df["job_applications"], df["job_placements"]
)
print("APPLICATIONS TO PLACEMENTS REGRESSION ANALYSIS")
print(f"Slope: {slope:.4f}")
print(f"R^2: {r_value**2:.4f}")
print(f"P-value: {p_value:.4f}")

#anova analysis to see if efficiency differs significantly by borough
groups = [
    group["efficiency_capped"].values
    for _, group in df.groupby("borough")
]
f_stat, p_value = stats.f_oneway(*groups)

print("ANOVA")
print(f"F-statistic: {f_stat:.4f}")
print(f"P-value: {p_value:.4f}")

#outliers
Q1 = df["job_placement_efficiency"].quantile(0.25)
Q3 = df["job_placement_efficiency"].quantile(0.75)
IQR = Q3 - Q1
outliers = df[
    df["job_placement_efficiency"] > Q3 + 1.5 * IQR
]

print("OUTLIERS")
print(outliers[[
    "borough",
    "job_applications",
    "job_placements",
    "job_placement_efficiency"
]])

#top and bottom developments by efficiency
print("TOP 5 DEVELOPMENTS")
print(
    df[df["job_applications"] >= 10]
    .nlargest(5, "job_placement_efficiency")[[
        "borough", "job_applications", "job_placements", "job_placement_efficiency"
    ]]
)

print("BOTTOM 5 DEVELOPMENTS")
print(
    df[df["job_applications"] >= 10]
    .nsmallest(5, "job_placement_efficiency")[[
        "borough", "job_applications", "job_placements", "job_placement_efficiency"
    ]]
)