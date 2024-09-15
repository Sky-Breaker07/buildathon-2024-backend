const Patient = require('../models/Patient');
const HospitalRecord = require('../models/HospitalRecord');
const VitalSign = require('../models/VitalSign');
const Assessment = require('../models/Assessment');
const Treatment = require('../models/Treatment');
const Discharge = require('../models/Discharge');
const Evaluation = require('../models/Evaluation');
const Referral = require('../models/Referral');
const HealthCareProfessional = require('../models/HealthCareProfessional');
const BioData = require('../models/Biodata');
const { errorHandler } = require('../utils/utils');
const { StatusCodes } = require('http-status-codes');
const SuperAdmin = require('../models/SuperAdmin');
const HealthInformationManager = require('../models/HealthInformationManager');

const getPatientStatistics = async (req, res) => {
  try {
    const { query } = req.body;
    let result;

    switch (query.type) {
      case 'totalPatients':
        result = await Patient.countDocuments();
        break;

      case 'patientsByProfession':
        result = await getPatientsByProfession(query.profession);
        break;

      case 'patientsByHCP':
        result = await getPatientsByHCP(query.hcpId);
        break;

      case 'patientsByVitalSign':
        result = await getPatientsByVitalSign(query.field, query.operator, query.value);
        break;

      case 'patientsByAssessment':
        result = await getPatientsByAssessment(query.field, query.operator, query.value);
        break;

      case 'patientsByTreatment':
        result = await getPatientsByTreatment(query.field, query.operator, query.value);
        break;

      case 'patientsByDischarge':
        result = await getPatientsByDischarge(query.field, query.operator, query.value);
        break;

      case 'patientsByEvaluation':
        result = await getPatientsByEvaluation(query.field, query.operator, query.value);
        break;

      case 'patientsByReferral':
        result = await getPatientsByReferral(query.field, query.operator, query.value);
        break;

      case 'patientsByBiodata':
        result = await getPatientsByBiodata(query.field, query.operator, query.value);
        break;

      case 'patientsByHospitalRecord':
        result = await getPatientsByHospitalRecord(query.field, query.operator, query.value);
        break;

      default:
        return errorHandler(res, StatusCodes.BAD_REQUEST, 'Invalid query type');
    }

    res.status(StatusCodes.OK).json({ result });
  } catch (error) {
    console.error(error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error: ' + error.message);
  }
};

const getPatientsByProfession = async (profession) => {
  const hcps = await HealthCareProfessional.find({ profession });
  const hospitalRecords = await HospitalRecord.find({ professionals_assigned: { $in: hcps.map(hcp => hcp._id) } });
  return Patient.countDocuments({ hospital_record: { $in: hospitalRecords.map(record => record._id) } });
};

const getPatientsByHCP = async (hcpId) => {
  const hospitalRecords = await HospitalRecord.find({ professionals_assigned: hcpId });
  return Patient.countDocuments({ hospital_record: { $in: hospitalRecords.map(record => record._id) } });
};

const getPatientsByVitalSign = async (field, operator, value) => {
  if (!field) {
    throw new Error('Field is required for vital sign query');
  }
  const query = buildQuery(field, operator, value);
  const vitalSigns = await VitalSign.find(query);
  return Patient.countDocuments({ vital_signs: { $in: vitalSigns.map(vs => vs._id) } });
};

const getPatientsByAssessment = async (field, operator, value) => {
  const query = buildQuery(`assessment_data.${field}`, operator, value);
  const assessments = await Assessment.find(query);
  return Patient.countDocuments({ assessments: { $in: assessments.map(a => a._id) } });
};

const getPatientsByTreatment = async (field, operator, value) => {
  const query = buildQuery(`treatment_data.${field}`, operator, value);
  const treatments = await Treatment.find(query);
  return Patient.countDocuments({ treatments: { $in: treatments.map(t => t._id) } });
};

const getPatientsByDischarge = async (field, operator, value) => {
  const query = buildQuery(`discharge_data.${field}`, operator, value);
  const discharges = await Discharge.find(query);
  return Patient.countDocuments({ discharges: { $in: discharges.map(d => d._id) } });
};

const getPatientsByEvaluation = async (field, operator, value) => {
  const query = buildQuery(`evaluation_data.${field}`, operator, value);
  const evaluations = await Evaluation.find(query);
  return Patient.countDocuments({ evaluations: { $in: evaluations.map(e => e._id) } });
};

const getPatientsByReferral = async (field, operator, value) => {
  const query = buildQuery(`referral_data.${field}`, operator, value);
  const referrals = await Referral.find(query);
  return Patient.countDocuments({ referrals: { $in: referrals.map(r => r._id) } });
};

const getPatientsByBiodata = async (field, operator, value) => {
  const query = buildQuery(field, operator, value);
  const biodata = await BioData.find(query);
  return Patient.countDocuments({ biodata: { $in: biodata.map(b => b._id) } });
};

const getPatientsByHospitalRecord = async (field, operator, value) => {
  const query = buildHospitalRecordQuery(field, operator, value);
  const hospitalRecords = await HospitalRecord.find(query);
  return Patient.countDocuments({ hospital_record: { $in: hospitalRecords.map(hr => hr._id) } });
};

const buildQuery = (field, operator, value) => {
  if (!field || typeof field !== 'string') {
    throw new Error('Invalid field parameter');
  }
  const query = {};
  const fieldParts = field.split('.');
  let currentQuery = query;

  fieldParts.forEach((part, index) => {
    if (index === fieldParts.length - 1) {
      currentQuery[part] = getOperatorQuery(operator, value);
    } else {
      currentQuery[part] = {};
      currentQuery = currentQuery[part];
    }
  });

  return query;
};

const buildHospitalRecordQuery = (field, operator, value) => {
  if (!field || typeof field !== 'string') {
    throw new Error('Invalid field parameter');
  }

  const query = {};
  const fieldType = getHospitalRecordFieldType(field);

  if (fieldType === 'Number') {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      // If the value can't be converted to a number, we'll treat it as a string
      query[field] = getOperatorQuery(operator, value);
    } else {
      query[field] = getOperatorQuery(operator, numValue);
    }
  } else if (fieldType === 'String') {
    query[field] = getOperatorQuery(operator, value);
  } else if (fieldType === 'Boolean') {
    query[field] = getOperatorQuery(operator, value === 'true');
  } else if (fieldType === 'Date') {
    const dateValue = new Date(value);
    if (isNaN(dateValue.getTime())) {
      // If the value can't be converted to a valid date, we'll treat it as a string
      query[field] = getOperatorQuery(operator, value);
    } else {
      query[field] = getOperatorQuery(operator, dateValue);
    }
  } else {
    throw new Error(`Unsupported field type for ${field}`);
  }

  return query;
};

