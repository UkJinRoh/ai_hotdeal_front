'use client';

import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';

export default function ThemeLogo() {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Prevent hydration mismatch
    if (!mounted) {
        return <Image src="/logo.png" alt="핫딜 연구소 로고" width={100} height={100} style={{ objectFit: 'cover' }} />;
    }

    // In Light Mode, we apply a specific style or use a different image.
    // User requested background #f5f5f7.
    // Assuming the original logo is for Dark Mode (likely white text/elements).
    // Strategy 1: Invert filter for Light Mode to make it dark-on-light.
    // Strategy 2: If the user provided a "logo-light.png", we would use that.

    // Since we don't have a file yet, we'll use CSS filter to approximate the "new creation" request 
    // effectively turning a "White on Transparent" logo into "Black on Transparent".
    // If the original has a dark background, this might look weird, but it's the best first step.

    return (
        <Image
            key={theme} // Force re-mount on theme change
            src={theme === 'light' ? "/logo_light.png?v=1" : "/logo.png?v=1"}
            alt="핫딜 연구소 로고"
            width={100}
            height={100}
            style={{
                objectFit: 'cover',
            }}
            unoptimized // Optional: disable optimization if the issue persists with Next.js cache
        />
    );
}
