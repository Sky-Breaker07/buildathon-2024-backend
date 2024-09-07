const SuperAdmin = require("../models/SuperAdmin");
const Organization = require("../models/Organization");
const HealthCareProfessional = require("../models/HealthCareProfessional");
const HealthInformationManager = require("../models/HealthInformationManager");
const Archive = require("../models/Archive");
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

    const { staff_id } = req.staff;
    const password = lastName;
    const adminHCP = await HealthCareProfessional.create({
      name: `${firstName} ${lastName}`,
      email,
      profession,
      securityQuestion,
      securityAnswer,
      password,
      isAdmin: true,
      registeredBy: staff_id,
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
      securityAnswer,
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
      registeredBy: staff_id,
    });
    const hcpResponse = {
      name: hcp.name,
      email: hcp.email,
      staff_id: hcp.staff_id,
      profession: hcp.profession,
      isAdmin: hcp.isAdmin,
      registeredBy: hcp.registeredBy,
    };

    successHandler(
      res,
      StatusCodes.CREATED,
      { healthcareProfessional: hcpResponse },
      "Healthcare Professional registered successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to register Healthcare Professional"
    );
  }
};

const registerHealthInformationManager = async (req, res) => {
  try {
    const { firstName, lastName, email, securityQuestion, securityAnswer } =
      req.body;

    const { staff_id } = req.staff;
    const password = lastName;

    const him = await HealthInformationManager.create({
      firstName,
      lastName,
      email,
      securityQuestion,
      securityAnswer,
      password,
      registeredBy: staff_id,
    });

    const himResponse = {
      firstName: him.firstName,
      lastName: him.lastName,
      email: him.email,
      staff_id: him.staff_id,
      registeredBy: him.registeredBy,
    };

    successHandler(
      res,
      StatusCodes.CREATED,
      { healthInformationManager: himResponse },
      "Health Information Manager registered successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to register Health Information Manager"
    );
  }
};

const getAllHealthcareProfessionals = async (req, res) => {
  try {
    const healthcareProfessionals = await HealthCareProfessional.find(
      {},
      "-password -securityAnswer -securityQuestion"
    );

    successHandler(
      res,
      StatusCodes.OK,
      { healthcareProfessionals },
      "Healthcare Professionals retrieved successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve Healthcare Professionals"
    );
  }
};

const getAdminHealthcareProfessionals = async (req, res) => {
  try {
    const adminHealthcareProfessionals = await HealthCareProfessional.find(
      { isAdmin: true },
      "-password -securityAnswer -securityQuestion"
    );

    successHandler(
      res,
      StatusCodes.OK,
      { adminHealthcareProfessionals },
      "Admin Healthcare Professionals retrieved successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve Admin Healthcare Professionals"
    );
  }
};

const getHealthcareProfessionalsByProfession = async (req, res) => {
  try {
    const { profession } = req.params;
    const healthcareProfessionals = await HealthCareProfessional.find(
      { profession },
      "-password -securityAnswer -securityQuestion"
    );

    successHandler(
      res,
      StatusCodes.OK,
      { healthcareProfessionals },
      `Healthcare Professionals in ${profession} retrieved successfully`
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve Healthcare Professionals by profession"
    );
  }
};

const getAllHealthInformationManagers = async (req, res) => {
  try {
    const healthInformationManagers = await HealthInformationManager.find(
      {},
      "-password -securityAnswer -securityQuestion"
    );

    successHandler(
      res,
      StatusCodes.OK,
      { healthInformationManagers },
      "Health Information Managers retrieved successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to retrieve Health Information Managers"
    );
  }
};

const changeHealthcareProfessionalAdminStatus = async (req, res) => {
  try {
    const { staff_id } = req.params;
    const { isAdmin } = req.body;
    const { staff_id: performedBy } = req.staff;

    const healthcareProfessional = await HealthCareProfessional.findOneAndUpdate(
      { staff_id },
      { isAdmin },
      { new: true, runValidators: true, select: '-password -securityAnswer' }
    );

    if (!healthcareProfessional) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        'Healthcare Professional not found'
      );
    }

    // Log the action
    await Archive.create({
      action: 'CHANGE_ADMIN_STATUS',
      targetModel: 'HealthCareProfessional',
      targetId: staff_id,
      performedBy,
      details: { newAdminStatus: isAdmin }
    });

    const action = isAdmin ? 'promoted to admin' : 'demoted from admin';
    successHandler(
      res,
      StatusCodes.OK,
      { healthcareProfessional },
      `Healthcare Professional ${action} successfully`
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to update Healthcare Professional admin status'
    );
  }
};

const removeHealthcareProfessional = async (req, res) => {
  try {
    const { staff_id } = req.params;
    const { staff_id: performedBy } = req.staff;
    const admin = await HealthCareProfessional.findOne({ staff_id: performedBy });
    const targetHCP = await HealthCareProfessional.findOne({ staff_id });

    if (!admin || !targetHCP) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        'Healthcare Professional not found'
      );
    }

    if (!admin.isAdmin || admin.profession !== targetHCP.profession || targetHCP.isAdmin) {
      return errorHandler(
        res,
        StatusCodes.FORBIDDEN,
        'You do not have permission to remove this Healthcare Professional'
      );
    }

    await HealthCareProfessional.findOneAndDelete({ staff_id });

    await Archive.create({
      action: 'REMOVE',
      targetModel: 'HealthCareProfessional',
      targetId: staff_id,
      performedBy,
      details: {
        name: targetHCP.name,
        email: targetHCP.email,
        profession: targetHCP.profession
      }
    });

    successHandler(
      res,
      StatusCodes.OK,
      null,
      'Healthcare Professional removed successfully'
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to remove Healthcare Professional'
    );
  }
};

const removeHealthInformationManager = async (req, res) => {
  try {
    const { staff_id } = req.params;
    const { staff_id: performedBy } = req.staff;

    const superAdmin = await SuperAdmin.findOne({ staff_id: performedBy });
    if (!superAdmin) {
      return errorHandler(
        res,
        StatusCodes.FORBIDDEN,
        'Only Super Admin can remove Health Information Managers'
      );
    }

    const healthInformationManager = await HealthInformationManager.findOneAndDelete({ staff_id });

    if (!healthInformationManager) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        'Health Information Manager not found'
      );
    }

    // Log the action
    await Archive.create({
      action: 'REMOVE',
      targetModel: 'HealthInformationManager',
      targetId: staff_id,
      performedBy,
      details: {
        firstName: healthInformationManager.firstName,
        lastName: healthInformationManager.lastName,
        email: healthInformationManager.email
      }
    });

    successHandler(
      res,
      StatusCodes.OK,
      null,
      'Health Information Manager removed successfully'
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to remove Health Information Manager'
    );
  }
};

module.exports = {
  registerSuperAdmin,
  registerAdminHealthcareProfessional,
  registerHealthcareProfessional,
  registerHealthInformationManager,
  getAllHealthcareProfessionals,
  getAdminHealthcareProfessionals,
  getHealthcareProfessionalsByProfession,
  getAllHealthInformationManagers,
  changeHealthcareProfessionalAdminStatus,
  removeHealthcareProfessional,
  removeHealthInformationManager,
};
