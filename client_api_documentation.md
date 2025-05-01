# Client Creation API Documentation

## Overview
This API endpoint allows you to create a new client in the Fordox system. The endpoint handles validation, data persistence, and special requirements for UAE-based clients.

## Base URLs
```
Production: https://fordox.netlify.app
Development: http://localhost:3000
```

## Endpoint
```
POST /api/clients
```

## Authentication
Currently, no authentication is required for this endpoint.

## Request

### Headers
```
Content-Type: application/json
```

### Request Body
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

### Field Descriptions
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| companyName | string | Yes | Company or business name |
| email | string | Yes | Valid email address |
| phone | string | Yes | Phone number with country code |
| address | string | Yes | Complete street address |
| country | string | Yes | Country name |
| trnNumber | string | For UAE | Tax Registration Number (TRN) |
| vatPercentage | string | For UAE | VAT percentage (default: "5") |

### Special Requirements for UAE Clients
If the country is "United Arab Emirates", the following additional fields are required:
- `trnNumber`: Must be provided
- `vatPercentage`: Must be a valid number

## Response

### Success Response (201 Created)
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
  "createdAt": "timestamp"
}
```

### Error Responses

#### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "details": {
    "companyName": "Company name is required",
    "email": "Email is required",
    "phone": "Phone is required",
    "address": "Address is required",
    "country": "Country is required"
  }
}
```

#### 400 Bad Request (Invalid Email)
```json
{
  "error": "Invalid email format"
}
```

#### 400 Bad Request (UAE Validation)
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
or
```json
{
  "error": "VAT Percentage must be a number"
}
```

#### 500 Internal Server Error
```json
{
  "error": "Failed to create client",
  "details": "Error message"
}
```

## Example Usage

### cURL
```bash
# Production
curl -X POST https://fordox.netlify.app/api/clients \
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
curl -X POST http://localhost:3000/api/clients \
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

### JavaScript (Fetch)
```javascript
const createClient = async (clientData) => {
  // Use the appropriate base URL based on environment
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://fordox.netlify.app'
    : 'http://localhost:3000';

  try {
    const response = await fetch(`${baseUrl}/api/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(clientData),
      credentials: 'include' // Important for CORS with credentials
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

### Python (Requests)
```python
import requests
import json
import os

def create_client(client_data):
    # Use the appropriate base URL based on environment
    base_url = 'https://fordox.netlify.app' if os.getenv('NODE_ENV') == 'production' else 'http://localhost:3000'
    url = f"{base_url}/api/clients"
    
    headers = {
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.post(url, headers=headers, json=client_data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error creating client: {e}")
        raise

# Example usage
client_data = {
    "companyName": "Example Company",
    "email": "contact@example.com",
    "phone": "+971 50 123 4567",
    "address": "123 Business Street, Dubai",
    "country": "United Arab Emirates",
    "trnNumber": "123456789012345",
    "vatPercentage": "5"
}

try:
    result = create_client(client_data)
    print("Client created:", result)
except Exception as e:
    print("Error:", e)
```

## Notes
1. All timestamps are returned in ISO 8601 format
2. The API supports CORS for the following origins:
   - https://fodox.netlify.app
   - https://fordox.netlify.app
   - http://localhost:3000
   - http://localhost:5000
   - http://localhost:8082
3. The API has a request body size limit of 50MB
4. For UAE clients, the VAT percentage defaults to "5" if not specified

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
3. If you see "Method POST is not allowed":
   - Verify 'POST' is in the allowed methods list 