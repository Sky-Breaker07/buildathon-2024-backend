const Communication = require('../models/Communication');
const ServiceRequest = require('../models/ServiceRequest');
const HealthCareProfessional = require('../models/HealthCareProfessional');
const { StatusCodes } = require('http-status-codes');
const { errorHandler, successHandler } = require('../utils/utils');

const sendMessage = async (req, res) => {
  try {
    const { receiverIds, patientId, message, attachments } = req.body;
    const {staff_id} = req.staff;
    const senderId = staff_id;

    const newCommunication = new Communication({
      sender: senderId,
      receivers: receiverIds,
      patient: patientId,
      message,
      attachments
    });

    await newCommunication.save();

    successHandler(
      res,
      StatusCodes.CREATED,
      newCommunication,
      'Message sent successfully'
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to send message');
  }
};

const getMessages = async (req, res) => {
  try {
    const {staff_id} = req.staff;
    const staffId = staff_id;
    const { patientId } = req.params;

    const messages = await Communication.find({
      $or: [{ sender: staffId }, { receivers: staffId }],
      patient: patientId
    })
      .populate('sender', 'name profession')
      .populate('receivers', 'name profession')
      .sort({ createdAt: -1 });

    successHandler(
      res,
      StatusCodes.OK,
      messages,
      'Messages retrieved successfully'
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve messages');
  }
};

const createServiceRequest = async (req, res) => {
  try {
    const { targetProfession, patientId, description } = req.body;
    const {staff_id} = req.staff;
    const requesterId = req.staff_id;

    const newServiceRequest = new ServiceRequest({
      requester: requesterId,
      targetProfession,
      patient: patientId,
      description
    });

    await newServiceRequest.save();

    successHandler(
      res,
      StatusCodes.CREATED,
      newServiceRequest,
      'Service request created successfully'
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to create service request');
  }
};

const getServiceRequests = async (req, res) => {
  try {
    const {staff_id} = req.staff;
    const staffId = staff_id;
    const { status } = req.query;

    const staff = await HealthCareProfessional.findById(staffId);

    let query = { targetProfession: staff.profession };
    if (status) {
      query.status = status;
    }

    if (!staff.isAdmin) {
      query.assignedTo = staffId;
    }

    const serviceRequests = await ServiceRequest.find(query)
      .populate('requester', 'name profession')
      .populate('patient', 'biodata')
      .sort({ createdAt: -1 });

    successHandler(
      res,
      StatusCodes.OK,
      serviceRequests,
      'Service requests retrieved successfully'
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to retrieve service requests');
  }
};

const updateServiceRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, assignedTo } = req.body;
    const {staff_id} = req.staff;
    const staffId = staff_id;

    const serviceRequest = await ServiceRequest.findById(requestId);

    if (!serviceRequest) {
      return errorHandler(res, StatusCodes.NOT_FOUND, 'Service request not found');
    }

    const staff = await HealthCareProfessional.findById(staffId);

    if (!staff.isAdmin && staff.profession !== serviceRequest.targetProfession) {
      return errorHandler(res, StatusCodes.FORBIDDEN, 'You do not have permission to update this request');
    }

    if (status) serviceRequest.status = status;
    if (assignedTo) serviceRequest.assignedTo = assignedTo;

    serviceRequest.updatedAt = Date.now();
    await serviceRequest.save();

    successHandler(
      res,
      StatusCodes.OK,
      serviceRequest,
      'Service request updated successfully'
    );
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update service request');
  }
};

module.exports = {
  sendMessage,
  getMessages,
  createServiceRequest,
  getServiceRequests,
  updateServiceRequest
};
