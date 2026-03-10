import SiteFooter from "./components/SiteFooter";
import TopNav from "./components/TopNav";
import ScrollToTop from "./components/ScrollToTop";
import SmoothScroll from "./components/SmoothScroll";
import Scene3D from "./components/3d/Scene3D";
import SocialIconsLayer from "./components/social-icons/SocialIconsLayer";
import { SocialIconAnchorsProvider } from "./components/social-icons/SocialIconAnchors";
import { APP_ROUTES } from "./config/routes";
import JourneyCompanyPage from "./pages/JourneyCompanyPage";
import JourneyPage from "./pages/JourneyPage";
import OverviewPage from "./pages/OverviewPage";
import ReachOutPage from "./pages/ReachOutPage";
import WorkDetailPage from "./pages/WorkDetailPage";
import WorkPage from "./pages/WorkPage";
import {
    BrowserRouter,
    Navigate,
    Outlet,
    Route,
    Routes,
    useParams,
} from "react-router-dom";

function AppLayout() {
    return (
        <SmoothScroll>
            <SocialIconAnchorsProvider>
                <div className="site-shell relative z-10">
                    <Scene3D />
                    <TopNav />
                    <SocialIconsLayer />
                    <main>
                        <Outlet />
                    </main>
                    <SiteFooter />
                </div>
            </SocialIconAnchorsProvider>
        </SmoothScroll>
    );
}

function LegacyWorkDetailRedirect() {
    const { slug } = useParams<{ slug: string }>();

    if (!slug) {
        return <Navigate to={APP_ROUTES.work} replace />;
    }

    return <Navigate to={APP_ROUTES.workDetail(slug)} replace />;
}

function LegacyJourneyDetailRedirect() {
    const { slug } = useParams<{ slug: string }>();

    if (!slug) {
        return <Navigate to={APP_ROUTES.journey} replace />;
    }

    return <Navigate to={APP_ROUTES.journeyDetail(slug)} replace />;
}

function App() {
    return (
        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <ScrollToTop />
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Navigate to={APP_ROUTES.about} replace />} />

                    <Route path={APP_ROUTES.about} element={<OverviewPage />} />
                    <Route path={APP_ROUTES.work} element={<WorkPage />} />
                    <Route path={APP_ROUTES.workDetail()} element={<WorkDetailPage />} />
                    <Route path={APP_ROUTES.journey} element={<JourneyPage />} />
                    <Route
                        path={APP_ROUTES.journeyDetail()}
                        element={<JourneyCompanyPage />}
                    />
                    <Route path={APP_ROUTES.reach} element={<ReachOutPage />} />

                    {/* Legacy route compatibility */}
                    <Route
                        path="/about"
                        element={<Navigate to={APP_ROUTES.about} replace />}
                    />
                    <Route
                        path="/work"
                        element={<Navigate to={APP_ROUTES.work} replace />}
                    />
                    <Route
                        path="/work/:slug"
                        element={<LegacyWorkDetailRedirect />}
                    />
                    <Route
                        path="/journey"
                        element={<Navigate to={APP_ROUTES.journey} replace />}
                    />
                    <Route
                        path="/journey/:slug"
                        element={<LegacyJourneyDetailRedirect />}
                    />
                    <Route
                        path="/reach"
                        element={<Navigate to={APP_ROUTES.reach} replace />}
                    />
                    <Route
                        path="*"
                        element={<Navigate to={APP_ROUTES.about} replace />}
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
