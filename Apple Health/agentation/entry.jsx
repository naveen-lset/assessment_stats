// Agentation toolbar bootstrap for the static Antz prototype.
// Agentation ships only as a React component, so we mount it onto an
// injected <div> and bundle React + the component into one IIFE script
// (see ../../package.json build:agentation). Loaded via <script> in index2.html.
import React from "react";
import { createRoot } from "react-dom/client";
import { Agentation } from "agentation";

const mount = document.createElement("div");
mount.id = "agentation-root";
document.body.appendChild(mount);

createRoot(mount).render(
  React.createElement(Agentation, {
    // MCP server's HTTP listener (default port 4747)
    endpoint: "http://localhost:4747",
    onSessionCreated: (sessionId) =>
      console.log("[agentation] session started:", sessionId),
  })
);
