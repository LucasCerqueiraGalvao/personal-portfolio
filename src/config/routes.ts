export const APP_ROUTES = {
    about: "/home",
    work: "/projects",
    journey: "/experiences",
    reach: "/contact",
    workDetail: (slug = ":slug") => `/project/${slug}`,
    journeyDetail: (slug = ":slug") => `/experiences/${slug}`,
} as const;
