import Meeting from "../models/Meeting.js";

export async function getAllMeetings(_, res) {
  try {
    const meetings = await Meeting.find().sort({ createdAt: -1 });
    res.status(200).json(meetings);
  } catch (error) {
    console.error("Error in getAllMeeting Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function getMeetingById(req, res) {
  try {
    const meeting = await Meeting.findById(req.params.id);
    if (!meeting)
      return res.status(404).json({ message: "Meeting not found." });
    res.status(200).json(meeting);
  } catch (error) {
    console.error("Error in getMeetingById Controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function createMeeting(req, res) {
  try {
    const { title, information, day_in_week } = req.body;
    const meeting = new Meeting({ title, information, day_in_week });
    const savedMeeting = await meeting.save();
    res.status(201).json(savedMeeting);
  } catch (error) {
    console.error("Error in createMeeting controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function updateMeeting(req, res) {
  try {
    const { title, information, day_in_week } = req.body;
    const updatedMeeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      {
        title,
        information,
        day_in_week,
      },
      { new: true }
    );
    if (!updatedMeeting)
      return res.status(404).json({ message: "Meeting not found." });

    res.status(200).json(updatedMeeting);
  } catch (error) {
    console.error("Error in updateMeeting controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}

export async function deleteMeeting(req, res) {
  try {
    const deletedMeeting = await Meeting.findByIdAndDelete(req.params.id);

    if (!deletedMeeting)
      return res.status(404).json({ message: "Meeting not found" });

    res.status(200).send(deletedMeeting);
  } catch (error) {
    console.error("Error in deleteMeeting controller.");
    res.status(500).json({ message: "Internal server error." });
  }
}
