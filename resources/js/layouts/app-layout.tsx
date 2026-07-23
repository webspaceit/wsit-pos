import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    fullWidth = false,
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    fullWidth?: boolean;
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} fullWidth={fullWidth}>
            {children}
        </AppLayoutTemplate>
    );
}
