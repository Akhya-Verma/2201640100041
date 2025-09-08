# URL Shortener Microservice - Design Document

## 1. Introduction

This document describes the architecture, design decisions, and implementation details of the URL Shortener Microservice built with **Node.js**, **Express**, and **MongoDB**.  
The system supports short URL generation, redirection, expiry handling, logging, and analytics as required in the Affordmed Campus Hiring Evaluation.

---

## 2. Architecture Overview

- **Frontend (Optional)**: A React-based UI (not mandatory for backend evaluation).
- **Backend**: Node.js with Express microservice.
- **Database**: MongoDB for storing URLs, expiry metadata, and click analytics.
- **Middleware**: Custom logging middleware for request logging.

**Architecture Diagram (Conceptual):**

```
Client ---> Express Server ---> MongoDB
         |       |
         |       ---> Logger Middleware
         ---> Routes (Shorten, Redirect, Stats)
```

---

## 3. Data Model

### URL Schema

```json
{
  "urlCode": "abcd1",
  "longUrl": "https://example.com",
  "shortUrl": "http://localhost:3000/abcd1",
  "expiry": "2025-09-08T09:10:00.000Z",
  "clicks": [
    {
      "timestamp": "2025-09-08T08:50:00.000Z",
      "referrer": "direct",
      "geo": "unknown"
    }
  ],
  "createdAt": "2025-09-08T08:45:00.000Z"
}
```

---

## 4. API Endpoints

### 1. Create Short URL

- **Method**: `POST`
- **Route**: `/api/url/shorten`
- **Body**:

```json
{
  "longUrl": "https://example.com",
  "validity": 30,
  "shortcode": "abcd1"
}
```

- **Response**:

```json
{
  "shortLink": "http://localhost:3000/abcd1",
  "expiry": "2025-09-08T09:10:00.000Z"
}
```

### 2. Redirect to Original URL

- **Method**: `GET`
- **Route**: `/:code`
- **Response**: Redirects to `longUrl`.
- **Errors**: `404` if not found, `410` if expired.

### 3. Retrieve Statistics

- **Method**: `GET`
- **Route**: `/api/url/stats/:code`
- **Response**:

```json
{
  "longUrl": "https://example.com",
  "shortUrl": "http://localhost:3000/abcd1",
  "createdAt": "2025-09-08T08:45:00.000Z",
  "expiry": "2025-09-08T09:15:00.000Z",
  "totalClicks": 1,
  "clickDetails": [
    {
      "timestamp": "2025-09-08T08:50:00.000Z",
      "referrer": "direct",
      "geo": "unknown"
    }
  ]
}
```

---

## 5. Key Features

1. **Logging Middleware**

   - Custom logger captures timestamp, HTTP method, URL, status, and response time.
   - Logs are persisted in a file (`logs/requests.log`).

2. **Short Link Expiry**

   - Default expiry is **30 minutes** if not specified.
   - Expired links return `410 Gone`.

3. **Custom Shortcodes**

   - Users may provide a custom shortcode.
   - If unavailable, service generates a new one.

4. **Analytics**

   - Tracks total clicks, timestamp, referrer, and geo (mocked as `unknown`).

5. **Error Handling**
   - Returns descriptive JSON error responses with appropriate HTTP status codes.

---

## 6. Assumptions

- APIs are pre-authorized (no authentication required).
- Geo-location is mocked as `"unknown"` (can be extended with an IP-to-geo service).
- Logs are file-based, not centralized (for simplicity).
- Single-node deployment assumed.

---

## 7. Future Enhancements

- Add authentication/authorization with JWT.
- Integrate IP-to-geo lookup for accurate analytics.
- Provide dashboard UI (React + Chart.js/Recharts).
- Add caching (Redis) for frequently accessed URLs.
- Deploy with Docker and Kubernetes for scalability.

---

## 8. Conclusion

This design ensures a **robust, scalable, and production-ready URL Shortener Microservice** that meets all requirements of the Affordmed evaluation, including logging, expiry handling, analytics, and error management.
