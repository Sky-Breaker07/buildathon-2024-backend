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
- **Response:** Returns the created Super Admin details and organization information.

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
- **Response:** Returns the created Admin Healthcare Professional details.

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
- **Response:** Returns the created Healthcare Professional details.

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
- **Response:** Returns the created Health Information Manager details.

### Get All Healthcare Professionals
- **URL:** `/api/v1/staff/hcp`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns a list of all Healthcare Professionals.

### Get Admin Healthcare Professionals
- **URL:** `/api/v1/staff/admin-hcp`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns a list of all Admin Healthcare Professionals.

### Get Healthcare Professionals by Profession
- **URL:** `/api/v1/staff/hcp/:profession`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns a list of Healthcare Professionals filtered by profession.

### Get All Health Information Managers
- **URL:** `/api/v1/staff/him`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns a list of all Health Information Managers.

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
- **Response:** Returns the updated Healthcare Professional details.

### Remove Healthcare Professional
- **URL:** `/api/v1/staff/hcp/:staff_id`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Response:** Confirmation of Healthcare Professional removal.

### Remove Health Information Manager
- **URL:** `/api/v1/staff/him/:staff_id`
- **Method:** `DELETE`
- **Auth Required:** Yes
- **Response:** Confirmation of Health Information Manager removal.

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
- **Response:** Returns the created patient's hospital record.

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
- **Response:** Returns the patient's hospital record.

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
- **Response:** Returns the patient's details.

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
- **Response:** Returns the created assessment details.

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
- **Response:** Returns the created treatment details.

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
- **Response:** Confirmation of patient assignment.

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
- **Response:** Returns the created discharge details.

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
- **Response:** Returns the created evaluation details.

### Update Mortality Status
- **URL:** `/api/v1/patients/mortality-status`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "hospital_id": "string",
    "status": "boolean",
    "date": "string",
    "cause": "string"
  }
  ```
- **Response:** Confirmation of mortality status update.

### Update Session Count
- **URL:** `/api/v1/patients/session-count`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "hospital_id": "string",
    "sessionCount": "number"
  }
  ```
- **Response:** Confirmation of session count update.

### Update Night Count
- **URL:** `/api/v1/patients/night-count`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "hospital_id": "string",
    "nightCount": "number"
  }
  ```
- **Response:** Confirmation of night count update.

## Assessment Templates

### Create Assessment Template
- **URL:** `/api/v1/assessment-template`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "description": "string",
    "fields": "object"
  }
  ```
- **Response:** Returns the created assessment template.

### Get Assessment Template
- **URL:** `/api/v1/assessment-template/:id`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns the specified assessment template.

### Get Assessment Templates by Profession
- **URL:** `/api/v1/assessment-template/profession/:profession`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns assessment templates for the specified profession.

### Get All Assessment Templates
- **URL:** `/api/v1/assessment-template/all`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns all assessment templates.

### Update Assessment Template
- **URL:** `/api/v1/assessment-template/:id`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "description": "string",
    "fields": "object",
    "isActive": "boolean"
  }
  ```
- **Response:** Returns the updated assessment template.

## Discharge Templates

### Create Discharge Template
- **URL:** `/api/discharge-templates`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "description": "string",
    "fields": "object"
  }
  ```
- **Response:** Returns the created discharge template.

### Get Discharge Template
- **URL:** `/api/discharge-templates/:id`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns the specified discharge template.

### Get Discharge Templates by Profession
- **URL:** `/api/discharge-templates/profession/:profession`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns discharge templates for the specified profession.

### Get All Discharge Templates
- **URL:** `/api/discharge-templates`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns all discharge templates.

### Update Discharge Template
- **URL:** `/api/discharge-templates/:id`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "description": "string",
    "fields": "object",
    "isActive": "boolean"
  }
  ```
- **Response:** Returns the updated discharge template.

## Evaluation Templates

### Create Evaluation Template
- **URL:** `/api/evaluation-templates`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "description": "string",
    "fields": "object"
  }
  ```
- **Response:** Returns the created evaluation template.

### Get Evaluation Template
- **URL:** `/api/evaluation-templates/:id`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns the specified evaluation template.

### Get Evaluation Templates by Profession
- **URL:** `/api/evaluation-templates/profession/:profession`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns evaluation templates for the specified profession.

### Get All Evaluation Templates
- **URL:** `/api/evaluation-templates/all`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns all evaluation templates.

### Update Evaluation Template
- **URL:** `/api/evaluation-templates/:id`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "description": "string",
    "fields": "object",
    "isActive": "boolean"
  }
  ```
- **Response:** Returns the updated evaluation template.

## Treatment Templates

### Create Treatment Template
- **URL:** `/api/treatment-templates`
- **Method:** `POST`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "description": "string",
    "fields": "object"
  }
  ```
- **Response:** Returns the created treatment template.

### Get Treatment Template
- **URL:** `/api/treatment-templates/:id`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns the specified treatment template.

### Get Treatment Templates by Profession
- **URL:** `/api/treatment-templates/profession/:profession`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns treatment templates for the specified profession.

### Get All Treatment Templates
- **URL:** `/api/treatment-templates`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns all treatment templates.

### Update Treatment Template
- **URL:** `/api/treatment-templates/:id`
- **Method:** `PUT`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "string",
    "profession": "string",
    "description": "string",
    "fields": "object",
    "isActive": "boolean"
  }
  ```
- **Response:** Returns the updated treatment template.

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
- **Response:** Returns the sent message details.

### Get Messages
- **URL:** `/api/v1/communication/messages/:patientId`
- **Method:** `GET`
- **Auth Required:** Yes
- **Response:** Returns messages related to the specified patient.

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
- **Response:** Returns the created service request details.

### Get Service Requests
- **URL:** `/api/v1/communication/service-requests`
- **Method:** `GET`
- **Auth Required:** Yes
- **Query Parameters:**
  - `status`: string (optional)
- **Response:** Returns service requests based on the user's role and query parameters.

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
- **Response:** Returns the updated service request details.