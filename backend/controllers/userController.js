import { admin, db } from "../config/firebaseConfig.js";

export const updateUserProfile = async (req, res) => {
  const { userId, newUsername, newEmail } = req.body;

  if (!userId || !newUsername || !newEmail) {
    return res.status(400).json({ success: false, message: "Missing fields" });
  }

  try {
    //Check if email is already used
    const existingUser = await admin
      .auth()
      .getUserByEmail(newEmail)
      .catch(() => null);

    if (existingUser && existingUser.uid !== userId) {
      return res
        .status(400)
        .json({ success: false, message: "auth/email-already-in-use" });
    }

    await admin.auth().updateUser(userId, {
      email: newEmail,
      displayName: newUsername,
    });

    await db.collection("users").doc(userId).update({
      username: newUsername,
      email: newEmail.toLowerCase(),
    });

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
