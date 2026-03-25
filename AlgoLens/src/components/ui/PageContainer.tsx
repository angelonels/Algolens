import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import type { ReactNode } from 'react'

export function PageContainer({ children, title }: { children: ReactNode; title?: string }) {
    useDocumentTitle(title)
    return (
        <div className="pt-20 pb-12 px-6 sm:px-10 lg:px-14 max-w-[1440px] mx-auto min-h-screen">
            {title && (
                <h1 className="font-mono text-xl font-bold tracking-tight text-[var(--fg)] mb-6 uppercase">
                    {title}
                </h1>
            )}
            {children}
        </div>
    )
}
