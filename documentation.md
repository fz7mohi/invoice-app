# Fortune Giftz API Documentation

## Quote API

### 1. Create Quote
#### Endpoint
```
POST https://fordox.netlify.app/.netlify/functions/create-quote
```

#### Headers
```
Content-Type: application/json
Accept: application/json
```

#### Request Body
```json
{
  "clientId": "string",          // Required: ID of the client
  "quoteNumber": "string",       // Required: Unique quote number
  "quoteDate": "string",         // Required: Date in ISO format
  "validUntil": "string",        // Required: Expiry date in ISO format
  "items": [                     // Required: Array of quote items
    {
      "productId": "string",     // Required: ID of the product
      "quantity": number,        // Required: Quantity of the product
      "unitPrice": number,       // Required: Price per unit
      "description": "string",   // Optional: Additional description
      "discount": number         // Optional: Discount percentage
    }
  ],
  "subtotal": number,            // Required: Total before tax
  "taxAmount": number,           // Required: Tax amount
  "total": number,               // Required: Final total
  "notes": "string",             // Optional: Additional notes
  "terms": "string",             // Optional: Terms and conditions
  "status": "string"             // Required: Status (e.g., "draft", "sent", "accepted", "rejected")
}
```

#### Response

##### Success (201 Created)
```json
{
  "id": "string",                // Quote ID
  "clientId": "string",          // Client ID
  "quoteNumber": "string",       // Quote number
  "quoteDate": "string",         // Quote date
  "validUntil": "string",        // Valid until date
  "items": [                     // Quote items
    {
      "productId": "string",
      "quantity": number,
      "unitPrice": number,
      "description": "string",
      "discount": number
    }
  ],
  "subtotal": number,
  "taxAmount": number,
  "total": number,
  "notes": "string",
  "terms": "string",
  "status": "string",
  "createdAt": "string"          // Creation timestamp
}
```

### 2. Get Quotes
#### Endpoint
```
GET https://fordox.netlify.app/.netlify/functions/get-quotes
```

#### Query Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| clientId | string | No | - | Filter quotes by client ID |
| status | string | No | - | Filter quotes by status |
| page | number | No | 1 | Page number for pagination |
| itemsPerPage | number | No | 10 | Number of items per page |
| lastDocId | string | No | - | ID of the last document for cursor-based pagination |

#### Response

##### Success (200 OK)
```json
{
  "quotes": [                    // Array of quotes
    {
      "id": "string",           // Quote ID
      "clientId": "string",     // Client ID
      "quoteNumber": "string",  // Quote number
      "quoteDate": "string",    // Quote date
      "validUntil": "string",   // Valid until date
      "items": [                // Quote items
        {
          "productId": "string",
          "quantity": number,
          "unitPrice": number,
          "description": "string",
          "discount": number
        }
      ],
      "subtotal": number,
      "taxAmount": number,
      "total": number,
      "notes": "string",
      "terms": "string",
      "status": "string",
      "createdAt": "string"     // Creation timestamp
    }
  ],
  "totalQuotes": number,        // Total number of quotes
  "currentPage": number,        // Current page number
  "itemsPerPage": number,       // Number of items per page
  "hasMore": boolean           // Whether there are more quotes to load
}
```

#### Error Responses

##### 400 Bad Request
```json
{
  "error": "Missing required fields",
  "details": ["field1", "field2"]
}
```

##### 404 Not Found
```json
{
  "error": "Client not found"
}
```

##### 405 Method Not Allowed
```json
{
  "error": "Method not allowed"
}
```

##### 500 Internal Server Error
```json
{
  "error": "Failed to fetch quotes",
  "details": "Error message"
}
```

### Example Usage

```javascript
// Frontend code example for creating a quote
const createQuote = async (quoteData) => {
  try {
    const response = await fetch('https://fordox.netlify.app/.netlify/functions/create-quote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(quoteData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating quote:', error);
    throw error;
  }
};

// Frontend code example for getting quotes
const getQuotes = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`https://fordox.netlify.app/.netlify/functions/get-quotes?${queryString}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

// Example usage
const fetchQuotes = async () => {
  // Get all quotes
  const allQuotes = await getQuotes();
  
  // Get quotes for a specific client
  const clientQuotes = await getQuotes({ clientId: 'client123' });
  
  // Get quotes by status with pagination
  const draftQuotes = await getQuotes({ 
    status: 'draft',
    page: 1,
    itemsPerPage: 20
  });
};
```

### Notes

1. The API uses Firebase Firestore for data storage
2. All dates should be in ISO 8601 format
3. The quote number should be unique
4. Tax calculations should be done on the client side
5. The API validates all required fields before creating the quote
6. The API checks if the client exists before creating the quote
7. Quotes are sorted by creation date (newest first)
8. Pagination is supported for both offset-based and cursor-based navigation

### Error Handling

The API includes comprehensive error handling for:
- Missing required fields
- Invalid data types
- Non-existent clients
- Database errors
- Network timeouts
- Invalid query parameters

### Security

1. The API is protected by CORS and only accepts requests from authorized domains
2. All data is validated before being stored
3. The API uses Firebase security rules for additional protection
4. CORS is configured for both production and development environments

### Rate Limiting

The API is subject to Netlify's rate limits:
- 125,000 requests per day
- 10,000 requests per hour
- 1,000 requests per minute

### Support

For API support or to report issues, please contact:
- Email: support@fortunegiftz.com
- Website: https://fortunegiftz.com/support 