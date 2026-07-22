import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    Calculator,
    ShoppingCart,
    CreditCard,
    LayoutGrid,
    Package,
    Receipt,
    Settings,
    ShieldCheck,
    Tag,
    TrendingDown,
    TrendingUp,
    Truck,
    Users,
    Warehouse,
    ShoppingCart as PosIcon,
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
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const posNavItems: NavItem[] = [
    {
        title: 'POS Terminal',
        href: '/pos',
        icon: PosIcon,
    },
];

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
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRoles = auth?.user?.roles ?? [];
    const isAdmin = userRoles.includes('admin');
    const isManager = userRoles.includes('manager');

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
                <NavMain items={[{ title: 'Dashboard', href: dashboard(), icon: LayoutGrid }]} />

                <SidebarGroup>
                    <SidebarGroupLabel>POS</SidebarGroupLabel>
                    <NavMain items={posNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Sales</SidebarGroupLabel>
                    <NavMain items={salesNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Inventory</SidebarGroupLabel>
                    <NavMain items={inventoryNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Purchasing</SidebarGroupLabel>
                    <NavMain items={purchaseNavItems} />
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Finance</SidebarGroupLabel>
                    <NavMain items={financeNavItems} />
                </SidebarGroup>

                {(isAdmin || isManager) && (
                    <SidebarGroup>
                        <SidebarGroupLabel>Administration</SidebarGroupLabel>
                        <NavMain items={adminNavItems} />
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
