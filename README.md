// ===== README.md =====
/*
# Online-Store 🛒

Welcome to **Online-Store**, a full-stack e-commerce web application designed to provide a seamless shopping experience for users. This project allows users to browse products, filter and sort them by categories and price, add items to a cart, place orders, and manage their accounts—all while enjoying a modern and responsive design with support for light and dark themes. Built with a combination of React.js, Node.js, and MongoDB, this application serves as a solid foundation for a scalable online store with plenty of room for future enhancements.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation and Setup](#installation-and-setup)
- [Usage](#usage)

## Features

Online-Store comes packed with features to ensure a smooth and enjoyable shopping experience:

- **Product Browsing**: Users can view a catalog of products with images, titles, prices, and descriptions.
- **Search, Filter, and Sort**: Search for products by name, filter by categories (e.g., clothing, electronics), and sort by price (ascending/descending).
- **Shopping Cart**: Add products to a cart, update quantities, or remove items. A cart popup provides a quick overview of selected items and the total price.
- **Checkout Process**: Place orders by providing delivery details (requires user authentication).
- **User Authentication**: Register, log in, and manage your profile. Password reset functionality is simulated via email using Nodemailer (with potential for full implementation).
- **Theme Support**: Toggle between light and dark themes, with the user's preference saved in local storage.
- **Responsive Design**: Fully adaptive layout for mobile, tablet, and desktop devices.
- **Dynamic Data Loading**: Products, orders, and user data are fetched dynamically via API from a MongoDB database.
- **Admin API Testing**: Use `api.config.js` on the backend to test API endpoints for orders, registration, and product management without the frontend.

## Tech Stack

### Frontend
- **React.js**: A JavaScript library for building dynamic and interactive user interfaces.
- **Next.js**: A React framework for server-side rendering and static site generation (if applicable).
- **Tailwind CSS**: A utility-first CSS framework for rapid and responsive styling.
- **React Router**: Handles client-side navigation between pages.
- **Context API**: Manages global state for cart, authentication, search, and themes.
- **React Icons**: Provides icons for UI elements (e.g., theme toggle with sun/moon icons).
- **CSS Variables**: Used for dynamic theming (light/dark modes).

### Backend
- **Node.js**: A JavaScript runtime for building the server-side application.
- **Express.js**: A web framework for Node.js to create RESTful APIs.
- **MongoDB**: A NoSQL database for storing products, orders, and user data.
- **Nodemailer**: Implements email functionality for password reset simulation.
- **API Configuration**: A dedicated `api.config.js` file for testing backend endpoints.

### Other Tools
- **Git**: Version control for tracking code changes.
- **npm**: Package manager for managing dependencies.

## Project Structure

The project is divided into two main parts: the **Client** (frontend) and the **Server** (backend).
Online-Store/
├── Client/                   # Frontend (React.js/Next.js)
│   ├── app/                  # Source code
│   │   ├── components/       # React components (e.g., Header, Catalog, Cart, ProductPage)
│   │   ├── context/          # Context API files (AuthContext, CartContext, SearchContext, ThemeContext)
│   │   ├── styles/           # CSS files (e.g., app.css with theme variables)
│   │   └── ...               # Other frontend files
│   ├── package.json          # Frontend dependencies
│   └── ...
├── Server/                   # Backend (Node.js/Express.js)
│   ├── index.js              # Main server file
│   ├── routes/               # API routes for products, orders, and users
│   ├── models/               # MongoDB schemas for products, orders, and users
│   ├── package.json          # Backend dependencies
│   └── ...
├── README.md                 # Project documentation
└── ...


### Key Frontend Components
- `Header`: Navigation bar with search, theme toggle, and user authentication links.
- `Catalog`: Displays a list of products with filtering and sorting options.
- `Cart` & `CartPopup`: Manage and display cart contents.
- `ProductPage`: Detailed view of a single product with an "Add to Cart" option.
- `Register` & `Login`: User authentication forms.
- `ThemeContext`: Manages light/dark theme toggling and persistence.

### Backend Overview
- The server uses Express.js to create RESTful APIs for managing products, orders, and users.
- Data is stored in MongoDB, with schemas defined for products, orders, and user accounts.
- Nodemailer is integrated for email-based password reset simulation.
- `api.config.js` allows for testing API endpoints without the frontend.

## Installation and Setup

Follow these steps to set up and run the project locally.

### Prerequisites
- **Node.js** (v14 or higher) installed.
- **npm** (comes with Node.js).
- **MongoDB**: Either a local instance or a cloud-based MongoDB Atlas account.
- A working email service (for Nodemailer, e.g., Gmail SMTP for password reset simulation).

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Harimmatun/Online-Store.git
   cd Online-Store
Set Up the Backend (Server)
Navigate to the Server directory:
bash

cd Server
Install dependencies:
bash

npm install
Configure environment variables:
Create a .env file in the Server directory.
Add the following variables (replace with your own values):
text

PORT=5000
MONGODB_URI=your_mongodb_connection_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password_or_app_specific_password
Start the server:
bash

node index.js
The server will run at http://localhost:5000.
Set Up the Frontend (Client)
Open a new terminal and navigate to the Client directory:
bash

cd Client
Install dependencies:
bash

npm install
Start the development server:
bash

npm run dev
The frontend will run at http://localhost:3000 (or the port specified by Vite/Next.js).
Access the Application
Open your browser and go to http://localhost:3000.
The backend API should be accessible at http://localhost:5000.
Notes
Ensure the MongoDB database is running and the connection string in .env is correct.
For Nodemailer, you may need to enable "Less Secure Apps" in your Gmail account or use an app-specific password.
The application currently runs only on a local Node.js server.
