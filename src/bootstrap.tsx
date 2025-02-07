import { GlobalStateProvider } from "@kl-engineering/frontend-state";
import React from "react";
import ReactDOM from "react-dom";
import Main from "./main";
import * as serviceWorker from "./serviceWorker";
import { livePolyfill } from "./setupPolyfill";

livePolyfill();

ReactDOM.render(
  <GlobalStateProvider cookieDomain={process.env.REACT_APP_BASE_DOMAIN || ""}>
    <Main />
  </GlobalStateProvider>,
  document.getElementById(`root`)
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
