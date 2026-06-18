import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { ForgotPassword } from './pages/ForgotPassword';
import { MainTabBar } from './pages/MainTabBar';
import { PatientSessionProvider } from './context/PatientSessionContext';
import { PatientProfile } from './pages/PatientProfile';
import { EditPatient } from './pages/EditPatient';
import { AddReport } from './pages/AddReport';
import { ClinicalModules } from './pages/modules/ClinicalModules';
import { AnalysisForm } from './pages/modules/AnalysisForm';
import { Downloads } from './pages/Downloads';
import { BreastTypes } from './pages/modules/breast/BreastTypes';
import { ERForm } from './pages/modules/breast/ERForm';
import { ERHScore } from './pages/modules/breast/ERHScore';
import { PrivacyPolicy } from './pages/settings/PrivacyPolicy';
import { TermsAndConditions } from './pages/settings/TermsAndConditions';
import { About } from './pages/settings/About';
import { PRForm } from './pages/modules/breast/PRForm';
import { PRHScore } from './pages/modules/breast/PRHScore';
import { BreastHER2 } from './pages/modules/breast/BreastHER2';
import { Ki67 } from './pages/modules/breast/Ki67';
import { Guidelines } from './pages/modules/breast/Guidelines';
import { HER2Guidelines } from './pages/modules/breast/HER2Guidelines';
import { GITScreen } from './pages/modules/git/GITScreen';
import { Adenocarcinoma } from './pages/modules/git/Adenocarcinoma';
import { AdenocarcinomaSurgical } from './pages/modules/git/AdenocarcinomaSurgical';
import { AdenocarcinomaBiopsy } from './pages/modules/git/AdenocarcinomaBiopsy';
import { GITNETScreen } from './pages/modules/git/GITNETScreen';
import { NETStomachScreen } from './pages/modules/git/NETStomachScreen';
import { NETGradingView } from './pages/modules/git/NETGradingView';
import { GISTSelector } from './pages/modules/git/GISTSelector';
import { GISTKi67Screen } from './pages/modules/git/GISTKi67Screen';
import { GISTKitScreen } from './pages/modules/git/GISTKitScreen';
import { LungsHer2 } from './pages/modules/lungs/LungsHer2';
import { ThyroidKi67 } from './pages/modules/thyroid/ThyroidKi67';
import { HeadNeckScreen } from './pages/modules/headneck/HeadNeckScreen';
import { P16 } from './pages/modules/headneck/P16';
import { HeadneckHER2 } from './pages/modules/headneck/HeadneckHER2';
import { SoftTissue } from './pages/modules/softtissue/SoftTissue';
import { GITGuidelines } from './pages/modules/git/GITGuidelines';
import { GITguidelinesher2 } from './pages/modules/git/GITguidelinesher2';
import { NETguidelines } from './pages/modules/git/NETguidelines';
import { GuidelinesP16 } from './pages/modules/headneck/GuidelinesP16';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const doctorId = localStorage.getItem('doctor_id');
  if (!doctorId) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <PatientSessionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <MainTabBar />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy screens if still navigated to directly */}
          <Route path="/patient/:id" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
          <Route path="/patient/:id/edit" element={<ProtectedRoute><EditPatient /></ProtectedRoute>} />
          <Route path="/patient/:id/add-report" element={<ProtectedRoute><AddReport /></ProtectedRoute>} />
          
          <Route path="/patient/:id/modules" element={<ProtectedRoute><ClinicalModules /></ProtectedRoute>} />
          <Route path="/patient/:id/analysis/:tissue/:marker" element={<ProtectedRoute><AnalysisForm /></ProtectedRoute>} />
          
          <Route path="/patient/:id/modules/breast" element={<ProtectedRoute><BreastTypes /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/breast/er" element={<ProtectedRoute><ERForm /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/breast/er-hscore" element={<ProtectedRoute><ERHScore /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/breast/pr" element={<ProtectedRoute><PRForm /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/breast/pr-hscore" element={<ProtectedRoute><PRHScore /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/breast/her2" element={<ProtectedRoute><BreastHER2 /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/breast/ki67" element={<ProtectedRoute><Ki67 /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/breast/guidelines" element={<ProtectedRoute><Guidelines /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/breast/her2-guidelines" element={<ProtectedRoute><HER2Guidelines /></ProtectedRoute>} />

          <Route path="/patient/:id/modules/git" element={<ProtectedRoute><GITScreen /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/git/adenocarcinoma" element={<ProtectedRoute><Adenocarcinoma /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/git/adenocarcinoma/surgical" element={<ProtectedRoute><AdenocarcinomaSurgical /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/git/adenocarcinoma/biopsy" element={<ProtectedRoute><AdenocarcinomaBiopsy /></ProtectedRoute>} />
          
          <Route path="/patient/:id/modules/git/git-guidelines-surgical" element={<ProtectedRoute><GITGuidelines /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/git/git-guidelines-biopsy" element={<ProtectedRoute><GITguidelinesher2 /></ProtectedRoute>} />
          
          <Route path="/patient/:id/modules/git/net" element={<ProtectedRoute><GITNETScreen /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/git/net/stomach" element={<ProtectedRoute><NETStomachScreen /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/git/net/grading" element={<ProtectedRoute><NETGradingView /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/git/net-guidelines" element={<ProtectedRoute><NETguidelines /></ProtectedRoute>} />
          
          <Route path="/patient/:id/modules/git/gist" element={<ProtectedRoute><GISTSelector /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/git/gist/ki67" element={<ProtectedRoute><GISTKi67Screen /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/git/gist/kit" element={<ProtectedRoute><GISTKitScreen /></ProtectedRoute>} />

          <Route path="/patient/:id/modules/lungs" element={<ProtectedRoute><LungsHer2 /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/thyroid" element={<ProtectedRoute><ThyroidKi67 /></ProtectedRoute>} />
          
          <Route path="/patient/:id/modules/headneck" element={<ProtectedRoute><HeadNeckScreen /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/headneck/p16" element={<ProtectedRoute><P16 /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/headneck/guidelines-p16" element={<ProtectedRoute><GuidelinesP16 /></ProtectedRoute>} />
          <Route path="/patient/:id/modules/headneck/her2" element={<ProtectedRoute><HeadneckHER2 /></ProtectedRoute>} />
          
          <Route path="/patient/:id/modules/softtissue" element={<ProtectedRoute><SoftTissue /></ProtectedRoute>} />

          <Route path="/downloads" element={<ProtectedRoute><Downloads /></ProtectedRoute>} />
          
          <Route path="/privacy-policy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
          <Route path="/terms-and-conditions" element={<ProtectedRoute><TermsAndConditions /></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
          
          {/* Redirect any unknown route to dashboard (which will redirect to login if not authenticated) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </PatientSessionProvider>
  );
}

export default App;
