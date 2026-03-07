import CustomCursor from "./components/CustomCursor";
import Footer from "./components/Footer";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import SmoothScroll from "./components/SmoothScroll";
import Scene3D from "./components/3d/Scene3D";
import ContactPage from "./pages/ContactPage";
import ExperiencesPage from "./pages/ExperiencesPage";
import HomePage from "./pages/HomePage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import ProjectsPage from "./pages/ProjectsPage";
import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
} from "react-router-dom";

function AppLayout() {
    return (
        <SmoothScroll>
            <div className="cursor-none relative z-10">
                <CustomCursor />
                <Scene3D />
                <Header />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </SmoothScroll>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to="/home" replace />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/experiences" element={<ExperiencesPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/project/:slug" element={<ProjectDetailPage />} />
                    <Route path="*" element={<Navigate to="/home" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
