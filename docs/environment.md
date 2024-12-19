# Environment Variables Documentation

## Ports
- `FRONTEND_PORT`: Port number for the frontend server. Default is `3001`.
- `ADMIN_PORT`: Port number for the test interface. Default is `3000`.
- `BACKEND_PORT`: Port number for the backend server. Default is `3002`.
- `BACKEND_WS_PORT`: Port number for the backend WebSocket server. Default is `3003`.
- `BACKEND_TWILIO_WS_PORT`: Port number for the backend Twilio WebSocket server. Default is `3004`.

## Database Configuration
- `DB_HOST`: Hostname for the database server. 
- `DB_PORT`: Port number for the database server. 
- `DB_USER`: Username for the database.
- `DB_PASSWORD`: Password for the database.
- `DB_DATABASE`: Name of the database.

## URLs
- `FRONTEND_PUBLIC_URL`: Public URL for the frontend. Default is `http://localhost:3001`.
- `GRAPHQL_URL`: URL for the GraphQL endpoint. Default is `http://localhost:3002/graphql`.
- `REACT_APP_LOCAL_RELAY_SERVER_URL`: URL for the WS server used in admin app. Default is `http://localhost:3003/admin/ws`.

## SMTP Configuration
- `SMTP_CONNECTION_URI`: URI for the SMTP connection. Example: `smtps://user:****@smtp:1127`.

## OpenAI Credentials
- `OPENAI_API_KEY`: API key for OpenAI. Example: `sk-proj-***`.

## Twilio API Credentials
- `TWILIO_ACCOUNT_SID`: Account SID for Twilio. 
- `TWILIO_AUTH_TOKEN`: Auth token for Twilio. 
- `TWILIO_FROM_PHONE`: Phone number registered with Twilio. Example: `+1**********`.
- 
### Twilio exposed WebSocket URL
You can use a service like [ngrok](https://ngrok.com/) to expose the WebSocket server to the internet.
Or use your own domain.

Secured connection is required.

- `TWILIO_WS_ENTRYPOINT`: WebSocket entry point for Twilio. Example: `wss://***.ngrok-free.app/twilio/ws`.

## pgAdmin Configuration
- `PGADMIN_DEFAULT_EMAIL`: Default email for pgAdmin. Default is `admin@admin.com`.
- `PGADMIN_DEFAULT_PASSWORD`: Default password for pgAdmin. Default is `admin`.
- `PGADMIN_PORT`: Port number for pgAdmin. Default is `5050`.

## Data Folder
- `DATA_FOLDER`: Path to the data folder. Default is `./data`.