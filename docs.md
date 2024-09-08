# CareLog API Documentation

## Table of Contents

1. [Authentication](#authentication)
2. [Staff Management](#staff-management)
3. [Patient Management](#patient-management)
4. [Assessment Templates](#assessment-templates)
5. [Discharge Templates](#discharge-templates)
6. [Evaluation Templates](#evaluation-templates)
7. [Treatment Templates](#treatment-templates)
8. [Communication](#communication)

## Authentication

All protected routes require a valid JWT token in the Authorization header.

## Staff Management

### Register Super Admin

- **URL:** `/api/v1/staff/register-super-admin`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "sex": "string",
    "password": "string",
    "securityQuestion": "string",
    "securityAnswer": "string",
    "organizationName": "string",
    "organizationAddress": "string",
    "organizationDescription": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Super Admin registered successfully",
    "data": {
      "superAdmin": {
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "staff_id": "string"
      },
      "organization": {
        "name": "string",
        "organization_id": "string"
      },
      "token": "string"
    }
  }
  ```

### Register Admin Healthcare Professional

- **URL:** `/api/v1/staff/register-admin-hcp`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "profession": "string",
    "securityQuestion": "string",
    "securityAnswer": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Admin Healthcare Professional created successfully",
    "data": {
      "adminHealthcareProfessional": {
        "name": "string",
        "email": "string",
        "staff_id": "string",
        "profession": "string",
        "isAdmin": true
      }
    }
  }
  ```

### Register Healthcare Professional

- **URL:** `/api/v1/staff/register-hcp`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "profession": "string",
    "securityQuestion": "string",
    "securityAnswer": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Healthcare Professional registered successfully",
    "data": {
      "healthcareProfessional": {
        "name": "string",
        "email": "string",
        "staff_id": "string",
        "profession": "string",
        "isAdmin": false,
        "registeredBy": "string"
      }
    }
  }
  ```

### Register Health Information Manager

- **URL:** `/api/v1/staff/register-him`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "securityQuestion": "string",
    "securityAnswer": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Health Information Manager registered successfully",
    "data": {
      "healthInformationManager": {
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "staff_id": "string",
        "registeredBy": "string"
      }
    }
  }
  ```

### Get All Healthcare Professionals

- **URL:** `/api/v1/staff/hcp`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Healthcare Professionals retrieved successfully",
    "data": {
      "healthcareProfessionals": [
        {
          "name": "string",
          "email": "string",
          "staff_id": "string",
          "profession": "string",
          "isAdmin": "boolean"
        }
      ]
    }
  }
  ```

### Get Admin Healthcare Professionals

- **URL:** `/api/v1/staff/admin-hcp`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Admin Healthcare Professionals retrieved successfully",
    "data": {
      "adminHealthcareProfessionals": [
        {
          "name": "string",
          "email": "string",
          "staff_id": "string",
          "profession": "string"
        }
      ]
    }
  }
  ```

### Get Healthcare Professionals by Profession

- **URL:** `/api/v1/staff/hcp/:profession`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Healthcare Professionals in {profession} retrieved successfully",
    "data": {
      "healthcareProfessionals": [
        {
          "name": "string",
          "email": "string",
          "staff_id": "string",
          "profession": "string",
          "isAdmin": "boolean"
        }
      ]
    }
  }
  ```

### Get All Health Information Managers

- **URL:** `/api/v1/staff/him`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Health Information Managers retrieved successfully",
    "data": {
      "healthInformationManagers": [
        {
          "firstName": "string",
          "lastName": "string",
          "email": "string",
          "staff_id": "string"
        }
      ]
    }
  }
  ```

### Change Healthcare Professional Admin Status

- **URL:** `/api/v1/staff/hcp/:staff_id/admin-status`
- **Method:** `PATCH`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "isAdmin": "boolean"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Healthcare Professional {promoted/demoted} to/from admin successfully",
    "data": {
      "healthcareProfessional": {
        "name": "string",
        "email": "string",
        "staff_id": "string",
        "profession": "string",
        "isAdmin": "boolean"
      }
    }
  }
  ```

### Remove Healthcare Professional

- **URL:** `/api/v1/staff/hcp/:staff_id`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Healthcare Professional removed successfully",
    "data": null
  }
  ```

### Remove Health Information Manager

- **URL:** `/api/v1/staff/him/:staff_id`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Health Information Manager removed successfully",
    "data": null
  }
  ```

## Patient Management

### Register Patient

- **URL:** `/api/v1/patients/register`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "age": "number",
    "sex": "string",
    "tribe": "string",
    "religion": "string",
    "occupation": "string",
    "marital_status": "string",
    "address": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Patient registered successfully",
    "data": {
      "hospitalRecord": {
        "hospital_id": "string",
        "biodata": {
          "name": "string",
          "age": "number",
          "sex": "string",
          "tribe": "string",
          "religion": "string",
          "occupation": "string",
          "marital_status": "string",
          "address": "string"
        },
        "appointments": [
          {
            "date": "string",
            "time": "string",
            "status": "string"
          }
        ]
      }
    }
  }
  ```

### Get Hospital Record

- **URL:** `/api/v1/patients/hospital-records`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "hospital_id": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Hospital record retrieved successfully",
    "data": {
      "hospitalRecord": {
        "hospital_id": "string",
        "biodata": {
          "name": "string",
          "age": "number",
          "sex": "string",
          "tribe": "string",
          "religion": "string",
          "occupation": "string",
          "marital_status": "string",
          "address": "string"
        },
        "appointments": [
          {
            "date": "string",
            "time": "string",
            "status": "string"
          }
        ],
        "assessments": ["string"],
        "treatments": ["string"],
        "discharges": ["string"],
        "evaluations": ["string"]
      }
    }
  }
  ```

### Get Patient

- **URL:** `/api/v1/patients`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "hospital_id": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Patient details retrieved successfully",
    "data": {
      "patient": {
        "biodata": {
          "name": "string",
          "age": "number",
          "sex": "string",
          "tribe": "string",
          "religion": "string",
          "occupation": "string",
          "marital_status": "string",
          "address": "string"
        },
        "hospital_record": "string"
      }
    }
  }
  ```

### Create Assessment

- **URL:** `/api/v1/patients/assessment`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "template_name": "string",
    "assessment_data": "object",
    "hospital_id": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Assessment created successfully",
    "data": {
      "assessment": {
        "_id": "string",
        "template": {
          "name": "string",
          "profession": "string"
        },
        "hospital_record": "string",
        "assessment_data": "object",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

### Create Treatment

- **URL:** `/api/v1/patients/treatment`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "template_name": "string",
    "treatment_data": "object",
    "hospital_id": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Treatment created successfully",
    "data": {
      "treatment": {
        "_id": "string",
        "template": {
          "name": "string",
          "profession": "string"
        },
        "hospital_record": "string",
        "treatment_data": "object",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

### Assign Patient to Healthcare Professional

- **URL:** `/api/v1/patients/assign-patient`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "hospital_id": "string",
    "staff_id": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Patient assigned successfully",
    "data": null
  }
  ```

### Create Discharge

- **URL:** `/api/v1/patients/discharge`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "template_name": "string",
    "discharge_data": "object",
    "hospital_id": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Discharge created successfully",
    "data": {
      "discharge": {
        "_id": "string",
        "template": {
          "name": "string",
          "profession": "string"
        },
        "hospital_record": "string",
        "discharge_data": "object",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

### Create Evaluation

- **URL:** `/api/v1/patients/evaluation`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "template_name": "string",
    "evaluation_data": "object",
    "hospital_id": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Evaluation created successfully",
    "data": {
      "evaluation": {
        "_id": "string",
        "template": {
          "name": "string",
          "profession": "string"
        },
        "hospital_record": "string",
        "evaluation_data": "object",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

### Update Patient Information

- **URL:** `/api/v1/patients/update-patient-info`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "hospital_id": "string",
    "biodata": {
      "name": "string",
      "age": "number",
      "sex": "string",
      "tribe": "string",
      "religion": "string",
      "occupation": "string",
      "marital_status": "string",
      "address": "string"
    },
    "hospitalRecord": {
      "field1": "value1",
      "field2": "value2"
      // Any fields from the HospitalRecord model that need to be updated
    }
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Patient information updated successfully",
    "data": {
      "patient": {
        "biodata": {
          "name": "string",
          "age": "number",
          "sex": "string",
          "tribe": "string",
          "religion": "string",
          "occupation": "string",
          "marital_status": "string",
          "address": "string"
        },
        "hospital_record": {
          "hospital_id": "string",
          // Other updated fields from the HospitalRecord
        }
      }
    }
  }
  ```

## Communication

### Send Message

- **URL:** `/api/v1/communication/messages`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "receiverIds": ["string"],
    "patientId": "string",
    "message": "string",
    "attachments": ["string"]
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Message sent successfully",
    "data": {
      "communication": {
        "_id": "string",
        "sender": "string",
        "        "sender": "string",
        "receivers": ["string"],
        "patient": "string",
        "message": "string",
        "attachments": ["string"],
        "createdAt": "string"
      }
    }
  }
  ```

### Get Messages

- **URL:** `/api/v1/communication/messages/:patientId`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Messages retrieved successfully",
    "data": {
      "messages": [
        {
          "_id": "string",
          "sender": {
            "_id": "string",
            "name": "string",
            "profession": "string"
          },
          "receivers": [
            {
              "_id": "string",
              "name": "string",
              "profession": "string"
            }
          ],
          "patient": "string",
          "message": "string",
          "attachments": ["string"],
          "createdAt": "string"
        }
      ]
    }
  }
  ```

### Create Service Request

- **URL:** `/api/v1/communication/service-requests`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "targetProfession": "string",
    "patientId": "string",
    "description": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Service request created successfully",
    "data": {
      "serviceRequest": {
        "_id": "string",
        "requester": "string",
        "targetProfession": "string",
        "patient": "string",
        "description": "string",
        "status": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

### Get Service Requests

- **URL:** `/api/v1/communication/service-requests`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Parameters:**
  - `status`: string (optional)
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Service requests retrieved successfully",
    "data": {
      "serviceRequests": [
        {
          "_id": "string",
          "requester": {
            "_id": "string",
            "name": "string",
            "profession": "string"
          },
          "targetProfession": "string",
          "patient": {
            "_id": "string",
            "name": "string"
          },
          "description": "string",
          "status": "string",
          "assignedTo": {
            "_id": "string",
            "name": "string",
            "profession": "string"
          },
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### Update Service Request

- **URL:** `/api/v1/communication/service-requests/:requestId`
- **Method:** `PATCH`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "status": "string",
    "assignedTo": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Service request updated successfully",
    "data": {
      "serviceRequest": {
        "_id": "string",
        "requester": "string",
        "targetProfession": "string",
        "patient": "string",
        "description": "string",
        "status": "string",
        "assignedTo": "string",
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

This completes the API documentation with sample response structures for each endpoint.
