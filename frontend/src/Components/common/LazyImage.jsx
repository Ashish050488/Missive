import React, { useState, useEffect, useRef } from 'react';

const LazyImage = ({ src, alt, className, placeholderSrc }) => {
    const [imageSrc, setImageSrc] = useState(placeholderSrc);
    const imageRef = useRef(null);

    useEffect(() => {
        let observer;
        if (imageRef.current && imageSrc === placeholderSrc) { // Only observe if still showing placeholder
            observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setImageSrc(src); // Load actual image
                            observer.unobserve(entry.target); // Stop observing once loaded
                        }
                    });
                },
                { threshold: 0.1 } // Load when 10% visible
            );
            observer.observe(imageRef.current);
        }
        return () => {
            if (observer && imageRef.current) {
                // Ensure imageRef.current is still valid before unobserving
                observer.unobserve(imageRef.current);
            }
        };
    }, [src, placeholderSrc, imageRef, imageSrc]); // Add imageSrc to dependencies

    return (
        <img
            ref={imageRef}
            src={imageSrc || placeholderSrc} // Fallback to placeholderSrc if imageSrc is null/undefined
            alt={alt}
            className={className}
            onError={() => { // Fallback if the actual image fails to load
                // Simplified onError: if the main src fails, and it's not already showing the placeholder,
                // try to show the placeholder. If no placeholder, it will show browser's default alt text/broken image icon.
                if (imageSrc !== placeholderSrc && placeholderSrc) {
                  setImageSrc(placeholderSrc);
                }
                // If no placeholderSrc is provided, there's no explicit fallback image here other than browser default
            }}
        />
    );
};

export default LazyImage;
