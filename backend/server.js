import express from "express";

const app = express();

app.get("/api/notes/", (req, res) => {
  res.status(200).send("You got 5 1notes");
});

app.post("/api/notes/", (req, res) => {
  res.status(201).send("Note created successfully");
});

app.put("/api/notes/:id", (req, res) => {
  res.status(200).send("Post updated successfully");
});

app.delete("/api/notes/:id", (req, res) => {
  res.status(200).send("Post deleted successfully");
});

app.listen(5001, () => {
  console.log("Server started on PORT: 5001");
});
