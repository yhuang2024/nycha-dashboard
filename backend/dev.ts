import app from "./server.js"

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Local test running at http://localhost:${PORT}`)
})