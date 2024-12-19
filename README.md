# FightForms App

FightForms is a web application consisting of three modules: frontend, backend, and admin. 

## Frontend app

Frontend app is a nextjs app that allows users to submit demo application using AI assistant. 
It uses the backend server to interact with the AI assistant with GraphQL API.

## Backend app

Backend app is a NestJS app that provides a GraphQL API to interact with the AI assistant. 
It also provides a WebSocket server to interact with the Twilio API or Admin app.

## Admin app

Admin app is a fork of the [OpenAPI Realtime Console](https://github.com/openai/openai-realtime-console) 
modified to interact with the backend WebSocket server.
That allows users to interact with the AI assistant without the need of the real call for testing purposes.

## How to test the app

- Run it and go to the frontend app.
- Submit a demo application.
- You will receive a call from the AI assistant.
- Answer the call and interact with the AI assistant.

You can also use the admin app to interact with the AI assistant without the need of the real call. 
You need to copy session id from the frontend app and paste it in the admin app and start the conversation.

## Environment Variables

The application requires several environment variables to be set. 
These variables are described in detail in the `docs/environment.md` file.


## External Services

   You need to have OpenAI and Twilio API credentials to run the app.
   You can sign up for these services and get the required credentials.

   Also you need ngrok to expose the WebSocket server to the internet or your own domain with SSL certificate.

## Running the App Locally

To run the FightForms app locally, follow these steps:
   
1. **Clone the repository:**
   ```sh
   git clone git@github.com:433ventures/fightforms.git
   cd fightforms
   ```

2. **Install dependencies:**
   ```sh
   npm ci
   ```
3. **Database**

   Use your own instance of PostgresSQL or run a Docker container with docker compose:
   ```sh
   docker compose up -d
   ```

4. **Set up environment variables:**
   Create a `.env` file in the root directory and add the required environment variables as described in the [documentation](docs/environment.md).

   
5. **Start the frontend:**
   ```sh
   npm run start:frontend
   ```

6. **Start the backend:**
   ```sh
   npm run start:backend
   ```

7. **Start the admin interface:**
   ```sh
   npm run start:admin
   ```

The application should now be running locally. You can access the frontend at `http://localhost:3001`, the backend at `http://localhost:3002`, and the admin interface at `http://localhost:3000`.

## Running the App in Production Mode using Docker Compose

To run the FightForms app in production using Docker Compose, follow these steps:

1. **Prepare Environment Variables:**
   Ensure you have a `.env` file in the root directory containing all the required environment variables as described in
   the [documentation](docs/environment.md).


2. **Build and Start the Application:**
   ```sh
   docker compose -f docker-compose.deploy.yml up --build -d
   ```
   This command will build the Docker images and start all the services (frontend, backend, and admin) in detached mode.


3. **Access the Application:**
    - Frontend: `http://<your-domain-or-server-ip>:${FRONTEND_PORT}`
    - Backend: `http://<your-domain-or-server-ip>:${BACKEND_PORT}`
    - Admin Interface: `http://<your-domain-or-server-ip>:${ADMIN_PORT}`