const getHospitalRecordFieldType = (field) => {
  const fieldTypes = {
    hospital_id: 'String',
    biodata: 'ObjectId',
    patient_type: 'String',
    'appointments.date': 'Date',
    'appointments.time': 'String',
    'appointments.status': 'String',
    professionals_assigned: 'ObjectId',
    sessionCount: 'Number',
    nightCount: 'Number',
    'mortality.status': 'Boolean',
    'mortality.date': 'Date',
    'mortality.cause': 'String',
  };

  return fieldTypes[field] || 'String'; // Default to String if not specified
};

const getOperatorQuery = (operator, value) => {
  switch (operator) {
    case 'eq': return value;
    case 'ne': return { $ne: value };
    case 'gt': return { $gt: value };
    case 'gte': return { $gte: value };
    case 'lt': return { $lt: value };
    case 'lte': return { $lte: value };
    case 'in': return { $in: Array.isArray(value) ? value : [value] };
    case 'nin': return { $nin: Array.isArray(value) ? value : [value] };
    default: throw new Error('Invalid operator');
  }
};

const getQueryableFields = async (req, res) => {
  try {
    const queryableFields = {
      VitalSign: await getDeepModelFields(VitalSign),
      Assessment: await getDeepModelFields(Assessment),
      Treatment: await getDeepModelFields(Treatment),
      Discharge: await getDeepModelFields(Discharge),
      Evaluation: await getDeepModelFields(Evaluation),
      Referral: await getDeepModelFields(Referral),
      BioData: await getDeepModelFields(BioData),
      HospitalRecord: await getDeepModelFields(HospitalRecord),
    };

    res.status(StatusCodes.OK).json(queryableFields);
  } catch (error) {
    console.error('Error fetching queryable fields:', error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error');
  }
};

async function getDeepModelFields(model) {
  const fields = {};
  const documents = await model.find().lean().exec();

  documents.forEach(doc => {
    const flattenedFields = flattenObject(doc, '', ['_id', '__v', /\.buffer\.\d+$/]);
    Object.keys(flattenedFields).forEach(field => {
      if (field.endsWith('._id') || field.endsWith('.id')) return;
      const fieldParts = field.split('.');
      let currentField = fields;

      fieldParts.forEach((part, index) => {
        if (index === fieldParts.length - 1) {
          currentField[part] = flattenedFields[field] && typeof flattenedFields[field] === 'object' ? 'Object' : getFieldType(flattenedFields[field]);
        } else {
          if (!currentField[part]) {
            currentField[part] = {};
          }
          currentField = currentField[part];
        }
      });
    });
  });

  return fields;
}

function flattenObject(obj, prefix = '', excludePatterns = []) {
  let flattened = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const shouldExclude = excludePatterns.some(pattern => {
        if (pattern instanceof RegExp) {
          return pattern.test(prefix + key);
        } else {
          return prefix + key === pattern;
        }
      });

      if (shouldExclude) continue;

      if (Array.isArray(obj[key])) {
        const arrayFields = flattenArray(obj[key], prefix + key + '[].');
        flattened = { ...flattened, ...arrayFields };
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        if (key === '_id') {
          flattened[prefix + key] = 'ObjectId';
        } else {
          const nestedFlattened = flattenObject(obj[key], prefix + key + '.', excludePatterns);
          flattened = { ...flattened, ...nestedFlattened };
        }
      } else {
        flattened[prefix + key] = obj[key];
      }
    }
  }

  return flattened;
}

