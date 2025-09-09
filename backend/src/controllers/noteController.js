export const getAllNotes = (req, res) => {
  res.status(200).send("You fetched notes successfully.");
};

export const createNote = (req, res) => {
  res.status(201).send("Note created successfully");
};

export const updateNote = (req, res) => {
  res.status(200).send("Post updated successfully");
};

export const deleteNote = (req, res) => {
  res.status(200).send("Post deleted successfully");
};
