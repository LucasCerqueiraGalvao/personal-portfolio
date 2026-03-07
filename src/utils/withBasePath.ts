const ABSOLUTE_URL_REGEX = /^(?:[a-z]+:)?\/\//i;

export function withBasePath(path: string): string {
    if (!path) return path;
    if (ABSOLUTE_URL_REGEX.test(path)) return path;
    if (path.startsWith("mailto:") || path.startsWith("tel:")) return path;

    const basePath = import.meta.env.BASE_URL || "/";
    const normalizedBase = basePath.endsWith("/") ? basePath : `${basePath}/`;
    const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

    return `${normalizedBase}${normalizedPath}`;
}
