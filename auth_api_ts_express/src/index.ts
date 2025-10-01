import app from "./app";

const PORT = process.env.PORT ?? 8080;
app.listen(PORT, () => {
  console.log(`Auth API listening on http://localhost:${PORT}`);
});
