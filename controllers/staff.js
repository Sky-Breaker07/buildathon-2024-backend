const SuperAdmin = require("../models/SuperAdmin");
const Organization = require("../models/Organization");
const HealthCareProfessional = require("../models/HealthCareProfessional");
const HealthInformationManager = require("../models/HealthInformationManager");
const Archive = require("../models/Archive");
const { StatusCodes } = require("http-status-codes");
const { errorHandler, successHandler } = require("../utils/utils");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");


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
      organizationDescription
    } = req.body;

    // Create the organization first
    const organization = await Organization.create({
      name: organizationName,
      address: organizationAddress,
      description: organizationDescription
    });

    // Then create the SuperAdmin and associate it with the organization
    const superAdmin = await SuperAdmin.create({
      firstName,
      lastName,
      email,
      sex,
      password,
      securityQuestion,
      securityAnswer,
      organization: organization._id // Associate the SuperAdmin with the organization
    });

    // Update the organization with the SuperAdmin reference
    organization.superAdmin = superAdmin._id;
    await organization.save();

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
    return errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, error.message);
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
      securityAnswer
    } = req.body;

    const { staff_id: registeredBy } = req.staff;
    const password = lastName.toLowerCase();

    // Find the SuperAdmin who is registering this HCP
    const superAdmin = await SuperAdmin.findOne({ staff_id: registeredBy });
    if (!superAdmin) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "SuperAdmin not found");
    }

    // Find the organization
    const organization = await Organization.findById(superAdmin.organization);
    if (!organization) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Organization not found");
    }

    // Create the adminHCP without saving it to the database yet
    const adminHCP = new HealthCareProfessional({
      name: `${firstName} ${lastName}`,
      email,
      profession,
      securityQuestion,
      securityAnswer,
      password,
      isAdmin: true,
      registeredBy,
      organization: organization._id // Set the organization
    });

    // Generate the staff_id
    await adminHCP.generateStaffId();

    // Now save the document to the database
    await adminHCP.save();

    // Update the organization's staff array
    organization.staff.push(adminHCP._id);
    await organization.save();

    const adminHCPResponse = {
      name: adminHCP.name,
      email: adminHCP.email,
      staff_id: adminHCP.staff_id,
      profession: adminHCP.profession,
      isAdmin: adminHCP.isAdmin,
      organization: {
        name: organization.name,
        organization_id: organization.organization_id
      }
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

    const { staff_id: registeredBy } = req.staff;

    const password = lastName.toLowerCase();

    // Find the Admin Healthcare Professional who is registering this HCP
    const adminHCP = await HealthCareProfessional.findOne({ staff_id: registeredBy, isAdmin: true });
    if (!adminHCP) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Admin Healthcare Professional not found");
    }

    // Check if the adminHCP has the same profession as the new registrant
    if (adminHCP.profession !== profession) {
      return errorHandler(res, StatusCodes.FORBIDDEN, "Admin can only register Healthcare Professionals of the same profession");
    }

    // Find the organization
    const organization = await Organization.findById(adminHCP.organization);
    if (!organization) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Organization not found");
    }

    // Create the HCP without saving it to the database yet
    const hcp = new HealthCareProfessional({
      name: `${firstName} ${lastName}`,
      email,
      profession,
      securityQuestion,
      securityAnswer,
      password,
      isAdmin: false,
      registeredBy,
      organization: organization._id,
    });

    // Generate the staff_id
    await hcp.generateStaffId();

    // Now save the document to the database
    await hcp.save();

    // Update the organization's staff array
    organization.staff.push(hcp._id);
    await organization.save();

    const hcpResponse = {
      name: hcp.name,
      email: hcp.email,
      staff_id: hcp.staff_id,
      profession: hcp.profession,
      isAdmin: hcp.isAdmin,
      registeredBy: hcp.registeredBy,
      organization: {
        name: organization.name,
        organization_id: organization.organization_id,
      },
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
    const {
      firstName,
      lastName,
      email,
      securityQuestion,
      securityAnswer
    } = req.body;


    const { staff_id: registeredBy } = req.staff;
  

    const password = lastName.toLowerCase();

    // Fetch the SuperAdmin document
    const superAdmin = await SuperAdmin.findOne({ staff_id: registeredBy });
    if (!superAdmin) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "SuperAdmin not found");
    }

    // Find the organization
    const organization = await Organization.findById(superAdmin.organization);
    if (!organization) {
      return errorHandler(res, StatusCodes.NOT_FOUND, "Organization not found");
    }

    // Create the HIM without saving it to the database yet
    const him = new HealthInformationManager({
      firstName,
      lastName,
      email,
      securityQuestion,
      securityAnswer: securityAnswer || undefined, // Only set if provided
      password,
      registeredBy,
      superadmin_id: superAdmin._id, // Use the _id of the fetched SuperAdmin
      organization: organization._id // Set the organization
    });

    // Generate the staff_id
    await him.generateStaffId();

    // Now save the document to the database
    await him.save();

    // Update the organization's healthInformationManagers array
    organization.healthInformationManagers.push(him._id);
    await organization.save();

    const himResponse = {
      name: `${firstName} ${lastName}`,
      email: him.email,
      staff_id: him.staff_id,
      registeredBy: him.registeredBy,
      organization: {
        name: organization.name,
        organization_id: organization.organization_id
      }
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
    const healthcareProfessionals = await HealthCareProfessional.find({})
      .select("-password -securityAnswer -securityQuestion")
      .populate({
        path: 'organization',
        select: 'name organization_id'
      });

    const formattedHCPs = healthcareProfessionals.map(hcp => ({
      ...hcp.toObject(),
      organization: hcp.organization ? {
        name: hcp.organization.name,
        organization_id: hcp.organization.organization_id
      } : null
    }));

    successHandler(
      res,
      StatusCodes.OK,
      { healthcareProfessionals: formattedHCPs },
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
    ).populate({
      path: 'organization',
      select: 'name organization_id'
    });

    const formattedAdminHCPs = adminHealthcareProfessionals.map(hcp => ({
      ...hcp.toObject(),
      organization: hcp.organization ? {
        name: hcp.organization.name,
        organization_id: hcp.organization.organization_id
      } : null
    }));

    successHandler(
      res,
      StatusCodes.OK,
      { adminHealthcareProfessionals: formattedAdminHCPs },
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
    ).populate({
      path: 'organization',
      select: 'name organization_id'
    });

    const formattedHCPs = healthcareProfessionals.map(hcp => ({
      ...hcp.toObject(),
      organization: hcp.organization ? {
        name: hcp.organization.name,
        organization_id: hcp.organization.organization_id
      } : null
    }));

    successHandler(
      res,
      StatusCodes.OK,
      { healthcareProfessionals: formattedHCPs },
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
    ).populate({
      path: 'organization',
      select: 'name organization_id'
    });

    const formattedManagers = healthInformationManagers.map(manager => ({
      ...manager.toObject(),
      name: `${manager.firstName.charAt(0).toUpperCase() + manager.firstName.slice(1)} ${manager.lastName.charAt(0).toUpperCase() + manager.lastName.slice(1)}`,
      organization: manager.organization ? {
        name: manager.organization.name,
        organization_id: manager.organization.organization_id
      } : null
    }));

    successHandler(
      res,
      StatusCodes.OK,
      { healthInformationManagers: formattedManagers },
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

    const healthcareProfessional =
      await HealthCareProfessional.findOneAndUpdate(
        { staff_id },
        { isAdmin },
        { new: true, runValidators: true, select: "-password -securityAnswer" }
      );

    if (!healthcareProfessional) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Healthcare Professional not found"
      );
    }

    // Log the action
    await Archive.create({
      action: "CHANGE_ADMIN_STATUS",
      targetModel: "HealthCareProfessional",
      targetId: staff_id,
      performedBy,
      details: { newAdminStatus: isAdmin },
    });

    const action = isAdmin ? "promoted to admin" : "demoted from admin";
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
      "Failed to update Healthcare Professional admin status"
    );
  }
};

