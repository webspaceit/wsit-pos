import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    Calculator,
    CreditCard,
    CreditCard as CollectIcon,
    DollarSign,
    LayoutGrid,
    Menu,
    Package,
    Settings,
    ShieldCheck,
    ShoppingCart,
    Store,
    Tag,
    TrendingDown,
    TrendingUp,
    Truck,
    Users,
    Warehouse,
    Zap,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { SitemapGroupLabel } from '@/components/sitemap-group-label';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
    useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const allSections = [
    {
        title: 'Sales',
        icon: TrendingUp,
        items: [
            { title: 'Sales', href: '/sales', icon: TrendingUp },
            { title: 'Due Collection', href: '/due-collections', icon: CollectIcon },
        ],
    },
    {
        title: 'Inventory',
        icon: Package,
        items: [
            { title: 'Products', href: '/products', icon: Package },
            { title: 'Categories', href: '/categories', icon: Tag },
            { title: 'Units', href: '/units', icon: Calculator },
            { title: 'Stock', href: '/stock', icon: Warehouse },
        ],
    },
    {
        title: 'Purchasing',
        icon: Truck,
        items: [
            { title: 'Purchases', href: '/purchases', icon: ShoppingCart },
            { title: 'Suppliers', href: '/suppliers', icon: Truck },
        ],
    },
    {
        title: 'Finance',
        icon: DollarSign,
        items: [
            { title: 'Customers', href: '/customers', icon: Users },
            { title: 'Expenses', href: '/expenses', icon: TrendingDown },
        ],
    },
    {
        title: 'Administration',
        icon: ShieldCheck,
        items: [
            { title: 'Reports', href: '/reports', icon: BarChart3 },
            { title: 'Branches', href: '/branches', icon: Building2 },
            { title: 'Users', href: '/users', icon: ShieldCheck },
            { title: 'Landing Page', href: '/settings/landing-page', icon: Settings },
        ],
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRoles = auth?.user?.roles ?? [];
    const isAdmin = userRoles.includes('admin');
    const isManager = userRoles.includes('manager');
    const { isCurrentUrl } = useCurrentUrl();
    const { state } = useSidebar();
    const isCollapsed = state === 'collapsed';

    const visibleSections = allSections.filter(
        (s) => s.title !== 'Administration' || isAdmin || isManager,
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="overflow-x-hidden">
                {/* Dashboard */}
                <SidebarGroup>
                    <NavMain items={[{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }]} />
                </SidebarGroup>

                <SidebarSeparator />

                {/* POS Terminal — highlighted */}
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isCurrentUrl('/pos')}
                                className="my-0.5 bg-gradient-to-r from-brand to-brand-dark font-semibold text-white shadow-md shadow-brand/20 hover:from-brand-dark hover:to-brand hover:text-white data-[active=true]:from-brand-dark data-[active=true]:to-brand data-[active=true]:text-white"
                                tooltip={{ children: 'POS Terminal' }}
                            >
                                <Link href="/pos" prefetch>
                                    <Store className="h-4 w-4" />
                                    <span>POS Terminal</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Quick Action — sitemap flyout */}
                <SidebarGroup>
                    <SitemapGroupLabel
                        icon={Menu}
                        label="Quick Action"
                        sections={visibleSections}
                    />
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
