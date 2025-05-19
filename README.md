# Orange Directory - Deployment Guide

This guide explains how to deploy the Orange Directory website with real-time ratings and likes to Render.com's free tier.

## What You'll Get

- Frontend static site hosting
- Backend Node.js API with Socket.io for real-time updates
- MongoDB database for storing ratings and likes
- Real-time synchronization of ratings and likes across all users

## Deployment Steps

### 1. Create a Render Account

- Go to [Render.com](https://render.com) and sign up for a free account
- Verify your email address

### 2. Connect Your GitHub Repository

- Push your code to a GitHub repository
- In Render dashboard, click "New" and select "Blueprint"
- Connect your GitHub account and select your repository
- Render will automatically detect the `render.yaml` file

### 3. Deploy Your Services

- Render will create the following services based on the `render.yaml` file:
  - `orange-directory-api`: Backend Node.js server
  - `orange-directory-frontend`: Frontend static site
  - `orange-directory-db`: MongoDB database

- Click "Apply" to start the deployment process
- Wait for all services to deploy (this may take a few minutes)

### 4. Access Your Application

- Once deployed, Render will provide URLs for your services
- Your frontend will be available at: `https://orange-directory-frontend.onrender.com`
- Your backend API will be available at: `https://orange-directory-api.onrender.com`

## Important Notes

1. **Free Tier Limitations**:
   - Render's free tier has some limitations:
     - Services spin down after 15 minutes of inactivity
     - Limited bandwidth and compute resources
     - MongoDB has 512 MB storage limit

2. **Custom Domain**:
   - You can add a custom domain in the Render dashboard
   - Free tier supports custom domains with Render subdomain

3. **Environment Variables**:
   - All necessary environment variables are configured in the `render.yaml` file
   - You can add additional variables in the Render dashboard if needed

## Local Development

To run the project locally:

1. Start the backend server:
   ```
   cd server
   npm install
   npm start
   ```

2. Open any HTML file directly in your browser
   - The frontend will automatically connect to the local backend when run locally

## Troubleshooting

- **Socket.io Connection Issues**: Check browser console for connection errors
- **Database Connection Issues**: Verify MongoDB connection string in Render dashboard
- **Deployment Failures**: Check Render logs for detailed error messages

## Support

If you encounter any issues with your Render deployment, you can:
- Check Render's [documentation](https://render.com/docs)
- Contact Render support through their dashboard
