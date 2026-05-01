import pandas as pd

# helper functions for cleaning
def clean_columns(df):
    df.columns = (
        df.columns
        .str.strip()
        .str.lower()
        .str.replace(r"\s+", "_", regex=True)
    )
    return df.loc[:, ~df.columns.duplicated()]

def standardize_dev(df, col):
    df[col] = (
        df[col]
        .fillna("")
        .astype(str)
        .str.strip()
        .str.upper()
    )
    return df.rename(columns={col: "nycha_development"})

def clean_numeric(df, cols):
    for col in cols:
        if col in df.columns:
            df[col] = (
                df[col]
                .astype(str)
                .str.replace(",", "", regex=False)
                .str.replace("$", "", regex=False)
                .replace("nan", None)
            )
            df[col] = pd.to_numeric(df[col], errors="coerce")
    return df

#loading data
jobs_df = pd.read_csv("cleaned_nycha.csv")
dev_df = pd.read_csv("development_data.csv")
map_df = pd.read_csv("map_data.csv")

#cleaning data
jobs_df = clean_columns(jobs_df)
dev_df = clean_columns(dev_df)
map_df = clean_columns(map_df)
jobs_df = standardize_dev(jobs_df, "nycha_development")
dev_df = standardize_dev(dev_df, "development")
map_df = standardize_dev(map_df, "development")
dev_df = clean_numeric(
    dev_df,
    ["total_population", "total_number_of_apartments", "density"]
)
dev_df = dev_df.drop_duplicates("nycha_development")
map_df = map_df.drop_duplicates("nycha_development")

#merging datasets
merged_df = jobs_df.merge(dev_df, on="nycha_development", how="left")
merged_df = merged_df.merge(
    map_df[["nycha_development", "borough"]],
    on="nycha_development",
    how="left"
)

merged_df["services_per_capita"] = (
    merged_df["service_connections"] /
    merged_df["total_population"].replace(0, pd.NA)
)
merged_df["services_per_capita"] = merged_df["services_per_capita"].fillna(0)

merged_df.to_csv("final_merged_nycha.csv", index=False)
print("cleaning complete")
