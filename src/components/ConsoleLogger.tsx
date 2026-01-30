'use client';

import { useEffect } from 'react';

export default function ConsoleLogger({ data }: { data: any }) {
    useEffect(() => {
        console.log('Supabase Data:', data);
    }, [data]);

    return null;
}
