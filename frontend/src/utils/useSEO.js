import { useEffect } from 'react';

/**
 * Custom hook to dynamically manage page-specific SEO meta tags, title, and canonical link
 */
export const useSEO = ({ title, description, canonicalUrl }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }

        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);

            let ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) {
                ogDesc.setAttribute('content', description);
            }
        }

        if (title) {
            let ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
                ogTitle.setAttribute('content', title);
            }
        }

        if (canonicalUrl) {
            let linkCanonical = document.querySelector('link[rel="canonical"]');
            if (!linkCanonical) {
                linkCanonical = document.createElement('link');
                linkCanonical.setAttribute('rel', 'canonical');
                document.head.appendChild(linkCanonical);
            }
            linkCanonical.setAttribute('href', canonicalUrl);
        }
    }, [title, description, canonicalUrl]);
};

export default useSEO;
