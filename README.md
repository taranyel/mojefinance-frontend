# MojeFinance

This is the frontend client for the **MojeFinance** personal finance management application.

## Prerequisites

Before running the frontend application locally, ensure you have the following installed on your machine:

- **Node.js** (v18.0.0 or higher recommended)
- **npm** (Node Package Manager)

*Note: The frontend relies on the MojeFinance backend API. Ensure the backend services
are running before interacting with the application.*

## Environment Configuration

The application requires specific environment variables to communicate with the backend and Keycloak.

Create a `.env` file in the root of the `mojefinance-frontend` directory and add the following configuration:

```env
# Backend API Base URL
VITE_KEYCLOAK_CLIENT_ID=mojefinance-frontend

VITE_CSAS_CLIENT_ID=your_cs_client_id_here
VITE_CSAS_AUTH_URL=https://webapi.developers.erstegroup.com/api/csas/sandbox/v1/sandbox-idp/auth

VITE_AIRBANK_AUTH_URL=http://developers.airbank.cz/sandbox/login

VITE_KB_CLIENT_ID=your_kb_client_id_here
VITE_KB_AUTH_URL=https://api-gateway.kb.cz/sandbox/oauth2-authorization-ui/v3/
VITE_KB_SCOPE=aisp

\\CSOB code is hardcoded due to sandbox limitations:
VITE_CSOB_CODE=2%2FCOigoxESgm5NIvaYEGG68a5O
```

## Local run

Follow these steps to build and run the frontend locally:

### Install Dependencies
   Open your terminal, navigate to the frontend project directory, and install the required npm packages:

``` bash
cd mojefinance-frontend
npm install
```

### Start the Server

``` bash
npm run dev
```

Once started, open http://localhost:5173 URL in your web browser to access the application.

### Authentication Flow

You will be redirected to the Keycloak login page. Enter a test user’s credentials (username: `test`, password: `test`)
to authenticate.