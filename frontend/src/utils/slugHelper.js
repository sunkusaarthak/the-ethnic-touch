/**
 * SEO URL Slug Helper
 * Generates clean, URL-safe, lowercase slugs without reserved characters (&, ?, /, etc.)
 */
export function createProductSlug(name) {
    if (!name || typeof name !== 'string') return '';
    return name
        .toLowerCase()
        .replace(/&/g, 'and')              // Convert ampersand to 'and'
        .replace(/[/\\+]/g, '-')           // Convert slashes and pluses to hyphens
        .replace(/[^a-z0-9\-]/g, '-')      // Replace any other non-alphanumeric character with hyphen
        .replace(/-+/g, '-')               // Collapse multiple consecutive hyphens
        .replace(/^-+|-+$/g, '');          // Trim leading and trailing hyphens
}

export default createProductSlug;
