# Asset Management System

The **Asset Management System** is a web-based application designed to streamline the tracking, allocation, and reporting of company assets. Built using the MERN stack (MongoDB, Express.js, React, Node.js) with Bootstrap for a responsive UI, it follows the MVC architecture. The system supports two user roles: **Admin** and **Employee**, each with tailored functionalities for efficient asset management.

## Purpose
- Enable efficient management of company assets.
- Provide Admins with tools to manage assets, users, requests, and generate reports/analytics.
- Allow Employees to view available assets, request assets, and track their activity.

## Features
### Admin
- **Asset Management**: Add, edit, delete, and assign assets.
- **User Management**: CRUD operations for users (Admins and Employees).
- **Request Handling**: Approve or reject asset requests.
- **Reports**: Generate and export reports (e.g., asset usage, request history) as PDF/CSV.
- **Analytics**: Dashboard with insights (e.g., asset status, request trends).

### Employee
- **View Assets**: Browse available assets with filters.
- **Request Assets**: Submit requests for available assets.
- **Activity Tracking**: View request history and assigned assets.

## Technology Stack
- **Frontend**: React with Bootstrap (responsive UI).
- **Backend**: Node.js with Express.js (RESTful API).
- **Database**: MongoDB (NoSQL).
- **Architecture**: MVC (Model-View-Controller).

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)
- npm (Node Package Manager)
