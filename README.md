# Online Event Booking & Management System

Welcome to the Online Event Booking & Management System! This is a modern, full-stack application built to facilitate seamless event discovery, secure seat booking, and administrative management.

## 🚀 Features

### For Users
*   **Authentication**: Secure JWT-based User Registration & Login.
*   **Event Catalog**: Browse upcoming events with details like venue, date, time, and pricing.
*   **Interactive Seat Selection**: Visually choose and lock available seats from the event grid.
*   **Bookings**: Secure checkout processing (currently utilizing mock payment states).
*   **User Dashboard**: View historical bookings dynamically rendered with unique QR Codes per ticket.

### For Administrators
*   **Analytics Dashboard**: View aggregate platform statistics such as Total Revenue and Bookings.
*   **Event Management**: Easily trigger the creation of new events (which simultaneously automates seat generation mapping) and delete obsolete events.
*   **Transaction Tracking**: Monitor the global ticket table across the entire platform.

---

## 🛠️ Technology Stack

### Frontend (User Interface)
*   **Framework**: React.js 
*   **Build Tool**: Vite (for lightning-fast compilation)
*   **Router**: React Router DOM (v6)
*   **Styling**: Custom CSS variables, Inter typography, Lucide React Icons
*   **HTTP Client**: Axios (configured with interceptors for global JWT Bearer insertion)
*   **Additions**: `qrcode.react` for dynamic ticket rendering

### Backend (Server)
*   **Framework**: Java Spring Boot (v3+)
*   **Architecture Pattern**: Layered MVC (Controller -> Service -> Repository)
*   **Security**: Spring Security & JSON Web Tokens (io.jsonwebtoken)
*   **ORM**: Spring Data JPA / Hibernate

### Database
*   **Engine**: H2 Database (In-Memory Dialect)
*   **Automation**: Configured on `spring.jpa.hibernate.ddl-auto=create-drop` to guarantee schema setup without manual user intervention.
*   **(Note)**: Readily interchangeable to MySQL by flipping the dependency in the `pom.xml` and un-commenting the MySQL credentials within `application.properties`.

---

## 💻 How to Run Locally

Because the backend utilizes an H2 In-Memory database bundled with a `DataLoader`, the project runs instantly out-of-the-box without requiring complex database configuration.

### 1. Start the Backend (Spring Boot)
1. Open a terminal and navigate to the `backend/` directory.
2. Run the application utilizing the Maven wrapper:
    ```bash
    cd backend
    ./mvnw spring-boot:run
    ```
*(The backend will start on `http://localhost:8080`. The database will automatically populate with dummy Admin, User, and Event data).*

### 2. Start the Frontend (Vite + React)
1. Open a separate terminal window and navigate to the `frontend/` directory.
2. Install the necessary Node dependencies:
    ```bash
    cd frontend
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```
4. Access the application in your browser at `http://localhost:5173`.

---

## 🔑 Reference Credentials

You can use the following default credentials (injected by the backend database loader) to explore the system:

**Administrator Access**
*   **Email:** admin@eventify.com
*   **Password:** admin123

**Normal User Access**
*   **Email:** user@eventify.com
*   **Password:** user123
