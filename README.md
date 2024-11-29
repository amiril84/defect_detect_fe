# Modern Object Defect Detection - Frontend

Modern web interface for the Object Defect Detection system, built with Next.js, React, and Tailwind CSS. This application uses AI to analyze images and detect defects in various objects.

Backend server repo : https://github.com/amiril84/wood-defect-detection-backend

## Features

- Modern, responsive UI with shadcn-ui components
- Drag-and-drop file upload
- Real-time object analysis and defect detection
- Interactive image previews with modal views
- Status indicators for defect detection
- Detailed analysis results including:
  - Object identification
  - Defect status
  - Condition explanation
- Support for multiple image uploads

## Tech Stack

- Next.js 13+
- React
- Tailwind CSS
- shadcn-ui
- TypeScript

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd modern-object-defect-detection-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at http://localhost:3000

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── page.tsx        # Main application page
│   │   ├── layout.tsx      # Root layout component
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   └── ui/            # UI components
│   └── lib/
│       └── utils.ts       # Utility functions
├── public/                # Static files
└── next.config.mjs       # Next.js configuration
```

## Environment Setup

The frontend expects the backend server to be running on http://localhost:3001. If you need to change this, update the API endpoint in `src/app/page.tsx`.

## UI Components

The application uses shadcn-ui components for a consistent and modern look:

- Cards for displaying analysis results
- Dialog for full-size image previews
- Custom dropzone for file uploads
- Status indicators for defect detection
- Error handling with visual feedback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
