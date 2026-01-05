import User from "../models/User.js";

export async function getAllUsers(_, res) {
  try {
    const user = await User.find().sort({ createdAt: -1 });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getAllUser Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getUserById(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found." });
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUserById Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createUser(req, res) {
  try {
    const { first_name, second_name, password, admin } = req.body;
    const user = new User({ first_name, second_name, password, admin });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error in createUser controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateUser(req, res) {
  try {
    const { first_name, second_name, password, admin } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        first_name,
        second_name,
        password,
        admin,
      },
      { new: true }
    );
    if (!updatedUser)
      return res.status(404).json({ message: "User not found." });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateUser controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteUser(req, res) {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });

    res.status(200).send(deletedUser);
  } catch (error) {
    console.error("Error in deleteUser controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}
