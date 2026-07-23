import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    Calculator,
    CreditCard,
    DollarSign,
    LayoutGrid,
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
import { GroupLabel } from '@/components/group-label';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
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

const salesNavItems: NavItem[] = [
    {
        title: 'Sales',
        href: '/sales',
        icon: TrendingUp,
    },
    {
        title: 'Due Collection',
        href: '/due-collections',
        icon: CreditCard,
    },
];

const inventoryNavItems: NavItem[] = [
    {
        title: 'Products',
        href: '/products',
        icon: Package,
    },
    {
        title: 'Categories',
        href: '/categories',
        icon: Tag,
    },
    {
        title: 'Units',
        href: '/units',
        icon: Calculator,
    },
    {
        title: 'Stock',
        href: '/stock',
        icon: Warehouse,
    },
];

const purchaseNavItems: NavItem[] = [
    {
        title: 'Purchases',
        href: '/purchases',
        icon: ShoppingCart,
    },
    {
        title: 'Suppliers',
        href: '/suppliers',
        icon: Truck,
    },
];

const financeNavItems: NavItem[] = [
    {
        title: 'Customers',
        href: '/customers',
        icon: Users,
    },
    {
        title: 'Expenses',
        href: '/expenses',
        icon: TrendingDown,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Reports',
        href: '/reports',
        icon: BarChart3,
    },
    {
        title: 'Branches',
        href: '/branches',
        icon: Building2,
    },
    {
        title: 'Users',
        href: '/users',
        icon: ShieldCheck,
    },
    {
        title: 'Landing Page',
        href: '/settings/landing-page',
        icon: Settings,
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
                    <SidebarGroupLabel className="gap-2 text-xs font-bold uppercase tracking-widest text-brand dark:text-brand-400">
                        <Zap className="h-4 w-4" />
                        {!isCollapsed && 'Quick Action'}
                    </SidebarGroupLabel>
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

                {/* Sales */}
                <SidebarGroup>
                    <GroupLabel icon={TrendingUp} items={salesNavItems}>Sales</GroupLabel>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Inventory */}
                <SidebarGroup>
                    <GroupLabel icon={Package} items={inventoryNavItems}>Inventory</GroupLabel>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Purchasing */}
                <SidebarGroup>
                    <GroupLabel icon={Truck} items={purchaseNavItems}>Purchasing</GroupLabel>
                </SidebarGroup>

                <SidebarSeparator />

                {/* Finance */}
                <SidebarGroup>
                    <GroupLabel icon={DollarSign} items={financeNavItems}>Finance</GroupLabel>
                </SidebarGroup>

                {/* Administration — admin/manager only */}
                {(isAdmin || isManager) && (
                    <>
                        <SidebarSeparator />
                        <SidebarGroup>
                            <GroupLabel icon={ShieldCheck} items={adminNavItems}>Administration</GroupLabel>
                        </SidebarGroup>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
