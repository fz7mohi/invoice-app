# Client API Documentation

## Overview
This API provides endpoints for managing clients in the Fordox system. It supports creating new clients and retrieving client lists with pagination and search capabilities.

## Base URLs
```
Production: https://fordox.netlify.app/.netlify/functions
Development: http://localhost:8888/.netlify/functions
```

## CORS Configuration
The API supports CORS for the following origins:
- https://fortunegiftz.com
- http://localhost:8082

All responses include the following CORS headers:
```
Access-Control-Allow-Origin: [request origin]
Access-Control-Allow-Headers: Content-Type, Accept, Authorization
Access-Control-Allow-Methods: [GET/POST], OPTIONS
Access-Control-Allow-Credentials: true
Access-Control-Max-Age: 86400
```

## Endpoints

### 1. Get Clients
```
GET /.netlify/functions/get-clients
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| search | string | No | "" | Search term to filter clients by company name |
| page | number | No | 1 | Page number for pagination |
| itemsPerPage | number | No | 10 | Number of items per page |
| lastDocId | string | No | null | ID of the last document for cursor-based pagination |

#### Response

##### Success (200 OK)
```json
{
  "clients": [
    {
      "id": "string",
      "companyName": "string",
      "email": "string",
      "phone": "string",
      "address": "string",
      "country": "string",
      "trnNumber": "string",
      "vatPercentage": "string",
      "createdAt": "string"
    }
  ],
  "totalClients": number,
  "currentPage": number,
  "itemsPerPage": number,
  "hasMore": boolean
}
```

##### Error Responses

###### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

###### 500 Internal Server Error
```json
{
  "error": "Failed to fetch clients",
  "details": "Error message"
}
```

#### Example Usage

##### cURL
```bash
# Get all clients (paginated)
curl -X GET "https://fordox.netlify.app/.netlify/functions/get-clients"

# Search clients
curl -X GET "https://fordox.netlify.app/.netlify/functions/get-clients?search=company"

# Get specific page
curl -X GET "https://fordox.netlify.app/.netlify/functions/get-clients?page=2&itemsPerPage=20"
```

##### JavaScript (Fetch)
```javascript
const getClients = async (params = {}) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://fordox.netlify.app/.netlify/functions'
    : 'http://localhost:3000/.netlify/functions';

  // Build query string
  const queryString = new URLSearchParams(params).toString();
  const url = `${baseUrl}/get-clients${queryString ? `?${queryString}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch clients');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

// Example usage
getClients({ search: 'company', page: 1, itemsPerPage: 10 })
  .then(data => console.log('Clients:', data))
  .catch(error => console.error('Error:', error));
```

### 2. Create Client
```
POST /.netlify/functions/create-client
```

#### Headers
```
Content-Type: application/json
Accept: application/json
```

#### Request Body
```json
{
  "companyName": "string",    // Required
  "email": "string",         // Required
  "phone": "string",         // Required
  "address": "string",       // Required
  "country": "string",       // Required
  "trnNumber": "string",     // Required for UAE clients
  "vatPercentage": "string"  // Required for UAE clients
}
```

#### Response

##### Success (201 Created)
```json
{
  "id": "string",
  "companyName": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "country": "string",
  "trnNumber": "string",
  "vatPercentage": "string",
  "createdAt": "string"
}
```

##### Error Responses

###### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "details": ["field1", "field2"]
}
```

###### 400 Bad Request (UAE Validation)
```json
{
  "error": "TRN Number is required for UAE clients"
}
```
or
```json
{
  "error": "VAT Percentage is required for UAE clients"
}
```

###### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

###### 500 Internal Server Error
```json
{
  "error": "Failed to create client",
  "details": "Error message"
}
```

#### Example Usage

##### cURL
```bash
# Production
curl -X POST https://fordox.netlify.app/.netlify/functions/create-client \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Example Company",
    "email": "contact@example.com",
    "phone": "+971 50 123 4567",
    "address": "123 Business Street, Dubai",
    "country": "United Arab Emirates",
    "trnNumber": "123456789012345",
    "vatPercentage": "5"
  }'

# Development
curl -X POST http://localhost:3000/.netlify/functions/create-client \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Example Company",
    "email": "contact@example.com",
    "phone": "+971 50 123 4567",
    "address": "123 Business Street, Dubai",
    "country": "United Arab Emirates",
    "trnNumber": "123456789012345",
    "vatPercentage": "5"
  }'
```

##### JavaScript (Fetch)
```javascript
const createClient = async (clientData) => {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://fordox.netlify.app/.netlify/functions'
    : 'http://localhost:3000/.netlify/functions';

  try {
    const response = await fetch(`${baseUrl}/create-client`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(clientData),
      credentials: 'include'
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create client');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

// Example usage
const clientData = {
  companyName: "Example Company",
  email: "contact@example.com",
  phone: "+971 50 123 4567",
  address: "123 Business Street, Dubai",
  country: "United Arab Emirates",
  trnNumber: "123456789012345",
  vatPercentage: "5"
};

createClient(clientData)
  .then(client => console.log('Client created:', client))
  .catch(error => console.error('Error:', error));
```

## Notes
1. All timestamps are returned in ISO 8601 format
2. The API uses Firebase Firestore with memory caching to avoid IndexedDB issues
3. All requests must include the appropriate CORS headers
4. For UAE clients, both TRN Number and VAT Percentage are required
5. The API validates all required fields before processing requests
6. Search functionality is case-sensitive and matches against company names
7. Pagination is implemented using both offset-based and cursor-based methods

## Troubleshooting CORS Issues

If you encounter CORS errors, check the following:

1. Ensure you're using the correct base URL for your environment
2. Verify that your origin is in the allowed origins list
3. Include the `credentials: 'include'` option in your fetch requests
4. Make sure your server is running and accessible
5. Check that the preflight request (OPTIONS) is being handled correctly

Common CORS Error Solutions:
1. If you see "No 'Access-Control-Allow-Origin' header":
   - Verify your origin is in the allowed list
   - Check that the server is properly configured to handle CORS
2. If you see "Request header field Authorization is not allowed":
   - Add 'Authorization' to the allowed headers list
3. If you see "Method [GET/POST] is not allowed":
   - Verify the method is in the allowed methods list 