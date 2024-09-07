const SuperAdmin = require("../models/SuperAdmin");
const Organization = require("../models/Organization");
const HealthCareProfessional = require("../models/HealthCareProfessional");
const { StatusCodes } = require("http-status-codes");
const { errorHandler, successHandler } = require("../utils/utils");
const jwt = require("jsonwebtoken");

const registerSuperAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      sex,
      password,
      securityQuestion,
      securityAnswer,
      organizationName,
      organizationAddress,
      organizationDescription,
    } = req.body;

    const organization = await Organization.create({
      name: organizationName,
      address: organizationAddress,
      description: organizationDescription,
    });

    const superAdmin = await SuperAdmin.create({
      firstName,
      lastName,
      email,
      sex,
      password,
      securityQuestion,
      securityAnswer,
    });

    const token = superAdmin.createJWT();

    const responseData = {
      superAdmin: {
        firstName: superAdmin.firstName,
        lastName: superAdmin.lastName,
        email: superAdmin.email,
        staff_id: superAdmin.staff_id,
      },
      organization: {
        name: organization.name,
        organization_id: organization.organization_id,
      },
      token,
    };

    successHandler(
      res,
      StatusCodes.CREATED,
      responseData,
      "Super Admin registered successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, "Registration failed");
  }
};

const registerAdminHealthcareProfessional = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      profession,
      securityQuestion,
      securityAnswer,
    } = req.body;

    const password = lastName;

    const adminHCP = await HealthCareProfessional.create({
      name: `${firstName} ${lastName}`,
      email,
      profession,
      securityQuestion,
      securityAnswer,
      password,
      isAdmin: true,
    });

    const adminHCPResponse = {
      name: adminHCP.name,
      email: adminHCP.email,
      staff_id: adminHCP.staff_id,
      profession: adminHCP.profession,
      isAdmin: adminHCP.isAdmin,
    };

    successHandler(
      res,
      StatusCodes.CREATED,
      { adminHealthcareProfessional: adminHCPResponse },
      "Admin Healthcare Professional created successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create Admin Healthcare Professional"
    );
  }
};

const registerHealthcareProfessional = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      profession,
      securityQuestion,
      securityAnswer
    } = req.body;

    const { staff_id } = req.staff;

    const password = lastName;

    const hcp = await HealthCareProfessional.create({
      name: `${firstName} ${lastName}`,
      email,
      profession,
      securityQuestion,
      securityAnswer,
      password,
      isAdmin: false,
      registeredBy: staff_id
    });
    const hcpResponse = {
      name: hcp.name,
      email: hcp.email,
      staff_id: hcp.staff_id,
      profession: hcp.profession,
      isAdmin: hcp.isAdmin,
      registeredBy: hcp.registeredBy
    };

    successHandler(
      res,
      StatusCodes.CREATED,
      { healthcareProfessional: hcpResponse },
      'Healthcare Professional registered successfully'
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to register Healthcare Professional'
    );
  }
};

module.exports = {
  registerSuperAdmin,
  registerAdminHealthcareProfessional,
  registerHealthcareProfessional
};
