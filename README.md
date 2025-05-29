# E-Commerce Order Management and Real-time Tracking Platform

## Overview

This project is a full-stack e-commerce platform focused on efficient order management and providing customers with real-time tracking capabilities. It features distinct dashboards for different user roles: Customers, Vendors, and Delivery Partners, each tailored to their specific interactions within the order fulfillment process. The platform leverages modern web technologies to deliver a seamless and responsive user experience.

## Key Features

* **User Authentication:** Secure signup and login functionality for Customers, Vendors, and Delivery Partners using JWT (JSON Web Tokens).
* **Customer Dashboard:**
    * View a history of placed orders.
    * Track the real-time location of their assigned delivery partner on a map for ongoing orders.
* **Vendor Dashboard:**
    * View all orders placed for their products.
    * Assign delivery partners to orders.
* **Delivery Partner Dashboard:**
    * View orders assigned to them.
    * Update the status of the orders they are handling.
    * (Simulated) Broadcast their location in real-time for customer tracking.
* **Real-time Order Tracking:** Customers can track the (simulated) real-time location of their delivery partner on an interactive map using WebSockets (Socket.IO) and a mapping library (Leaflet/React-Leaflet).
* **RESTful API:** A backend API built with Express.js handles data fetching and manipulation for the frontend.

## Technologies Used

* **Frontend:**
    * [Next.js](https://nextjs.org/) (React framework for server-side rendering and routing)
    * [React](https://react.dev/) (JavaScript library for building user interfaces)
    * [Tailwind CSS](https://tailwindcss.com/) (Utility-first CSS framework for styling)
    * [Axios](https://axios-http.com/) (Promise-based HTTP client)
    * [socket.io-client](https://socket.io/docs/v4/client-api/) (Socket.IO client for real-time communication)
    * [leaflet](https://leafletjs.com/) / [react-leaflet](https://react-leaflet.js.org/) (JavaScript library for interactive maps in the browser)
    * [jwt-decode](https://www.npmjs.com/package/jwt-decode) (For decoding JWT tokens on the client-side)
* **Backend:**
    * [Node.js](https://nodejs.org/en/) (JavaScript runtime environment)
    * [Express.js](https://expressjs.com/) (Minimalist Node.js web application framework)
    * [Mongoose](https://mongoosejs.com/) (MongoDB object modeling tool)
    * [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) (For generating and verifying JWT tokens)
    * [bcryptjs](https://www.npmjs.com/package/bcryptjs) (For password hashing)
    * [dotenv](https://www.npmjs.com/package/dotenv) (For loading environment variables)
    * [socket.io](https://socket.io/) (Socket.IO for real-time, bi-directional communication)
* **Database:**
    * [MongoDB](https://www.mongodb.com/) (NoSQL database)

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Pragyat-Nikunj/TrackSwift
    cd TrackSwift
    ```

2.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Configure backend environment variables:**
    * Create a `.env` file in the `backend` directory.
    * Add the following (replace with your actual values):
        ```
        PORT=5000
        MONGODB_URI=<your_mongodb_connection_string>
        JWT_SECRET=<your_secret_jwt_key>
        JWT_EXPIRES_IN=7d
        DB_NAME=<your_db_name>
        CORS_ORIGIN=*
        SOCKET_ORIGIN=http://localhost:3000
        ```

4.  **Run the backend server:**
    ```bash
    npm run dev
    ```

5.  **Install frontend dependencies:**
    ```bash
    cd ../client 
    npm install
    ```

6.  **Run the frontend development server:**
    ```bash
    npm run dev

    ```

    The frontend should be accessible at `http://localhost:3000` (or another port if specified).

## API Endpoints

*(A summary of the key API endpoints)*

* `POST /api/auth/signup`: Register a new user.
* `POST /api/auth/login`: Log in an existing user and receive a JWT token.
* `GET /api/customer/orders`: Get all orders for the authenticated customer.
* `GET /api/customer/orders/:id`: Get details for a specific customer order.
* `GET /api/customer/orders/:id/track`: Get the latest (simulated) location for a specific customer order.
* `POST /api/customer/orders`: Place a new order.
* `GET /api/vendor/orders`: Get all orders for the authenticated vendor.
* `PATCH /api/delivery/orders/:id/status`: Update the status of a delivery order.
* `GET /api/delivery/orders`: Get all orders assigned to the authenticated delivery partner.

## Real-time Tracking (Socket.IO)

The platform utilizes Socket.IO for real-time communication to facilitate order tracking.

* **Client Connection (`utils/socket.ts`):** The frontend establishes a WebSocket connection to the server.
* **Joining Order Room:** When a customer views the tracking page for a specific order, the client emits a `join-order` event with the `orderId`.
* **Location Updates:** The backend (simulates) sending `location-update` events to all clients in the specific order's room. The frontend listens for these events and updates the map.

**Note:** For this demonstration, the delivery partner's location updates are simulated on the backend. In a production application, this would involve real GPS data from the delivery partner's device. Authentication for Socket.IO connections has been simplified for this MVP to focus on the real-time tracking functionality.

## Future Enhancements

* Implement actual GPS tracking for delivery partners.
* Add more detailed order management features for vendors (e.g., updating order items, marking as shipped).
* Enhance the customer order details view.
* Implement proper error handling and user feedback mechanisms.
* Add unit and integration tests.
* Secure WebSocket connections with JWT authentication.

