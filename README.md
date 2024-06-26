

# GourmetTrack: Online Food Order Management System

## Introduction

GourmetTrack is an Online Food Order Management System developed to streamline the process of ordering and managing food orders within an organization. The system provides an efficient and user-friendly platform for users to place orders and for administrators to manage orders, vendors, and users effectively.

## Features

### User Features
- User login and authentication.
- Place food orders based on vendor and food category.
- View order history and current order status.

### Admin Features
- Admin login and authentication.
- Register new users and assign roles.
- Manage vendor information and upload vendor charts.
- Approve or reject user orders.
- View and manage all orders.

## Technologies Used

- **Frontend**: React JS, Tailwind CSS, Vite
- **Backend**: ASP.NET
- **Database**: SQL Server
- **Development Tools**: Visual Studio, Visual Studio Code
- **API Documentation**: Swagger

## System Architecture

The system is designed using a three-tier architecture, consisting of the following layers:

1. **Presentation Layer**: Developed using React JS and Tailwind CSS for a responsive and interactive user interface.
2. **Business Logic Layer**: Implemented using ASP.NET to handle the application logic and processing.
3. **Data Access Layer**: Utilizes SQL Server to store and manage data securely.

## Database Schema

The database schema consists of the following tables:

- **Users**: Stores user information and roles.
- **Orders**: Stores order details, including order status and timestamps.
- **Vendors**: Stores vendor information and available food items.

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/torichoudhury/GourmetTrack.git
   
2. **Download Dependancies in VS Code**
   - "axios": "^1.7.2",
   - "datepicker": "^0.0.0",
   - "react": "^18.2.0",
   - "react-datepicker": "^6.9.0",
   - "react-dom": "^18.2.0",
   - "react-google-charts": "^4.0.1",
   - "react-router-dom": "^6.23.1"
    
3. ASP.NET was used for API and backend, run it in Visual Studios.

If you encounter any issues or have suggestions, feel free to open an issue on GitHub.
Thank you 
