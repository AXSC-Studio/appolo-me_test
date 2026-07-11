// spec: specs/004-app-shell-integration.md § Provider構成
// BrowserRouter > TripConditionDraftProvider > CandidateProvider > ChatProvider > App

import "./index.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TripConditionDraftProvider } from "./context/TripConditionDraftContext";
import { useTripConditionDraftContext } from "./context/TripConditionDraftContext";
import { CandidateProvider } from "./context/CandidateContext";
import { ChatProvider } from "./context/ChatContext";
import App from "./App";

/** TripConditionDraftContext から draft.handoffDataset を読んで CandidateProvider へ渡す */
function CandidateProviderBridge({ children }: { children: React.ReactNode }) {
  const { draft } = useTripConditionDraftContext();
  return (
    <CandidateProvider handoffDataset={draft.handoffDataset}>
      {children}
    </CandidateProvider>
  );
}

const root = document.getElementById("root");
if (!root) throw new Error('id="root" の要素が見つかりません');

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <TripConditionDraftProvider>
        <CandidateProviderBridge>
          <ChatProvider>
            <App />
          </ChatProvider>
        </CandidateProviderBridge>
      </TripConditionDraftProvider>
    </BrowserRouter>
  </StrictMode>
);
