# CRM System

A full-stack Customer Relationship Management (CRM) system designed to streamline customer interactions and management.

## Project Overview

This CRM system provides a comprehensive solution for managing customer relationships with a user-friendly interface and robust backend. The system allows businesses to track customer information, monitor customer status, and analyze customer data for informed decision-making.

## Features

- **Secure Authentication:** User registration and login system with proper validation
- **Dashboard:** Overview of customer metrics and statistics
- **Customer Management:** Add, view, edit, and delete customer records
- **Status Tracking:** Monitor customer status (Active/Inactive)
- **Responsive Design:** Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend
- React.js
- TailwindCSS
- ShadcnUI Components
- React Query for state management
- React Hook Form for form handling
- Zod for validation

### Backend
- Express.js
- MySQL database
- Drizzle ORM
- Passport.js for authentication
- Express Session for session management

## Project Structure

```
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility functions and helpers
│   │   ├── pages/             # Page components
│   │   └── App.tsx            # Main application component
├── server/                    # Backend Express application
│   ├── auth.ts                # Authentication logic
│   ├── db.ts                  # Database connection
│   ├── routes.ts              # API routes
│   ├── storage.ts             # Data storage interface
│   └── index.ts               # Server entry point
├── shared/                    # Shared code between client and server
│   └── schema.ts              # Database schema and types
└── package.json               # Project dependencies and scripts
```

## Installation and Setup

### Prerequisites
- Node.js (v18 or newer)
- MySQL database

### Installation Steps

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd crm-system
   ```

2. Install dependencies:
   ```bash
   npm install
   npm install mysql2 drizzle-orm-mysql express-mysql-session
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=crmuser
   DB_PASSWORD=yourpassword
   DB_DATABASE=crmdb
   SESSION_SECRET=yoursecretkey
   ```

4. Push database schema:
   ```bash
   npm run db:push
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Access the application at `http://localhost:5000`

## Usage Guide

### Authentication
- Register a new account with your name, username, and password
- Log in with your credentials

### Customer Management
- View all customers on the dashboard
- Add new customers using the "Add Customer" button
- Edit customer details by clicking on a customer record
- Delete customers with the delete button

### Customer Status
- Toggle customer status between Active and Inactive
- Filter customers by status using the filter dropdown

## Deployment

The application can be deployed to various platforms:

1. **Vercel/Netlify**: For frontend deployment
2. **Heroku/Railway**: For backend services
3. **PlanetScale/AWS RDS**: For MySQL database

## Future Enhancements

- Advanced search and filtering capabilities
- Email integration for customer communication
- Task management for customer follow-ups
- Advanced analytics and reporting
- User roles and permissions

## Project Presentation Tips

When presenting this project to faculty or peers:

1. **Introduction**:
   - Explain the purpose and value of a CRM system
   - Highlight the key features of your implementation

2. **Technical Architecture**:
   - Discuss the frontend-backend separation
   - Explain the database schema design
   - Highlight the security features (authentication, data validation)

3. **Live Demo**:
   - Register a new user account
   - Add and manage customer records
   - Show the responsive design on different screen sizes

4. **Code Walkthrough**:
   - Explain key components like authentication flow
   - Show how the database is structured
   - Discuss form validation and error handling

5. **Learning Outcomes**:
   - Discuss challenges encountered and solutions implemented
   - Explain technical decisions and trade-offs
   - Share insights gained from building a full-stack application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Created by [Your Name] for educational purposes.