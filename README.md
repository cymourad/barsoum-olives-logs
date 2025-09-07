# Barsoum Olives Data Tracker

A comprehensive web application for managing olive grove operations, including tree logging, oil processing batches, and pickling batches.

## Features

### 🌳 Tree Management
- Interactive grove map showing all tree positions
- Individual tree tracking with properties (variety, year planted, supplier)
- Comprehensive logging system for tree activities:
  - **Pruning**: Track vase shape, bushy shape, clear trunk, skirt, high growing ends, wild shoots
  - **Irrigation**: Log number of drippers and hours
  - **Harvesting**: Record amount harvested and harvesting profiles
  - **Fertilizing**: Track nitrogen, potassium, phosphore, borron, chicken manure, lime, gypsum
  - **Treatment**: Log white oil and other treatments
  - **Flowering**: Record initial and remaining percentages
  - **Weather**: Track frost, rain, and temperature conditions

### 🫒 Oil Processing Batches
- Create batches from selected trees
- Track the complete oil processing workflow:
  - Transportation from grove to plant
  - Processing (weight, yield, percentage, price)
  - Filtering
  - Transportation from plant to home
  - Bottling

### 🥒 Pickling Batches
- Create pickling batches with detailed recipe information
- Track variety, ripeness, salt percentage, and preparation notes
- Manage supplier information and batch properties

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom olive-themed colors
- **Backend**: Supabase (PostgreSQL database)
- **Routing**: React Router DOM
- **Deployment**: GitHub Pages ready

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd barsoum-olives-logs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Or for local development with Supabase CLI:
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Start local Supabase
   supabase start
   
   # The app will use localhost:54321 by default for local development
   ```

4. **Run database migrations**
   ```bash
   # If using Supabase CLI locally
   supabase db reset
   
   # If using hosted Supabase, run the migration file manually in the SQL editor
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

### Initial Setup

1. **Initialize Trees**: On first visit to the Trees page, click "Initialize Trees" to populate the database with all tree positions from the grove map.

2. **Configure Tree Properties**: Visit individual trees to set variety, year planted, and supplier information.

3. **Start Logging**: Begin adding logs for tree activities, oil processing batches, and pickling batches.

## Database Schema

The application uses a comprehensive PostgreSQL schema with the following main tables:

- `trees` - Tree positions and properties
- `tree_logs` - Base table for all tree activities
- `pruning_logs`, `irrigation_logs`, `harvesting_logs`, etc. - Specific activity details
- `oil_processing_batches` - Oil processing batch information
- `oil_processing_batch_logs` - Oil processing activities
- `pickling_batches` - Pickling batch information with recipes

## Deployment

### GitHub Pages Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   # Install gh-pages if not already installed
   npm install -g gh-pages
   
   # Deploy
   gh-pages -d dist
   ```

3. **Configure GitHub Pages**
   - Go to your repository settings
   - Navigate to Pages section
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch

### Environment Variables for Production

Set the following environment variables in your deployment platform:

```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## Project Structure

```
src/
├── components/          # Reusable React components
│   ├── Navigation.tsx   # Main navigation bar
│   ├── TreeMap.tsx      # Interactive grove map
│   ├── TreeLogForm.tsx  # Tree activity logging form
│   ├── TreeLogsList.tsx # Tree activity logs display
│   ├── BatchLogForm.tsx # Batch activity logging form
│   └── BatchLogsList.tsx # Batch activity logs display
├── pages/              # Page components
│   ├── TreesPage.tsx   # Trees overview and map
│   ├── TreeDetailPage.tsx # Individual tree details
│   ├── OilProcessingBatchesPage.tsx # Oil batches overview
│   ├── OilProcessingBatchDetailPage.tsx # Oil batch details
│   ├── PicklingBatchesPage.tsx # Pickling batches overview
│   └── PicklingBatchDetailPage.tsx # Pickling batch details
├── lib/
│   └── supabase.ts     # Supabase client configuration
├── types/
│   └── index.ts        # TypeScript type definitions
├── utils/
│   └── treeMap.ts      # Tree positioning utilities
├── App.tsx             # Main application component
├── main.tsx            # Application entry point
└── index.css           # Global styles and Tailwind imports
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support or questions, please open an issue in the GitHub repository.
