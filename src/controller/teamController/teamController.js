import Team from "../../models/Team/Team.js";
import cloudinary from "../../config/cloudinary.js";

// safe JSON parse helper
const safeParse = (value) => {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    if (typeof value === "string")
      return value.split(",").map((v) => v.trim()).filter(Boolean);
    return [];
  }
};

/**
 * CREATE TEAM
 */
export const createTeam = async (req, res) => {
  try {
    const formDataParsed = JSON.parse(req.body.formData);

    const mainImage = req.files?.mainImage?.[0]?.path || null;

    const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];
    const profileImages = req.files?.profileImages?.map((f) => f.path) || [];

    const parsedAdventure = safeParse(req.body.adventure).map((block) => ({
      ...block,
      adventure: block.adventure.map((inner, i) => ({
        ...inner,
        image: adventureImages[i] || inner.image || null,
      })),
    }));

    const parsedProfile = safeParse(req.body.profile).map((block) => ({
      ...block,
      profile: block.profile.map((inner, i) => ({
        ...inner,
        image: profileImages[i] || inner.image || null,
      })),
    }));

    const newTeam = await Team.create({
      ...formDataParsed,
      image: mainImage,
      adventure: parsedAdventure,
      profile: parsedProfile,
    });

    res.status(201).json({ message: "Team created successfully", team: newTeam });

  } catch (err) {
    console.error("❌ CREATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * GET ALL TEAMS
 */
export const getAllTeams = async (req, res) => {
  try {
    const data = await Team.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching team list", error: err.message });
  }
};


/**
 * GET TEAM BY ID
 */
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: "Team not found" });

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: "Error fetching team", error: err.message });
  }
};


/**
 * UPDATE TEAM
 */
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = req.body;

    updateData.adventure = safeParse(updateData.adventure);
    updateData.profile = safeParse(updateData.profile);

    const adventureImages = req.files?.adventureImages?.map((f) => f.path) || [];
    const profileImages = req.files?.profileImages?.map((f) => f.path) || [];

    if (updateData.adventure) {
      updateData.adventure = updateData.adventure.map((block) => ({
        ...block,
        adventure: block.adventure.map((inner, i) => ({
          ...inner,
          image: adventureImages[i] || inner.image || null,
        })),
      }));
    }

    if (updateData.profile) {
      updateData.profile = updateData.profile.map((block) => ({
        ...block,
        profile: block.profile.map((inner, i) => ({
          ...inner,
          image: profileImages[i] || inner.image || null,
        })),
      }));
    }

    // Replace main image if uploaded
    if (req.files?.mainImage?.length) {
      updateData.image = req.files.mainImage[0].path;
    }

    const updatedTeam = await Team.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.json({ message: "Team updated successfully", team: updatedTeam });

  } catch (err) {
    console.error("❌ UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};


/**
 * DELETE TEAM
 */
export const deleteTeam = async (req, res) => {
  try {
    const doc = await Team.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Team not found" });

    if (doc.imagePublicId) await cloudinary.uploader.destroy(doc.imagePublicId);

    await Team.findByIdAndDelete(req.params.id);

    res.json({ message: "Team deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: "Error deleting team", error: err.message });
  }
};
