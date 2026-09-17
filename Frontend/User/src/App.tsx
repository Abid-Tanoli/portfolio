import { lazy, Suspense, useEffect, useState, type ComponentType, type ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { usePortfolio } from "@/context/PortfolioContext";
import { SITE_URL } from "@/lib/constants";

function LazyBoundary({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated ? <Suspense fallback={<PageFallback />}>{children}</Suspense> : children;
}

type SyncThenable<T> = {
  then: (onFulfilled: (value: T) => unknown, onRejected?: (reason: unknown) => unknown) => unknown;
  status?: string;
  value?: T;
};

function syncThenable<T>(promise: Promise<T>): SyncThenable<T> {
  let value: T | undefined;
  let fulfilled = false;
  promise.then((m) => {
    value = m;
    fulfilled = true;
  });
  return {
    then(onFulfilled, onRejected) {
      if (fulfilled) {
        onFulfilled(value as T);
        return undefined;
      }
      return promise.then(onFulfilled, onRejected);
    },
  };
}

function lazyRoute(loader: Promise<{ default: unknown }>) {
  return lazy(() => syncThenable(loader) as unknown as Promise<{ default: ComponentType }>);
}

const HomeModule = import("@/pages/Home");
const AboutModule = import("@/pages/About");
const ProjectsModule = import("@/pages/Projects");
const ProjectDetailModule = import("@/pages/ProjectDetail");
const CertificationsModule = import("@/pages/Certifications");
const ResumeModule = import("@/pages/Resume");
const ContactModule = import("@/pages/Contact");
const GithubModule = import("@/pages/Github");
const NotFoundModule = import("@/pages/NotFound");

const Home = lazyRoute(HomeModule);
const About = lazyRoute(AboutModule);
const Projects = lazyRoute(ProjectsModule);
const ProjectDetail = lazyRoute(ProjectDetailModule);
const Certifications = lazyRoute(CertificationsModule);
const Resume = lazyRoute(ResumeModule);
const Contact = lazyRoute(ContactModule);
const Github = lazyRoute(GithubModule);
const NotFound = lazyRoute(NotFoundModule);

export function preloadRoute(pathname: string): Promise<unknown> {
  const path = (pathname.split("?")[0].replace(/\/+$/, "") || "/").toLowerCase();
  switch (path) {
    case "/":
      return HomeModule;
    case "/about":
      return AboutModule;
    case "/projects":
      return ProjectsModule;
    case "/certifications":
      return CertificationsModule;
    case "/resume":
      return ResumeModule;
    case "/contact":
      return ContactModule;
    case "/github":
      return GithubModule;
    default:
      return path.startsWith("/projects/") ? ProjectDetailModule : NotFoundModule;
  }
}

function PageFallback() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-6xl flex-col gap-4 px-6 py-24">
      <Skeleton className="h-10 w-2/3 max-w-md" />
      <Skeleton className="h-4 w-full max-w-2xl" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="mt-6 h-64 w-full rounded-xl" />
    </div>
  );
}

function JsonLd() {
  const { profile } = usePortfolio();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title || "Full Stack Web Developer (MERN)",
    email: `mailto:${profile.email}`,
    telephone: profile.phone,
    address: { "@type": "PostalAddress", addressLocality: "Karachi", addressCountry: "PK" },
    url: SITE_URL,
    sameAs: [profile.github, profile.linkedin].filter(Boolean),
    knowsAbout: [
      "MERN Stack",
      "React.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "AI-Augmented Development",
      "Financial Analysis",
    ],
    worksFor: [
      {
        "@type": "Organization",
        name: "Bano Qabil Incubation Center",
      },
      { "@type": "Organization", name: "AK Electronics" },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioProvider>
        <BrowserRouter>
          <JsonLd />
          <LazyBoundary>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/github" element={<Github />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </LazyBoundary>
        </BrowserRouter>
      </PortfolioProvider>
    </ErrorBoundary>
  );
}
