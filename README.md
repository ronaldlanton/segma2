# Segma2

A React application with dynamic layout splitting and customization features. This application allows users to create flexible layouts with adjustable sections, custom padding, and color customization.

## Features

- Dynamic split sections with draggable dividers
- Customizable padding with interactive handles
- Color customization for sections
- Responsive design
- Smooth interactions and transitions

## Development

To run this project locally:

```bash
# Install dependencies
npm install

# Start development server
npm start
```

## Deployment on Netlify

This project is configured for easy deployment on Netlify. You can deploy it in two ways:

### 1. Direct Deploy from GitHub

1. Fork or push this repository to your GitHub account
2. Log in to Netlify
3. Click "New site from Git"
4. Choose your repository
5. Build settings are pre-configured in `netlify.toml`
6. Click "Deploy site"

### 2. Manual Deploy

1. Build the project locally:
   ```bash
   npm install
   npm run build
   ```
2. Drag and drop the `build` folder to Netlify's site dashboard

## Build Settings

The build settings are automatically configured in `netlify.toml`:
- Build command: `npm run build`
- Publish directory: `build`
- Redirects are configured for SPA routing

## Environment Variables

No environment variables are required for basic deployment.

## Support

For issues or questions, please open an issue in the GitHub repository.