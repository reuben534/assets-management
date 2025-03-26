# Asset Management System Documentation

## Overview
The Asset Management System is a MERN-stack application for managing company assets, supporting **Admin** and **Employee** roles.

### Purpose
- Streamline asset tracking and allocation.
- Provide Admins with comprehensive management tools.
- Enable Employees to request and track assets.

### Scope
- Admin: Asset CRUD, user management, request handling, reporting/analytics.
- Employee: View assets, request assets, track activity.
- Database: MongoDB with collections for Assets, Users, Requests, etc.

## System Architecture
- **Frontend**: React + Bootstrap.
- **Backend**: Node.js + Express.js (REST API).
- **Database**: MongoDB.
- **Architecture**: MVC.

## Database Schema
### Assets
- `AssetID` (ObjectId)
- `Name` (String, required)
- `Description` (String)
- `PurchaseDate` (DateTime, required)
- `WarrantyDate` (DateTime)
- `LocationID` (ObjectId, ref: Locations)
- `CategoryID` (ObjectId, ref: Categories)
- `SupplierID` (ObjectId, ref: Suppliers)
- `Status` (Enum: "Available", "Assigned", "Under Maintenance")
- `AddedDate` (DateTime, default: now)

### Users
- `UserID` (ObjectId)
- `Name` (String, required)
- `Email` (String, unique, required)
- `PasswordHash` (String, required)
- `Role` (Enum: "Admin", "User")

### Requests
- `RequestID` (ObjectId)
- `UserID` (ObjectId, ref: Users)
- `AssetID` (ObjectId, ref: Assets)
- `RequestDate` (DateTime, default: now)
- `Status` (Enum: "Pending", "Approved", "Rejected")

### Reports
- `ReportID` (ObjectId)
- `GeneratedBy` (ObjectId, ref: Users)
- `GeneratedDate` (DateTime, default: now)
- `Content` (String/JSON)

## Features
### Admin
- **Asset Management**: CRUD operations, assign assets.
- **User Management**: Add/edit/delete users.
- **Request Handling**: Approve/reject requests.
- **Reports**: Generate asset usage/request history, export as PDF/CSV.
- **Analytics**: Dashboard with charts (e.g., asset status).

### Employee
- **View Assets**: Browse available assets.
- **Request Assets**: Submit requests.
- **Activity**: View request history and assigned assets.

## API Endpoints
- **Auth**: `POST /api/auth/login`, `POST /api/auth/register`
- **Assets**: `GET/POST/PUT/DELETE /api/assets(/:id)`
- **Users**: `GET/POST/PUT/DELETE /api/users(/:id)`
- **Requests**: `GET/POST/PUT /api/requests(/:id)`
- **Reports**: `GET/POST /api/reports`

## Non-Functional Requirements
- **Performance**: Page load < 2s.
- **Scalability**: Supports 1,000 users, 10,000 assets.
- **Security**: HTTPS, JWT, role-based access.
- **Usability**: Responsive design with Bootstrap.

## Development Milestones
1. Setup MERN stack and auth (Weeks 1-2).
2. Admin features (Weeks 3-4).
3. Employee features (Weeks 5-6).
4. Reporting/analytics (Week 7).
5. Testing/deployment (Week 8).