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

### Login

- **URL:** `/api/v1/auth/login`
- **Method:** `POST`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "staff_id": "string",
    "password": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Login successful",
    "data": {
      "user": {
        "staff_id": "string",
        "firstName": "string",
        "lastName": "string",
        "email": "string",
        "role": "string",
        "sex": "string", // Only for SuperAdmin
        "profession": "string", // Only for HealthCareProfessional
        "isAdmin": "boolean", // Only for HealthCareProfessional
        "patientsAssigned": ["string"], // Only for HealthCareProfessional
        "superadmin_id": "string", // Only for HealthInformationManager
        "organization": {
          "name": "string",
          "organization_id": "string"
        }
      },
      "token": "string"
    }
  }
  ```

### Reset Password

- **URL:** `/api/v1/auth/reset-password`
- **Method:** `POST`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "staff_id": "string",
    "securityQuestion": "string",
    "securityAnswer": "string",
    "newPassword": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Password reset successful",
    "data": null
  }
  ```

### Update Password

- **URL:** `/api/v1/auth/update-password`
- **Method:** `PATCH`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Password updated successfully",
    "data": null
  }
  ```

### Get Current User

- **URL:** `/api/v1/auth/current-user`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Current user retrieved successfully",
    "data": {
      "staff_id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "sex": "string", // Only for SuperAdmin
      "profession": "string", // Only for HealthCareProfessional
      "isAdmin": "boolean", // Only for HealthCareProfessional
      "patientsAssigned": ["string"], // Only for HealthCareProfessional
      "superadmin_id": "string", // Only for HealthInformationManager
      "organization": {
        "name": "string",
        "organization_id": "string"
      }
    }
  }
  ```

Note: The response data will vary based on the role of the user. Fields that are specific to certain roles will only be included for users with those roles.

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
          "isAdmin": "boolean",
          "organization": {
            "name": "string",
            "organization_id": "string"
          }
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

### Remove Admin Healthcare Professional

- **URL:** `/api/v1/staff/admin-hcp/:staff_id`
- **Method:** `DELETE`
- **Auth Required:** Yes (Super Admin only)
- **URL Parameters:** 
  - `staff_id`: The staff ID of the Admin Healthcare Professional to be removed
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Admin Healthcare Professional removed successfully",
    "data": null
  }
  ```

Note: This action can only be performed by a Super Admin. Attempting to access this endpoint without Super Admin privileges will result in a 403 Forbidden error.

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

  ### Get All Patients

- **URL:** `/api/v1/patients`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Parameters:**
  - `page`: number (optional, default: 1)
  - `limit`: number (optional, default: 10)
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Patients retrieved successfully",
    "data": {
      "patients": [
        {
          "_id": "string",
          "biodata": {
            "_id": "string",
            "name": "string",
            "age": "number",
            "sex": "string",
            "tribe": "string",
            "religion": "string",
            "occupation": "string",
            "marital_status": "string",
            "address": "string",
            "createdAt": "string",
            "updatedAt": "string",
            "__v": "number"
          },
          "hospital_record": {
            "mortality": {
              "status": "boolean",
              "date": "string | null",
              "cause": "string | null"
            },
            "_id": "string",
            "hospital_id": "string",
            "biodata": "string",
            "appointments": [
              {
                "date": "string",
                "status": "string",
                "time": "string",
                "_id": "string"
              }
            ],
            "professionals_assigned": ["string"],
            "sessionCount": "number | null",
            "nightCount": "number | null",
            "__v": "number"
          },
          "vital_signs": ["string"],
          "assessments": ["string"],
          "treatments": ["string"],
          "discharges": ["string"],
          "evaluations": ["string"],
          "__v": "number"
        }
      ],
      "currentPage": "number",
      "totalPages": "number",
      "totalPatients": "number"
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

## Assessment Templates

### Create Assessment Template

- **URL:** `/api/v1/templates/assessment`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "fields": [
      {
        "name": "string",
        "type": "string",
        "required": "boolean"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Assessment template created successfully",
    "data": {
      "template": {
        "_id": "string",
        "name": "string",
        "profession": "string",
        "fields": [
          {
            "name": "string",
            "type": "string",
            "required": "boolean"
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

### Get All Assessment Templates

- **URL:** `/api/v1/templates/assessment`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Assessment templates retrieved successfully",
    "data": {
      "templates": [
        {
          "_id": "string",
          "name": "string",
          "profession": "string",
          "fields": [
            {
              "name": "string",
              "type": "string",
              "required": "boolean"
            }
          ],
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### Get Assessment Template by ID

- **URL:** `/api/v1/templates/assessment/:id`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Current user retrieved successfully",
    "data": {
      "staff_id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "role": "string",
      "sex": "string", // Only for SuperAdmin
      "profession": "string", // Only for HealthCareProfessional
      "isAdmin": "boolean", // Only for HealthCareProfessional
      "patientsAssigned": ["string"], // Only for HealthCareProfessional
      "superadmin_id": "string", // Only for HealthInformationManager
      "organization": {
        "name": "string",
        "organization_id": "string"
      }
    }
  }
  ```

