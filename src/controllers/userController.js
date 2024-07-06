const { User, Organisation } = require("../models");
const asyncHandler = require("express-async-handler");
const { getUserSchema } = require("../utils/getUserSchema");

exports.getUserRecord = asyncHandler(async (req, res) => {
  const { error } = getUserSchema.validate(req.params);
  if (error) {
    return res.status(400).json({
      status: "error",
      message: "Invalid input",
      errors: error.details.map((detail) => ({
        field: detail.path[0],
        message: detail.message,
      })),
    });
  }

  const user = await User.findByPk(req.params.id, {
    include: {
      model: Organisation,
      through: { attributes: [] }, // Include the join table attributes
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "User not found",
    });
  }

  const organisations = user.Organisations || [];

  const isUserInOrganisation = organisations.some((org) => 
    org.UserOrganisations && org.UserOrganisations.some((u) => u.userId === req.user.userId)
  );

  if (!isUserInOrganisation && user.userId !== req.user.userId) {
    return res.status(403).json({
      status: "error",
      message: "Not authorized to access this user",
    });
  }

  res.status(200).json({
    status: "success",
    message: "User fetched successfully",
    data: {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    },
  });
});
