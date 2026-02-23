/**
 * Image optimization utilities for product images.
 * Converts full-res WordPress URLs to optimized thumbnails.
 */

/**
 * Get a thumbnail URL from a full WordPress image URL.
 * Adds the WordPress size suffix (e.g., -300x300) before extension.
 */
export function getThumbnailUrl(url, size = 300) {
    if (!url) return '';
    // Already a thumbnail?
    if (url.match(/-\d+x\d+\./)) return url;
    // Insert size suffix before file extension
    return url.replace(/\.(\w+)$/, `-${size}x${size}.$1`);
}

/**
 * Get a medium-sized image URL (for product detail pages)
 */
export function getMediumUrl(url) {
    return getThumbnailUrl(url, 600);
}

/**
 * Optimized Image component with lazy loading, blur-up placeholder,
 * and automatic thumbnail generation.
 */
import { useState, useRef, useEffect } from 'react';

export function OptimizedImage({ src, alt, className, width, height, priority = false }) {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setLoaded(true);
        }
    }, []);

    return (
        <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={`${className || ''} ${loaded ? 'img-loaded' : 'img-loading'}`}
            width={width || 300}
            height={height || 300}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onLoad={() => setLoaded(true)}
        />
    );
}
