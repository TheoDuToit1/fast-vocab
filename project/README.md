# Savi Vocab Admin Panel

This project includes an admin panel for managing categories and vocabulary items in the Savi Vocab application.

## Features

- **Category Management**: Create, edit, and toggle visibility of vocabulary categories
- **Item Management**: Add, edit, and organize vocabulary items by difficulty level
- **Authentication**: Secure access with Supabase authentication
- **Storage**: Store category and item images in Supabase storage

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
cd project
npm install
```

### Running the Application

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Admin Panel Access

The admin panel is accessible at `http://localhost:5173/admin`

**Login Credentials:**
- Email: savienglish@gmail.com
- Password: savi123

## Database Setup

The application uses Supabase for data storage and authentication. The database has already been configured with the following:

- Supabase URL: https://ezwzrfotyzcsxbtaxiln.supabase.co
- Supabase Anon Key: [configured in the application]

If you need to recreate the database structure, you can use the SQL script in `setup-supabase.sql`.

## Importing Existing Categories

To import existing categories into Supabase:

1. Make sure the database tables are set up
2. Run the import script:

```bash
cd project
npx ts-node src/scripts/import-categories.ts
```

This will import the categories and items from the local data files into Supabase.

## Project Structure

- `src/components/` - React components
- `src/context/` - Context providers for state management
- `src/data/` - Local data files for categories and items
- `src/lib/` - Utility functions and API clients
- `src/pages/` - Page components
- `src/scripts/` - Utility scripts for data management

## Admin Panel Usage

1. **Managing Categories**:
   - View all categories on the main admin page
   - Toggle categories between active and "coming soon" status
   - Create new categories with the "New Category" button

2. **Managing Items**:
   - Click the edit button on a category to view and manage its items
   - Add new items with the "Add Item" button
   - Organize items by difficulty level (starter, mover, flyer)

## Security Considerations

- The admin panel is protected with authentication
- Only authenticated users can access the admin features
- Supabase Row Level Security (RLS) policies are in place to protect the data 