import pandas as pd
import numpy as np
from scipy import stats

#load and clean data
df = pd.read_csv("../data/final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()

applied_col = "total_number_of_residents_that_applied_for_the_nycha_resident_training_academy"
placed_col = "total_number_residents_placed_into_full-time_or_part-time_jobs"
df[applied_col] = pd.to_numeric(df[applied_col], errors="coerce")
df[placed_col] = pd.to_numeric(df[placed_col], errors="coerce")

# remove zero/missing applications and missing boroughs to ensure valid comparisons
df = df[(df[applied_col] > 0) & (df["borough"].notna())].copy()

#more data cleaning for new metric
df["conversion_rate"] = df[placed_col] / df[applied_col]
df["conversion_rate"] = df["conversion_rate"].replace([np.inf, -np.inf], np.nan)
df = df.dropna(subset=["conversion_rate"])

#cap at 95th percentile to reduce outlier impact
upper_cap = df["conversion_rate"].quantile(0.95)
df["conversion_rate_capped"] = np.minimum(df["conversion_rate"], upper_cap)

#printing for analysis
print("OVERALL STATISTICS")
print(df["conversion_rate_capped"].describe())

print("BY BOROUGH")
borough_stats = df.groupby("borough")["conversion_rate_capped"].agg(["mean", "median", "std", "count"])
print(borough_stats)

print("WEIGHTED CONVERSION RATE BY BOROUGH")
weighted = df.groupby("borough").apply(lambda g: g[placed_col].sum() / g[applied_col].sum())
print(weighted.sort_values(ascending=False))

#find outliers using IQR
Q1 = df["conversion_rate"].quantile(0.25)
Q3 = df["conversion_rate"].quantile(0.75)
IQR = Q3 - Q1

outliers = df[(df["conversion_rate"] > Q3 + 1.5 * IQR)]
print(outliers[["borough", applied_col, placed_col, "conversion_rate"]])

#conduct anova analysis
print("ANOVA")
groups = [
    group["conversion_rate_capped"].values
    for _, group in df.groupby("borough")
]

f_stat, p_value = stats.f_oneway(*groups)
print(f"F-statistic: {f_stat:.4f}")
print(f"P-value: {p_value:.4f}")

#analyze correlation
print("CORRELATION")
corr = df[[applied_col, placed_col, "conversion_rate"]].corr()
print(corr)

#which boroughs have the most applications? which ones have the least?
print("\n=== TOP 5 (MIN 10 APPLICATIONS) ===")
print(df[df[applied_col] >= 10].nlargest(5, "conversion_rate")[["borough", applied_col, placed_col, "conversion_rate"]])

print("\n=== BOTTOM 5 (MIN 10 APPLICATIONS) ===")
print(df[df[applied_col] >= 10].nsmallest(5, "conversion_rate")[["borough", applied_col, placed_col, "conversion_rate"]])
