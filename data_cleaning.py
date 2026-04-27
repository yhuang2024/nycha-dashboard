import pandas as pd
#loading datast
df = pd.read_csv("nycha.csv")

#normalizing columns
df.columns = (
    df.columns
    .str.strip()
    .str.lower()
    .str.replace(r"\s+", "_", regex=True)
)
df = df.loc[:, ~df.columns.duplicated()]

#normalizing borough names and replacing invalid entries with "Unknown"
df["borough"] = df["borough"].fillna("Unknown")
df["borough"] = df["borough"].str.strip().str.title()
df = df[~df["nycha_development"].isin(["UNKOWN", "SECTION 8*"])]

#define columns expected to have numeric data
numeric_cols = [
    "total_number_of_resident_job_placements",
    "average_wage_of_such_residents",
    "total_number_of_resident_connections_to_services",
    "total_number_of_residents_that_applied_for_the_nycha_resident_training_academy",
    "total_number_of_residents_that_were_accepted_and_enrolled",
    "total_number_residents_placed_into_full-time_or_part-time_jobs",
    "average_wage_of_such_residents_1",
    "number_of_residents_that_enrolled_in_financial_counseling_services/workshops_through_the_rees_zone_partner_program",
    "total_number_of_residents_enrolled_in_vocational_training_programs_through_the_program",
    "total_number_of_residents_enrolled_in_prep_courses_for_english_as_a_second_language_(esol)_or_the_test_assessing_secondary_completion_(tasc)_through_the_program"
]
#only keep columns that exist in the dataframe in case there are missing fields
numeric_cols = [col for col in numeric_cols if col in df.columns]

#clean numbers in numeric columns
for col in numeric_cols:
    df[col] = (
        df[col]
        .astype(str)
        .str.replace(",", "", regex=False)
        .str.replace("$", "", regex=False)
    )

    df[col] = pd.to_numeric(df[col])

#replace NaN with 0
df[numeric_cols] = df[numeric_cols].fillna(0)

#convenient for plotting
df["service_connections"] = df["total_number_of_resident_connections_to_services"]
df = df.drop_duplicates()

#new csv created!
df.to_csv("cleaned_nycha.csv", index=False)
