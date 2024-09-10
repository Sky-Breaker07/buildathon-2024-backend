const SuperAdmin = require("../models/SuperAdmin");
const HealthCareProfessional = require("../models/HealthCareProfessional");
const HealthInformationManager = require("../models/HealthInformationManager");
const { StatusCodes } = require("http-status-codes");
const { errorHandler, successHandler } = require("../utils/utils");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const login = async (req, res) => {
  try {
    const { staff_id, password } = req.body;

    if (!staff_id || !password) {
      return errorHandler(res, StatusCodes.BAD_REQUEST, "Please provide staff ID and password");
    }

    let staff;
    let role;
    let userData;

    if (staff_id.startsWith("CEO")) {
      staff = await SuperAdmin.findOne({ staff_id });
      role = "SuperAdmin";
      if (staff) {
        userData = {
          staff_id: staff.staff_id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          sex: staff.sex,
          role: role,
        };
      }
    } else if (staff_id.startsWith("HCP")) {
      staff = await HealthCareProfessional.findOne({ staff_id });
      role = "HealthCareProfessional";
      if (staff) {
        userData = {
          staff_id: staff.staff_id,
          name: staff.name,
          email: staff.email,
          profession: staff.profession,
          isAdmin: staff.isAdmin,
          role: role,
          patientsAssigned: staff.patientsAssigned,
        };
      }
    } else if (staff_id.startsWith("HIM")) {
      staff = await HealthInformationManager.findOne({ staff_id });
      role = "HealthInformationManager";
      if (staff) {
        userData = {
          staff_id: staff.staff_id,
          firstName: staff.firstName,
          lastName: staff.lastName,
          email: staff.email,
          role: role,
          superadmin_id: staff.superadmin_id,
        };
      }
    }

    if (!staff) {
      return errorHandler(res, StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const isPasswordCorrect = await staff.comparePassword(password);
    if (!isPasswordCorrect) {
      return errorHandler(res, StatusCodes.UNAUTHORIZED, "Invalid credentials");
    }

    const token = staff.createJWT();

    successHandler(res, StatusCodes.OK, { user: userData, token }, "Login successful");
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Login failed");
  }
};

const resetPassword = async (req, res) => {
  try {
    const { staff_id, securityQuestion, securityAnswer, newPassword } = req.body;

    if (!staff_id || !securityQuestion || !securityAnswer || !newPassword) {
      return errorHandler(res, StatusCodes.BAD_REQUEST, "Please provide all required fields");
    }

    let staff;
    if (staff_id.startsWith("CEO")) {
      staff = await SuperAdmin.findOne({ staff_id });
    } else if (staff_id.startsWith("HCP")) {
      staff = await HealthCareProfessional.findOne({ staff_id });
    } else if (staff_id.startsWith("HIM")) {
      staff = await HealthInformationManager.findOne({ staff_id });
    }

    if (!staff) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Staff not found");
    }

    if (staff.securityQuestion !== securityQuestion) {
      return errorHandler(res, StatusCodes.BAD_REQUEST, "Invalid security question");
    }

    const isSecurityAnswerCorrect = await staff.compareSecurity(securityAnswer);
    if (!isSecurityAnswerCorrect) {
      return errorHandler(res, StatusCodes.BAD_REQUEST, "Invalid security answer");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    staff.password = hashedPassword;
    await staff.save();

    successHandler(res, StatusCodes.OK, null, "Password reset successful");
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Password reset failed");
  }
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { staff_id } = req.staff;

    if (!currentPassword || !newPassword) {
      return errorHandler(res, StatusCodes.BAD_REQUEST, "Please provide current and new password");
    }

    let staff;
    if (staff_id.startsWith("CEO")) {
      staff = await SuperAdmin.findOne({ staff_id });
    } else if (staff_id.startsWith("HCP")) {
      staff = await HealthCareProfessional.findOne({ staff_id });
    } else if (staff_id.startsWith("HIM")) {
      staff = await HealthInformationManager.findOne({ staff_id });
    }

    if (!staff) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Staff not found");
    }

    const isPasswordCorrect = await staff.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      return errorHandler(res, StatusCodes.UNAUTHORIZED, "Current password is incorrect");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    staff.password = hashedPassword;
    await staff.save();

    successHandler(res, StatusCodes.OK, null, "Password updated successfully");
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Password update failed");
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const { staff_id } = req.staff; // This comes from the authentication middleware

    let user;
    let userData;

    if (staff_id.startsWith("CEO")) {
      user = await SuperAdmin.findOne({ staff_id });
      if (user) {
        userData = {
          staff_id: user.staff_id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: "SuperAdmin",
          sex: user.sex
        };
      }
    } else if (staff_id.startsWith("HCP")) {
      user = await HealthCareProfessional.findOne({ staff_id });
      if (user) {
        userData = {
          staff_id: user.staff_id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: "HealthCareProfessional",
          profession: user.profession,
          isAdmin: user.isAdmin,
          patientsAssigned: user.patientsAssigned
        };
      }
    } else if (staff_id.startsWith("HIM")) {
      user = await HealthInformationManager.findOne({ staff_id });
      if (user) {
        userData = {
          staff_id: user.staff_id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: "HealthInformationManager",
          superadmin_id: user.superadmin_id
        };
      }
    }

    if (!user) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "User not found");
    }

    successHandler(res, StatusCodes.OK, userData, "Current user retrieved successfully");
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Failed to retrieve current user");
  }
};

module.exports = {
  login,
  resetPassword,
  updatePassword,
  getCurrentUser
};
