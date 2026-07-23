import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useRef, useState } from 'react';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';

export function GroupLabel({
    icon: Icon,
    children,
    items = [],
}: {
    icon: React.ElementType;
    children: React.ReactNode;
    items?: NavItem[];
}) {
    const [open, setOpen] = useState(false);
    const [top, setTop] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const labelRef = useRef<HTMLDivElement>(null);
    const { state } = useSidebar();
    const { isCurrentUrl } = useCurrentUrl();
    const isCollapsed = state === 'collapsed';
    const hasItems = items.length > 0;

    const handleEnter = () => {
        clearTimeout(timeoutRef.current!);
        if (labelRef.current) {
            const rect = labelRef.current.getBoundingClientRect();
            setTop(rect.top);
        }
        if (isCollapsed || hasItems) {
            setOpen(true);
        }
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
                    'flex h-6 shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors',
                    'text-brand hover:bg-brand/10 dark:text-brand-400 dark:hover:bg-brand/20',
                    isCollapsed && 'justify-center px-0',
                )}
            >
                <Icon className="h-3 w-3 shrink-0" />
                {!isCollapsed && (
                    <>
                        <span className="flex-1 truncate">{children}</span>
                        {hasItems && (
                            <ChevronRight className="h-3 w-3 shrink-0 opacity-50" />
                        )}
                    </>
                )}
            </div>

            {/* Flyout submenu — only in expanded mode */}
            {open && hasItems && !isCollapsed && (
                <div
                    className={cn(
                        'fixed z-50 min-w-[200px] rounded-xl border border-border bg-popover p-1.5 shadow-xl',
                        'animate-in fade-in slide-in-from-left-2 duration-150',
                    )}
                    style={{
                        top: `${top}px`,
                        left: 'var(--sidebar-width)',
                    }}
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                >
                    {/* Arrow */}
                    <div className="absolute top-3 -left-2 h-3 w-3 rotate-45 border-l border-b border-border bg-popover" />

                    <div className="relative">
                        <div className="mb-0.5 flex items-center gap-2 px-2 py-1">
                            <Icon className="h-3.5 w-3.5 text-brand dark:text-brand-400" />
                            <span className="text-xs font-semibold text-foreground">
                                {children}
                            </span>
                        </div>
                        <div className="border-t border-border" />
                        {items.map((item) => (
                            <Link
                                key={item.title}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors',
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
            )}
        </div>
    );
}
