import { Link } from '@inertiajs/react';
import { ChevronRight, Menu } from 'lucide-react';
import { useRef, useState } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

type SitemapSection = {
    title: string;
    icon: LucideIcon;
    items: Array<{
        title: string;
        href: string;
        icon?: LucideIcon | null;
    }>;
};

export function SitemapGroupLabel({
    icon: Icon,
    label,
    sections,
}: {
    icon: React.ElementType;
    label: string;
    sections: SitemapSection[];
}) {
    const [open, setOpen] = useState(false);
    const [top, setTop] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const { state } = useSidebar();
    const { isCurrentUrl } = useCurrentUrl();
    const isCollapsed = state === 'collapsed';

    const handleEnter = () => {
        clearTimeout(timeoutRef.current!);
        if (labelRef.current) {
            const rect = labelRef.current.getBoundingClientRect();
            setTop(rect.top);
        }
        setOpen(true);
    };

    const handleLeave = () => {
        timeoutRef.current = setTimeout(() => setOpen(false), 150);
    };

    return (
        <div
            ref={labelRef}
            className="relative"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
        >
            <div
                className={cn(
                    'flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-md px-2 text-xs font-bold uppercase tracking-widest transition-colors',
                    'text-brand hover:bg-brand/10 dark:text-brand-400 dark:hover:bg-brand/20',
                    isCollapsed && 'justify-center px-0',
                )}
            >
                <Icon className="h-4 w-4 shrink-0" />
                {!isCollapsed && (
                    <>
                        <span className="flex-1 truncate">{label}</span>
                        <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                    </>
                )}
            </div>

            {/* Sitemap flyout */}
            {open && !isCollapsed && (
                <div
                    className={cn(
                        'fixed z-50 rounded-xl border border-border bg-popover p-3 shadow-xl',
                        'animate-in fade-in slide-in-from-left-2 duration-150',
                    )}
                    style={{
                        top: `${top}px`,
                        left: 'var(--sidebar-width)',
                        width: '420px',
                    }}
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                >
                    {/* Arrow */}
                    <div className="absolute top-4 -left-2 h-4 w-4 rotate-45 border-l border-b border-border bg-popover" />

                    <div className="relative grid grid-cols-2 gap-4">
                        {sections.map((section) => (
                            <div key={section.title}>
                                <div className="mb-2 flex items-center gap-1.5">
                                    <section.icon className="h-3.5 w-3.5 text-brand dark:text-brand-400" />
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand dark:text-brand-400">
                                        {section.title}
                                    </span>
                                </div>
                                <div className="space-y-0.5">
                                    {section.items.map((item) => (
                                        <Link
                                            key={item.title}
                                            href={item.href}
                                            className={cn(
                                                'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                                                'hover:bg-brand/10 hover:text-brand',
                                                'dark:hover:bg-brand/20 dark:hover:text-brand-400',
                                                isCurrentUrl(item.href)
                                                    ? 'bg-brand/10 font-medium text-brand dark:bg-brand/20 dark:text-brand-400'
                                                    : 'text-muted-foreground',
                                            )}
                                            prefetch
                                        >
                                            {item.icon && <item.icon className="h-3.5 w-3.5 shrink-0" />}
                                            <span>{item.title}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
