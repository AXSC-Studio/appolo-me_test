// spec: specs/004-app-shell-integration.md § ルーティング
// / → TripConditionForm
// /candidates → CandidateList (draft.handoffDataset=null時は / へリダイレクト)
// /chat → ChatView

import { Routes, Route, Navigate } from "react-router-dom";
import { useTripConditionDraftContext } from "./context/TripConditionDraftContext";
import { TripConditionForm } from "./components/trip-conditions/TripConditionForm";
import { CandidateList } from "./components/candidates/CandidateList";
import { ChatView } from "./components/chat/ChatView";
import { BottomNav } from "./components/layout/BottomNav";
import { AppHeader } from "./components/layout/AppHeader";

/** /candidates を handoffDataset がある場合のみ許可するガード */
function CandidatesRoute() {
  const { draft } = useTripConditionDraftContext();
  if (!draft.handoffDataset) return <Navigate to="/" replace />;
  return <CandidateList handoffDataset={draft.handoffDataset} />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      <AppHeader />

      {/* メインコンテンツ（BottomNav分の余白を確保） */}
      <main className="flex-1 pb-24 overflow-y-auto">
        <div className="max-w-md mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<TripConditionForm />} />
            <Route path="/candidates" element={<CandidatesRoute />} />
            <Route path="/chat" element={<ChatView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