Note: The response data will vary based on the role of the user. Fields that are specific to certain roles will only be included for users with those roles.
- **Request Body:**
  ```json
  {
    "staff_id": "string",
    "securityQuestion": "string",
    "securityAnswer": "string",
    "newPassword": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Password reset successful",
    "data": null
  }
  ```

### Update Password

- **URL:** `/api/v1/auth/update-password`
- **Method:** `PATCH`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Password updated successfully",
    "data": null
  }
  ```

Note: The login response will vary based on the type of user logging in (SuperAdmin, HealthCareProfessional, or HealthInformationManager). The response shown above includes all possible fields for each user type.

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

### Remove Admin Healthcare Professional

- **URL:** `/api/v1/staff/admin-hcp/:staff_id`
- **Method:** `DELETE`
- **Auth Required:** Yes (Super Admin only)
- **URL Parameters:** 
  - `staff_id`: The staff ID of the Admin Healthcare Professional to be removed
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Admin Healthcare Professional removed successfully",
    "data": null
  }
  ```

Note: This action can only be performed by a Super Admin. Attempting to access this endpoint without Super Admin privileges will result in a 403 Forbidden error.

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

## Assessment Templates

### Create Assessment Template

- **URL:** `/api/v1/templates/assessment`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "fields": [
      {
        "name": "string",
        "type": "string",
        "required": "boolean"
      }
    ]
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 201,
    "message": "Assessment template created successfully",
    "data": {
      "template": {
        "_id": "string",
        "name": "string",
        "profession": "string",
        "fields": [
          {
            "name": "string",
            "type": "string",
            "required": "boolean"
          }
        ],
        "createdAt": "string",
        "updatedAt": "string"
      }
    }
  }
  ```

### Get All Assessment Templates

- **URL:** `/api/v1/templates/assessment`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Assessment templates retrieved successfully",
    "data": {
      "templates": [
        {
          "_id": "string",
          "name": "string",
          "profession": "string",
          "fields": [
            {
              "name": "string",
              "type": "string",
              "required": "boolean"
            }
          ],
          "createdAt": "string",
          "updatedAt": "string"
        }
      ]
    }
  }
  ```

### Get Assessment Template by ID

- **URL:** `/api/v1/templates/assessment/:id`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:**
  ```json
  {
    "status": "success",
- **Request Body:**
  ```json
  {
    "staff_id": "string",
    "securityQuestion": "string",
    "securityAnswer": "string",
    "newPassword": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Password reset successful",
    "data": null
  }
  ```

### Update Password

- **URL:** `/api/v1/auth/update-password`
- **Method:** `PATCH`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Response:**
  ```json
  {
    "status": "success",
    "statusCode": 200,
    "message": "Password updated successfully",
    "data": null
  }
  ```

Note: The login response will vary based on the type of user logging in (SuperAdmin, HealthCareProfessional, or HealthInformationManager). The response shown above includes all possible fields for each user type.

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
