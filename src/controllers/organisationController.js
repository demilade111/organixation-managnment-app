const asyncHandler = require("express-async-handler");
const {
  createOrganisationSchema,
  addUserToOrganisationSchema,
} = require("../utils/orgValidators");
const { User, Organisation } = require("../models");

exports.getOrganisations = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.userId, {
    include: Organisation,
  });

  res.status(200).json({
    status: "success",
    message: "Organisations fetched successfully",
    data: {
      organisations: user.Organisations,
    },
  });
});

exports.getSingleOrganisation = asyncHandler(async (req, res) => {
  const organisation = await Organisation.findByPk(req.params.orgId);

  if (!organisation) {
    return res.status(404).json({
      status: "Not found",
      message: "Organisation not found",
      statusCode: 404,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Organisation fetched successfully",
    data: {
      orgId: organisation.orgId,
      name: organisation.name,
      description: organisation.description,
    },
  });
});

exports.createOrganisation = asyncHandler(async (req, res) => {
  const { error } = createOrganisationSchema.validate(req.body);
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

  const { name, description } = req.body;

  const organisation = await Organisation.create({ name, description });

  await organisation.addUser(req.user.userId);

  res.status(201).json({
    status: "success",
    message: "Organisation created successfully",
    data: {
      orgId: organisation.orgId,
      name: organisation.name,
      description: organisation.description,
    },
  });
});

exports.addUserToOrganisation = asyncHandler(async (req, res) => {
  const { error } = addUserToOrganisationSchema.validate(req.body);
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

  const { userId } = req.body;

  const organisation = await Organisation.findByPk(req.params.orgId);

  if (!organisation) {
    return res.status(404).json({
      status: "Not found",
      message: "Organisation not found",
      statusCode: 404,
    });
  }

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(404).json({
      status: "Not found",
      message: "User not found",
      statusCode: 404,
    });
  }

  await organisation.addUser(user);

  res.status(200).json({
    status: "success",
    message: "User added to organisation successfully",
  });
});
