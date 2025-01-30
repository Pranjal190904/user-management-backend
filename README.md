# User Management Platform API Documentation
### API Documentation URL
https://documenter.getpostman.com/view/30674505/2sAYX2N4R5

## Introduction
This project is a User Management System with an Admin Panel, providing features such as user authentication, profile management, and notifications. Users can update their profiles and receive notifications based on their availability, while the admin can send critical and non-critical notifications.

## Authentication
### 1. Register
- **Route:** `POST /api/auth/register`
- **Controller:** `auth.controller.register`
- **Description:** Allows a user to register using their email and password.

### Request Body

```json
{
    "email" : "vprranjal89@gmail.com",
    "password" : "Hello@123"
}
```

This JSON object contains the `email` and `password` fields.

### Response Body (Successful Register)

```json
{
    "success": true,
    "message": "User Registered Successfully"
}
```

In this case, the server responds with a success message.

### Response Body (Failed Register)

```json
{
    "success": false,
    "message": "User Already Exist"
}
```

If the email already registered, the server responds with an error message indicating "User Already Exist".

### 2. Login
- **Route:** `POST /api/auth/login`
- **Controller:** `auth.controller.login`
- **Description:** Allows a user to log in using their email and password. Returns an access token upon successful login.

### Request Body

```json
{
    "email" : "vprranjal89@gmail.com",
    "password" : "Hello@123"
}
```

This JSON object contains the `email` and `password` fields.

### Response Body (Successful Login)

```json
{
    "success": true,
    "message": "Login Successful",
    "data": { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3OWI3NzhmYWUxNjFjOTliY2VmNWVlOCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzM4MjQ1OTEwLCJleHAiOjE3MzgzMzIzMTB9.okRu3BX-aABWBdkpaMQYIM1bQzZHvGk4tMSYT2ObutQ"}
}
```

In this case, the server responds with a success message and the access token.

### Response Body (Failed Login)

```json
{
    "success": false,
    "message": "Invalid Credentials"
}
```

If the login attempt fails (e.g., due to incorrect password), the server responds with an error message indicating "Invalid Credentials".

## User

### 3. Update Profile
- **Route:** `PUT /api/user/profile`
- **Middleware:** `auth`
- **Controller:** `user.controller.updateProfile`
- **Description:** Update Profile data for the logged-in student.

Access Token in Cookies or authorization header is required for authentication
**Request Body:** 
```json
{
    "name":"Pranjal",
    "mobileNumber":"7455678924",
    "bio":"Hello, I am a backend developer.",
    "availabilityTime":[
        {"start":"9:00", "end":"13:30"},
        {"start":"15:30", "end":"20:15"}
        ]
}
```

**Response Body:**
```json
{
    "success": true,
    "message": "Profile Updated Successfully",
    "data": {
        "_id": "679b778fae161c99bcef5ee8",
        "email": "vpranjal89@gmail.com",
        "password": "$2b$10$ZD/hGJecOwTpFlC5F9IYROm/HCt5abpoHkYqE1GW3cZuXkoivMBBS",
        "role": "user",
        "availabilityTime": [
            {
                "start": "9:00",
                "end": "13:30",
                "_id": "679b8a6bb462d8d607dd1b05"
            },
            {
                "start": "15:30",
                "end": "20:15",
                "_id": "679b8a6bb462d8d607dd1b06"
            }
        ],
        "__v": 0,
        "bio": "Hello, I am a backend developer.",
        "mobileNumber": "7455678924",
        "name": "Pranjal"
    }
}
```

### 4. Send Notification
- **Route:** `POST /api/user/send-notification`
- **Middleware:** `auth`
- **Controller:** `user.controller.sendNotification`
- **Description:**  Sends a brief text message to the recipients in his avalability time with timestamp.

Access Token in Cookies or authorization header is required for authentication
**Request Body:** 
```json
{
    "recipients":["679b8b37b462d8d607dd1b0e"],
    "message":"hello, welcome to user management"
}
```

**Response Body:**
```json
{
    "success": true,
    "message": "Notification Sent"
}
```

## Admin

### 5. Send Notification
- **Route:** `POST /api/admin/send-notification`
- **Middleware:** `auth`
- **Controller:** `admin.controller.sendNotification`
- **Description:**  Sends a brief text message to the recipients in his avalability time and sends immediately if notification type is critical with timestamp. User role must be admin to send critical notification irrespective of availability time of recipients.

Access Token in Cookies or authorization header is required for authentication.
**Request Body:** 
```json
{
    "recipients":["679b8b37b462d8d607dd1b0e"],
    "message":"hello, welcome to user management"
}
```

**Response Body:**
```json
{
    "success": true,
    "message": "Notification Sent"
}
```

## Notification Socket

### userConnected Event
UserId must be passed to connect to the notification socket and get real time notifications.
A room is created with user's id name.

### recieveNotification Event
Real time Notifications are recieved if the current time is between user's availability time. 
User can also get notification out of availability time if the notification in sent by admin and type of notification is critical.
User gets pending notifications when he is available.

### A cron job is running on server every minute for sending pending notifications to users.
