export default function NYCHAMap() {
  return (
    <div className="chart-card">
      <div className="chart-title">Resident Services, Partnerships, and Initiatives Map</div>

      <iframe
        src="https://nycha.maps.arcgis.com/apps/webappviewer/index.html?id=5444a5413b2d4b84831d37553609619f"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        loading="lazy"
      />
    </div>
  )
}