const removeHealthcareProfessional = async (req, res) => {
  try {
    const { staff_id } = req.params;
    const { staff_id: performedBy } = req.staff;
    const admin = await HealthCareProfessional.findOne({
      staff_id: performedBy,
    });
    const targetHCP = await HealthCareProfessional.findOne({ staff_id })
      .populate({
        path: 'organization',
        select: 'name organization_id'
      });

    if (!admin || !targetHCP) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Healthcare Professional not found"
      );
    }

    if (
      !admin.isAdmin ||
      admin.profession !== targetHCP.profession ||
      targetHCP.isAdmin
    ) {
      return errorHandler(
        res,
        StatusCodes.FORBIDDEN,
        "You do not have permission to remove this Healthcare Professional"
      );
    }

    await HealthCareProfessional.findOneAndDelete({ staff_id });

    await Archive.create({
      action: "REMOVE",
      targetModel: "HealthCareProfessional",
      targetId: staff_id,
      performedBy,
      details: {
        name: targetHCP.name,
        email: targetHCP.email,
        profession: targetHCP.profession,
        organization: targetHCP.organization ? {
          name: targetHCP.organization.name,
          organization_id: targetHCP.organization.organization_id
        } : null
      },
    });

    successHandler(
      res,
      StatusCodes.OK,
      null,
      "Healthcare Professional removed successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to remove Healthcare Professional"
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
        "Only Super Admin can remove Health Information Managers"
      );
    }

    const healthInformationManager =
      await HealthInformationManager.findOneAndDelete({ staff_id });

    if (!healthInformationManager) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        "Health Information Manager not found"
      );
    }

    // Log the action
    await Archive.create({
      action: "REMOVE",
      targetModel: "HealthInformationManager",
      targetId: staff_id,
      performedBy,
      details: {
        firstName: healthInformationManager.firstName,
        lastName: healthInformationManager.lastName,
        email: healthInformationManager.email,
      },
    });

    successHandler(
      res,
      StatusCodes.OK,
      null,
      "Health Information Manager removed successfully"
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to remove Health Information Manager"
    );
  }
};

const removeAdminHealthcareProfessional = async (req, res) => {
  try {
    const { staff_id } = req.params;
    const { staff_id: performedBy } = req.staff;

    // Check if the action is performed by a SuperAdmin
    const superAdmin = await SuperAdmin.findOne({ staff_id: performedBy });
    if (!superAdmin) {
      return errorHandler(
        res,
        StatusCodes.FORBIDDEN,
        'Only Super Admin can remove Admin Healthcare Professionals'
      );
    }

    // Find and remove the Admin Healthcare Professional
    const adminHCP = await HealthCareProfessional.findOneAndDelete({ staff_id, isAdmin: true });

    if (!adminHCP) {
      return errorHandler(
        res,
        StatusCodes.NOT_FOUND,
        'Admin Healthcare Professional not found'
      );
    }

    // Log the action
    await Archive.create({
      action: 'REMOVE',
      targetModel: 'HealthCareProfessional',
      targetId: staff_id,
      performedBy,
      details: {
        name: adminHCP.name,
        email: adminHCP.email,
        profession: adminHCP.profession
      }
    });

    successHandler(
      res,
      StatusCodes.OK,
      null,
      'Admin Healthcare Professional removed successfully'
    );
  } catch (error) {
    console.error(error);
    errorHandler(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Failed to remove Admin Healthcare Professional'
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
  removeAdminHealthcareProfessional,
};
