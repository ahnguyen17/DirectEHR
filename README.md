# Electronic Health Record (EHR) Application

A modern EHR application built with React and Tailwind CSS to manage patients, notes, vitals, and orders.

## Features

- Patient management
- Medical notes
- Vitals tracking with trends
- Order management (labs, imaging, medications, etc.)
- Diagnostics and lab results tracking
- Server-side data persistence with a backend API
- Responsive design for desktop and mobile

## Technologies Used

- React
- React Router
- Tailwind CSS
- Context API for state management
- Express.js for the backend API
- Heroicons

## Installation

### Frontend

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

### Backend

1. Navigate to the server directory:
   ```
   cd server
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Initialize the data files with default data (optional):
   ```
   node initData.js
   ```
4. Start the server:
   ```
   npm run dev
   ```

## Usage

### Patient Management
- View list of patients
- Add new patients
- View detailed patient information
- Record patient vitals
- Add notes to patient records
- Create orders for patients

### Medical Notes
- Create detailed clinical notes
- Associate notes with patients
- Search and filter notes

### Vitals Tracking
- Record vital signs (BP, pulse, temperature, etc.)
- View vital trends over time
- Identify abnormal vitals with visual indicators

### Order Management
- Create lab, imaging, and medication orders
- Track order status
- View order history

## Development

This project uses Vite for fast development. To start the development server:

```
npm run dev
```

To build for production:

```
npm run build
```

## License

This project is for demonstration purposes only.