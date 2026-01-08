SokoSync - Frontend

Overview

SokoSync is an intuitive inventory management web application designed for micro-SMEs in Kenya. This is the Frontend of the application, built with React.js and Tailwind CSS. It provides a user-friendly interface for shop owners to manage stock, record sales, and view business analytics, focusing on accessibility and ease of use.

Key Features

Intuitive Design: Clean, easy-to-understand interface suitable for users with varying levels of digital literacy.

Real-Time Dashboard: Visualizes daily revenue, units sold, and automated low-stock alerts.

Inventory Management: Simple Add, Edit, and Delete workflows for products with clear stock indicators.

Point of Sale (POS): "Record Sale" interface with a live receipt preview for instant transaction feedback.

Customer Directory: Manage customer contact details and view purchase history.

Transaction History: View a complete, searchable log of all past sales.

Responsive Layout: Optimized for both desktop and mobile devices, ensuring usability anywhere.

Tech Stack

Framework: React (Vite)

Styling: Tailwind CSS

Icons: Lucide React

State Management: React Hooks (useState, useEffect)

Routing: React Router DOM

Getting Started

Prerequisites

Node.js (v16 or higher)

npm (Node Package Manager)

Installation

Clone the repository:

git clone [https://github.com/ptrkn/sokosync-frontend.git](https://github.com/ptrkn/sokosync-frontend.git)
cd sokosync-frontend


Install dependencies:

npm install


Start the development server:

npm run dev


Open in Browser:
Navigate to http://localhost:5173 to see the app running locally.

Project Structure

src/
├── components/       # Reusable UI components (Layout, Sidebar, Modals, ProtectedRoute)
├── pages/            # Main application pages (Dashboard, Inventory, Sales, Customers, Transactions)
├── App.jsx           # Main routing configuration
├── index.css         # Tailwind directives and global styles
└── main.jsx          # Application entry point


Backend Connection

This frontend connects to the SokoSync Backend API. Ensure your backend server is running on http://localhost:5000 (for local development) or update the fetch URLs in the API calls to point to your deployed backend address.