function flattenArray(arr, prefix) {
  const flattened = {};

  arr.forEach((item, index) => {
    if (typeof item === 'object' && item !== null) {
      const nestedFlattened = flattenObject(item, prefix, ['_id.buffer']);
      Object.keys(nestedFlattened).forEach(field => {
        if (!flattened[field]) {
          flattened[field] = nestedFlattened[field];
        }
      });
    } else {
      const fieldName = prefix.slice(0, -1);
      if (!flattened[fieldName]) {
        flattened[fieldName] = getFieldType(item);
      }
    }
  });

  return flattened;
}

function getFieldType(value) {
  if (typeof value === 'string') return 'String';
  if (typeof value === 'number') return 'Number';
  if (typeof value === 'boolean') return 'Boolean';
  if (value instanceof Date) return 'Date';
  if (Array.isArray(value)) return 'Array';
  if (typeof value === 'object' && value !== null) return 'Object';
  return 'Unknown';
}

async function getStaffHierarchy() {
  try {
    // Fetch all staff members
    const superAdmins = await SuperAdmin.find();
    const healthCareProfessionals = await HealthCareProfessional.find();
    const healthInfoManagers = await HealthInformationManager.find();

    // Separate admins (heads) from other healthcare professionals
    const adminHCPs = healthCareProfessionals.filter(hcp => hcp.isAdmin);
    const regularHCPs = healthCareProfessionals.filter(hcp => !hcp.isAdmin);

    // Create the hierarchy
    const hierarchy = {
      superAdmins: superAdmins.map(superAdmin => ({
        role: 'Super Admin',
        name: `${superAdmin.firstName} ${superAdmin.lastName}`,
        staff_id: superAdmin.staff_id,
      })),
      healthCareProfessionals: {
        admins: adminHCPs.map(admin => ({
          role: 'Admin (Healthcare Professional)',
          name: admin.name,
          staff_id: admin.staff_id,
          subordinates: regularHCPs.filter(hcp => hcp.registeredBy === admin.staff_id).map(hcp => ({
            name: hcp.name,
            staff_id: hcp.staff_id,
            profession: hcp.profession
          })),
          subordinateCount: regularHCPs.filter(hcp => hcp.registeredBy === admin.staff_id).length
        })),
        regular: regularHCPs.map(hcp => ({
          name: hcp.name,
          staff_id: hcp.staff_id,
          profession: hcp.profession,
          registeredBy: hcp.registeredBy
        }))
      },
      healthInfoManagers: healthInfoManagers.map(him => ({
        role: 'Health Information Manager',
        name: `${him.firstName} ${him.lastName}`,
        staff_id: him.staff_id
      }))
    };

    // Add counts
    hierarchy.counts = {
      superAdmins: superAdmins.length,
      healthCareProfessionals: {
        admins: adminHCPs.length,
        regular: regularHCPs.length,
        total: healthCareProfessionals.length
      },
      healthInfoManagers: healthInfoManagers.length,
      totalStaff: superAdmins.length + healthCareProfessionals.length + healthInfoManagers.length
    };

    return hierarchy;
  } catch (error) {
    console.error('Error fetching staff hierarchy:', error);
    throw error;
  }
}

const getStaffStatistics = async (req, res) => {
  try {
    const staffHierarchy = await getStaffHierarchy();
    res.status(StatusCodes.OK).json(staffHierarchy);
  } catch (error) {
    console.error('Error fetching staff statistics:', error);
    errorHandler(res, StatusCodes.INTERNAL_SERVER_ERROR, 'Server Error: ' + error.message);
  }
};

module.exports = {
  getPatientStatistics,
  getQueryableFields,
  getStaffStatistics
};
