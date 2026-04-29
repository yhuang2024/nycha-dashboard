import type { NYCHARecord } from "../NYCHASchema"

interface Props {
  data: NYCHARecord[]
  setBorough: (b: string) => void
}

export default function BoroughSelector({ data, setBorough }: Props) {
  const boroughs = [
    "All",
    ...Array.from(new Set(data.map((d) => d.borough).filter(Boolean))) as string[],
  ]

  return (
    <div style={{ marginBottom: 20 }}>
      <label>Borough: </label>
      <select onChange={(e) => setBorough(e.target.value)}>
        {boroughs.map((b) => (
          <option key={b}>{b}</option>
        ))}
      </select>
    </div>
  )
}
