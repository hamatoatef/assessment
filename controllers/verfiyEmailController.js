const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.verfityEmail = async (req, res) => {
  const token = req.params.token;
  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract userId from decoded token
    const id = decoded.id;

    // Find the user by userId
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    

    // Mark the user as verified (update user in the database)
    user.verify = true;
    await user.save();

    // Optionally, you can redirect to a success page or send a response
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
