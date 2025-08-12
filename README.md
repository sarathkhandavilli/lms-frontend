# LMS Frontend

A modern React-based frontend for the Learning Management System (LMS).

## Features

- User authentication and authorization
- Course browsing and enrollment
- Category management
- Mentor and learner dashboards
- Payment integration
- Responsive UI with Tailwind CSS
- Connects to Spring Boot LMS backend via REST API

## Technology Stack

- React (Vite)
- JavaScript (ES6+)
- Axios for API requests
- React Router for navigation
- Tailwind CSS for styling

## Local Development

### Prerequisites

- Node.js (v18+ recommended)
- npm

### Running Locally

1. Clone the repository:
	```bash
	git clone https://github.com/sarathkhandavilli/lms-frontend.git
	cd lms-frontend
	```
2. Install dependencies:
	```bash
	npm install
	```
3. Configure the backend API URL if needed (default is set to Render backend):
	- Update API URLs in the code or use environment variables.
4. Start the development server:
	```bash
	npm run dev
	```

## Deployment to Netlify

### Prerequisites

- A Netlify account
- Your application code pushed to a Git repository (e.g., GitHub)

### Deployment Steps

1. Go to Netlify Dashboard
2. Click "Add new site" → "Import from Git"
3. Connect your GitHub repository (`lms-frontend`)
4. Configure the build settings:
	- **Build command:** `npm run build`
	- **Publish directory:** `dist`
5. (Optional) Set environment variables for your backend API URL
6. Click "Deploy site"

## Environment Variables

If you want to use environment variables for your backend URL, add them in Netlify dashboard:

- `VITE_BACKEND_URL`: URL of your backend API (e.g., `https://lms-backend-cr9o.onrender.com//`)

## Troubleshooting

- **Build Failures:**
  - Ensure Node.js and npm are installed
  - Check for missing dependencies in `package.json`
- **API Connection Issues:**
  - Verify the backend URL is correct and accessible
  - Ensure CORS is enabled on the backend
- **UI Issues:**
  - Check browser console for errors
  - Ensure all environment variables are set

## Security Notes

- Never commit sensitive information like API keys
- Use environment variables for all sensitive configuration

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
