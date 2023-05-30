import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { Auth0Provider } from "@auth0/auth0-react";
import { getConfig } from "./config";
import 'bootstrap/dist/css/bootstrap.min.css';

const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  authorizationParams: {
    redirect_uri: window.location.origin,
    audience: config.audience,
    scope: "read:users read:current_user read:user_idp_tokens update:users update:users_app_metadata read:roles",
  },
};

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <Auth0Provider {...providerConfig}>
    <App />
  </Auth0Provider>
);

serviceWorker.unregister();
