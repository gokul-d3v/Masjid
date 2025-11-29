# Full-Stack React + Node.js Application

This is a full-stack application with a React frontend and Node.js backend, featuring a modern UI built with shadcn/ui components.

## Project Structure

```
my-fullstack-app/
├── backend/
│   ├── server.js          # Express server with API routes
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
└── frontend/
    ├── src/
    │   ├── components/    # React components
    │   │   └── ui/        # shadcn/ui components
    │   ├── services/      # API service layer
    │   └── lib/           # Utility functions
    ├── package.json       # Frontend dependencies
    ├── vite.config.ts     # Vite configuration
    └── tailwind.config.js # Tailwind CSS configuration
```

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
```bash
cd my-fullstack-app/backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd my-fullstack-app/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and will proxy API requests to the backend.

## Features

- **Modern UI**: Built with shadcn/ui components
- **Responsive Design**: Works on mobile, tablet, and desktop
- **CRUD Operations**: Create, read operations implemented
- **TypeScript**: Strongly typed throughout
- **API Integration**: Service layer for handling API calls
- **Component Architecture**: Well-organized component structure

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Backend**: Node.js, Express, CORS
- **Development Tools**: npm, Vite

## API Endpoints

- `GET /api/data` - Get all data items
- `POST /api/data` - Add a new data item
- `GET /api/data/:id` - Get a specific data item
- `PUT /api/data/:id` - Update a data item
- `DELETE /api/data/:id` - Delete a data item

## Running the Application

1. Start the backend server first:
```bash
cd my-fullstack-app/backend
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd my-fullstack-app/frontend
npm run dev
```

3. Open your browser to `http://localhost:3000` to see the application.

## Development

The application is set up for development with hot reloading. Changes to both frontend and backend will automatically reload when saved.