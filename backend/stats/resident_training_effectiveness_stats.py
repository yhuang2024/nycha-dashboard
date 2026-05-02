import pandas as pd
import numpy as np
from scipy import stats

#load and clean data
df = pd.read_csv("../data/final_merged_nycha.csv")
df.columns = df.columns.str.strip().str.lower()

applied_col = "total_number_of_residents_that_applied_for_the_nycha_resident_training_academy"
accepted_col = "total_number_of_residents_that_were_accepted_and_enrolled"
placed_col = "total_number_residents_placed_into_full-time_or_part-time_jobs"

for col in [applied_col, accepted_col, placed_col]:
    df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0)

#pipeline numbers
applied = df[applied_col].sum()
accepted = df[accepted_col].sum()
placed = df[placed_col].sum()

print("PIPELINE")
print(f"Applied: {applied}")
print(f"Accepted: {accepted}")
print(f"Placed: {placed}")

#conversion rates
apply_to_accept = accepted / applied if applied > 0 else 0
accept_to_place = placed / accepted if accepted > 0 else 0
apply_to_place = placed / applied if applied > 0 else 0

print("CONVERSION RATES")
print(f"Apply to Accept: {apply_to_accept:.4f}")
print(f"Accept to Place: {accept_to_place:.4f}")
print(f"Apply to Place: {apply_to_place:.4f}")

df["apply_to_accept"] = df[accepted_col] / df[applied_col].replace(0, np.nan)
df["accept_to_place"] = df[placed_col] / df[accepted_col].replace(0, np.nan)
df["apply_to_place"] = df[placed_col] / df[applied_col].replace(0, np.nan)

#clean invalid values
for col in ["apply_to_accept", "accept_to_place", "apply_to_place"]:
    df[col] = df[col].replace([np.inf, -np.inf], np.nan).fillna(0)

#cap extreme ratios
df["apply_to_accept"] = df["apply_to_accept"].clip(0, 1)
df["accept_to_place"] = df["accept_to_place"].clip(0, 1)
df["apply_to_place"] = df["apply_to_place"].clip(0, 1)

#stat descriptions
print("RATE DISTRIBUTIONS")
print(df[["apply_to_accept", "accept_to_place", "apply_to_place"]].describe())

#borough-level stats
print("BY BOROUGH")
borough_stats = df.groupby("borough")[[
    "apply_to_accept", "accept_to_place", "apply_to_place"
]].mean()
print(borough_stats)

#weighted rates by borough
print("WEIGHTED PIPELINE NUMBER BY BOROUGH")

weighted = df.groupby("borough").apply(lambda x: pd.Series({
    "apply_to_accept": x[accepted_col].sum() / x[applied_col].sum() if x[applied_col].sum() > 0 else 0,
    "accept_to_place": x[placed_col].sum() / x[accepted_col].sum() if x[accepted_col].sum() > 0 else 0,
    "apply_to_place": x[placed_col].sum() / x[applied_col].sum() if x[applied_col].sum() > 0 else 0
}))

print(weighted)

#anova to see differences between boroughs
print("\n=== ANOVA TESTS ===")

for metric in ["apply_to_accept", "accept_to_place", "apply_to_place"]:
    groups = [
        group[metric].values
        for _, group in df.groupby("borough")
    ]
    
    f_stat, p_val = stats.f_oneway(*groups)
    
    print(f"\n{metric}")
    print(f"F-stat: {f_stat:.4f}")
    print(f"P-value: {p_val:.4f}")

#analyzing the pipeline bottlenecks
print("\n=== BOTTLENECK ANALYSIS ===")

drop_apply_accept = 1 - apply_to_accept
drop_accept_place = 1 - accept_to_place

print(f"Drop-off (Apply to Accept): {drop_apply_accept:.4f}")
print(f"Drop-off (Accept to Place): {drop_accept_place:.4f}")

if drop_apply_accept > drop_accept_place:
    print("biggest bottleneck is getting accepted into the program")
else:
    print("biggest bottleneck is converting training into jobs")

#correlative analysis
print("CORRELATION")
corr = df[[applied_col, accepted_col, placed_col]].corr()
print(corr)

print("Rows with 0 applications:", (df[applied_col] == 0).sum())
print("Rows with 0 accepted:", (df[accepted_col] == 0).sum())
print("Rows with 0 placements:", (df[placed_col] == 0).sum())
