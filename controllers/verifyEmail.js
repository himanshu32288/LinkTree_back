const UserDb = require("../models/userSchema");
const verifyEmail = async (req, res, next) => {
  const { verificationString } = req.body;
  const user = UserDb.findOne({ verificationString });
  if (!user)
    return res
      .status(401)
      .json({ message: "The email verification code is incorrect" });
  const { username, email } = user;
  user.isVerified = true;
  try {
    token = jwt.sign({ username, email }, process.env.SECRET, {
      expiresIn: "7d",
    });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
  }
};
exports.verifyEmail = verifyEmail;
