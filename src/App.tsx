import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ClinicalLayout } from './components/clinic/ClinicalLayout';
import { PatientLayout } from './components/clinic/PatientLayout';
import { LabLayout } from './components/lab/LabLayout';
import { ClinicGuard } from './components/clinic/ClinicGuard';
import { FeedbackProvider } from './components/clinic/FeedbackToast';
import { PageLoader } from './components/shared/PageLoader';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { AuthProvider } from './context/AuthProvider';
import { SocketProvider } from './context/SocketContext';
import { Navbar, getDashboardPath } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardWrapper } from './components/layout/DashboardWrapper';
import { PublicPageShell } from './components/layout/PublicPageShell';

export { AuthContext } from './context/AuthContext';

const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const Auth = lazy(() => import('./pages/auth/Auth').then((m) => ({ default: m.Auth })));
const Community = lazy(() => import('./pages/shared/Community').then((m) => ({ default: m.Community })));
const Library = lazy(() => import('./pages/shared/Library').then((m) => ({ default: m.Library })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const PublicTestPlayer = lazy(() =>
  import('./pages/lab/PublicTestPlayer').then((m) => ({ default: m.PublicTestPlayer }))
);
const AcademyPage = lazy(() => import('./pages/AcademyPage').then((m) => ({ default: m.AcademyPage })));
const ChatWindow = lazy(() =>
  import('./components/layout/ChatWindow').then((m) => ({ default: m.ChatWindow }))
);

const ClinicianDashboard = lazy(() =>
  import('./pages/clinic/Dashboard').then((m) => ({ default: m.ClinicianDashboard }))
);
const PatientsList = lazy(() => import('./pages/clinic/Patients').then((m) => ({ default: m.PatientsList })));
const PatientDetail = lazy(() => import('./pages/clinic/PatientDetail').then((m) => ({ default: m.PatientDetail })));
const GlobalSessionsList = lazy(() => import('./pages/clinic/Sessions').then((m) => ({ default: m.GlobalSessionsList })));
const GlobalTasksList = lazy(() => import('./pages/clinic/Tasks').then((m) => ({ default: m.GlobalTasksList })));
const GlobalJournalsList = lazy(() => import('./pages/clinic/Journals').then((m) => ({ default: m.GlobalJournalsList })));
const ClinicMessages = lazy(() => import('./pages/clinic/Messages').then((m) => ({ default: m.ClinicMessages })));
const ClinicCalendar = lazy(() => import('./pages/clinic/Calendar').then((m) => ({ default: m.ClinicCalendar })));
const ClinicReports = lazy(() => import('./pages/clinic/Reports').then((m) => ({ default: m.ClinicReports })));
const Plans = lazy(() => import('./pages/clinic/Plans').then((m) => ({ default: m.Plans })));
const StaffManagement = lazy(() => import('./pages/clinic/StaffManagement').then((m) => ({ default: m.StaffManagement })));
const ClinicSettings = lazy(() => import('./pages/clinic/Settings').then((m) => ({ default: m.ClinicSettings })));
const ProfilePage = lazy(() => import('./pages/clinic/Profile').then((m) => ({ default: m.Profile })));
const ClinicAudits = lazy(() => import('./pages/clinic/Audits').then((m) => ({ default: m.ClinicAudits })));
const SpecialistLocker = lazy(() => import('./pages/clinic/Locker').then((m) => ({ default: m.SpecialistLocker })));
const ClinicBilling = lazy(() => import('./pages/clinic/Billing'));
const EconomicsPage = lazy(() => import('./pages/clinic/Economics'));

const PatientDashboard = lazy(() => import('./pages/patient/Dashboard').then((m) => ({ default: m.PatientDashboard })));
const PatientTasks = lazy(() => import('./pages/patient/Tasks').then((m) => ({ default: m.PatientTasks })));
const PatientJournals = lazy(() => import('./pages/patient/JournalList').then((m) => ({ default: m.PatientJournals })));
const NewJournalEntry = lazy(() => import('./pages/patient/NewJournal').then((m) => ({ default: m.NewJournalEntry })));
const PatientMessages = lazy(() => import('./pages/patient/Messages').then((m) => ({ default: m.PatientMessages })));
const PatientAppointments = lazy(() =>
  import('./pages/patient/Appointments').then((m) => ({ default: m.PatientAppointments }))
);
const PatientPayments = lazy(() => import('./pages/patient/Payments'));

const ResearcherLab = lazy(() => import('./pages/lab/ResearcherLab').then((m) => ({ default: m.ResearcherLab })));
const SessionReport = lazy(() => import('./pages/lab/SessionReport').then((m) => ({ default: m.SessionReport })));
const TestEditor = lazy(() => import('./pages/lab/TestEditor').then((m) => ({ default: m.TestEditor })));
const AnalysisPage = lazy(() => import('./pages/lab/AnalysisPage').then((m) => ({ default: m.AnalysisPage })));
const StudiesPage = lazy(() => import('./pages/lab/StudiesPage').then((m) => ({ default: m.StudiesPage })));
const NormsPage = lazy(() => import('./pages/lab/NormsPage').then((m) => ({ default: m.NormsPage })));
const NationalNormsPage = lazy(() => import('./pages/lab/NationalNormsPage'));
const TemplatesPage = lazy(() => import('./pages/lab/TemplatesPage').then((m) => ({ default: m.TemplatesPage })));
const TestsPage = lazy(() => import('./pages/lab/TestsPage').then((m) => ({ default: m.TestsPage })));
const LabSettingsPage = lazy(() => import('./pages/lab/LabSettingsPage').then((m) => ({ default: m.LabSettingsPage })));
const TestPreviewPage = lazy(() => import('./pages/lab/TestPreviewPage').then((m) => ({ default: m.TestPreviewPage })));
const LabMarketplace = lazy(() => import('./pages/lab/Marketplace'));

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { direction: 'rtl', fontFamily: 'Cairo, sans-serif' },
        }}
      />
      <ErrorBoundary>
        <AuthProvider>
          <SocketProvider>
            <FeedbackProvider>
              <div className="min-h-screen bg-psy-bg text-psy-text font-sans overflow-x-hidden selection:bg-psy-gold selection:text-psy-bg">
                <a href="#main-content" className="sr-only skip-link">
                  تخطي إلى المحتوى
                </a>
                <Routes>
                  <Route
                    path="/"
                    element={
                      <>
                        <Navbar />
                        <main id="main-content">
                          <Suspense fallback={<PageLoader label="جاري تحميل الصفحة..." />}>
                            <LandingPage />
                          </Suspense>
                        </main>
                      </>
                    }
                  />
                  <Route path="/community" element={<PublicPageShell><Community /></PublicPageShell>} />
                  <Route path="/library" element={<PublicPageShell><Library /></PublicPageShell>} />
                  <Route
                    path="/academy"
                    element={
                      <>
                        <Navbar />
                        <main id="main-content">
                          <Suspense fallback={<PageLoader />}>
                            <AcademyPage />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                  <Route
                    path="/auth"
                    element={
                      <Suspense fallback={<PageLoader label="جاري تحميل صفحة الدخول..." />}>
                        <Auth />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/public-test/:id"
                    element={
                      <Suspense fallback={<PageLoader />}>
                        <PublicTestPlayer />
                      </Suspense>
                    }
                  />

                  <Route
                    path="/clinic/*"
                    element={
                      <ClinicGuard requiredRole={['clinician', 'owner']}>
                        <ClinicalLayout>
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              <Route path="dashboard" element={<ClinicianDashboard />} />
                              <Route path="patients" element={<PatientsList />} />
                              <Route path="patients/:id" element={<PatientDetail />} />
                              <Route path="sessions" element={<GlobalSessionsList />} />
                              <Route path="plans" element={<Plans />} />
                              <Route path="tasks" element={<GlobalTasksList />} />
                              <Route path="journals" element={<GlobalJournalsList />} />
                              <Route path="messages" element={<ClinicMessages />} />
                              <Route path="calendar" element={<ClinicCalendar />} />
                              <Route path="reports" element={<ClinicReports />} />
                              <Route
                                path="economy"
                                element={
                                  <ClinicGuard requiredRole="owner">
                                    <EconomicsPage />
                                  </ClinicGuard>
                                }
                              />
                              <Route path="billing" element={<ClinicBilling />} />
                              <Route path="profile" element={<ProfilePage />} />
                              <Route path="settings" element={<ClinicSettings />} />
                              <Route path="staff" element={<StaffManagement />} />
                              <Route path="audits" element={<ClinicAudits />} />
                              <Route path="locker" element={<SpecialistLocker />} />
                            </Routes>
                          </Suspense>
                        </ClinicalLayout>
                      </ClinicGuard>
                    }
                  />

                  <Route
                    path="/patient/*"
                    element={
                      <ClinicGuard requiredRole="patient">
                        <PatientLayout>
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              <Route path="dashboard" element={<PatientDashboard />} />
                              <Route path="tasks" element={<PatientTasks />} />
                              <Route path="journal" element={<PatientJournals />} />
                              <Route path="journal/new" element={<NewJournalEntry />} />
                              <Route path="messages" element={<PatientMessages />} />
                              <Route path="appointments" element={<PatientAppointments />} />
                              <Route path="payments" element={<PatientPayments />} />
                            </Routes>
                          </Suspense>
                        </PatientLayout>
                      </ClinicGuard>
                    }
                  />

                  <Route
                    path="/lab/*"
                    element={
                      <ClinicGuard requiredRole={['clinician', 'researcher', 'owner']}>
                        <LabLayout>
                          <Suspense fallback={<PageLoader />}>
                            <Routes>
                              <Route path="dashboard" element={<ResearcherLab />} />
                              <Route path="tests" element={<TestsPage />} />
                              <Route path="analysis" element={<AnalysisPage />} />
                              <Route path="studies" element={<StudiesPage />} />
                              <Route path="study/:id" element={<StudiesPage />} />
                              <Route path="norms" element={<NormsPage />} />
                              <Route path="national-norms" element={<NationalNormsPage />} />
                              <Route path="templates" element={<TemplatesPage />} />
                              <Route path="marketplace" element={<LabMarketplace />} />
                              <Route path="settings" element={<LabSettingsPage />} />
                              <Route path="test-preview/:id" element={<TestPreviewPage />} />
                              <Route path="public-test/:id" element={<PublicTestPlayer />} />
                              <Route path="report/:id" element={<SessionReport />} />
                              <Route path="new-test" element={<TestEditor />} />
                              <Route path="test/:id" element={<TestEditor />} />
                            </Routes>
                          </Suspense>
                        </LabLayout>
                      </ClinicGuard>
                    }
                  />

                  <Route path="/dashboard" element={<DashboardWrapper />} />
                  <Route
                    path="*"
                    element={
                      <>
                        <Navbar />
                        <main id="main-content" className="pt-24">
                          <Suspense fallback={<PageLoader />}>
                            <NotFoundPage />
                          </Suspense>
                        </main>
                        <Footer />
                      </>
                    }
                  />
                </Routes>
                <Suspense fallback={null}>
                  <ChatWindow />
                </Suspense>
              </div>
            </FeedbackProvider>
          </SocketProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export { getDashboardPath };
