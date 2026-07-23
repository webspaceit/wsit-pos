import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    Calculator,
    CreditCard,
    DollarSign,
    LayoutGrid,
    Package,
    Receipt,
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

function GroupLabel({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
    return (
        <SidebarGroupLabel className="gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            <Icon className="h-3.5 w-3.5" />
            {children}
        </SidebarGroupLabel>
    );
}

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRoles = auth?.user?.roles ?? [];
    const isAdmin = userRoles.includes('admin');
    const isManager = userRoles.includes('manager');
    const { isCurrentUrl } = useCurrentUrl();

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

            <SidebarContent>
                {/* Dashboard */}
                <SidebarGroup>
                    <NavMain items={[{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }]} />
                </SidebarGroup>

                <SidebarSeparator />

                {/* POS Terminal — highlighted */}
                <SidebarGroup>
                    <GroupLabel icon={Zap}>Quick Action</GroupLabel>
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
                    <GroupLabel icon={TrendingUp}>Sales</GroupLabel>
                    <NavMain items={salesNavItems} />
                </SidebarGroup>

                <SidebarSeparator />

                {/* Inventory */}
                <SidebarGroup>
                    <GroupLabel icon={Package}>Inventory</GroupLabel>
                    <NavMain items={inventoryNavItems} />
                </SidebarGroup>

                <SidebarSeparator />

                {/* Purchasing */}
                <SidebarGroup>
                    <GroupLabel icon={Truck}>Purchasing</GroupLabel>
                    <NavMain items={purchaseNavItems} />
                </SidebarGroup>

                <SidebarSeparator />

                {/* Finance */}
                <SidebarGroup>
                    <GroupLabel icon={DollarSign}>Finance</GroupLabel>
                    <NavMain items={financeNavItems} />
                </SidebarGroup>

                {/* Administration — admin/manager only */}
                {(isAdmin || isManager) && (
                    <>
                        <SidebarSeparator />
                        <SidebarGroup>
                            <GroupLabel icon={ShieldCheck}>Administration</GroupLabel>
                            <NavMain items={adminNavItems} />
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
