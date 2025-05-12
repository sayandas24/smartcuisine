# SmartCuisine - Restaurant Management System

A complete restaurant management system that enables customers to scan QR codes to view menus, place orders, and track their food status. The platform includes a robust admin dashboard for restaurant management.

**Live Demo:** [https://smartcuisine.vercel.app](https://smartcuisine.vercel.app)

## Features

### Customer Features
- **QR Code Scanning:** Access restaurant menu by scanning a QR code
- **Digital Menu:** Browse complete menu with images and descriptions
- **User Accounts:** Create and manage personal accounts
- **Order Tracking:** Real-time tracking of order status
- **Order History:** View past orders and reorder favorites
- **Responsive Design:** Seamless experience across all devices

### Admin Features
- **User Management:** Add, remove, and manage customer accounts
- **Order Management:** View all orders and update status (pending → processing → completed/cancelled)
- **Menu Management:** Add, update, and remove menu categories and items
- **Dashboard:** Track sales, popular items, and other business analytics
- **QR Code Generation:** Create and manage QR codes for tables

## Tech Stack

- **Frontend:** Next.js, React
- **Backend:** Node.js, Express.js
- **Database:** MongoDB / MySQL
- **Styling:** Tailwind CSS / CSS Modules
- **Authentication:** JWT

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A database (MySQL)

### Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/sayandas24/restaurant-project.git
   cd restaurant-project
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file based on the `.env.example` template

4. **Run the Development Server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser
