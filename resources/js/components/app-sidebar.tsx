import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Building2,
    BookOpen,
    Calculator,
    CreditCard as CollectIcon,
    DollarSign,
    FileText,
    Gift,
    LayoutGrid,
    Package,
    Repeat,
    Settings,
    ShieldCheck,
    ShoppingCart,
    Store,
    Tag,
    Ticket,
    TrendingDown,
    Truck,
    Users,
    Warehouse,
    AlertTriangle,
    BadgePercent,
    UserCheck,
    Star,
    SlidersHorizontal,
    Wrench,
    Factory,
    FolderKanban,
    Cog,
    MessageCircle,
    Bot,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { GroupLabel } from '@/components/group-label';
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
        title: 'People',
        icon: Users,
        items: [
            { title: 'Customers', href: '/customers', icon: Users },
            { title: 'Suppliers', href: '/suppliers', icon: Truck },
            { title: 'Users', href: '/users', icon: ShieldCheck },
        ],
    },
    {
        title: 'Product',
        icon: Package,
        items: [
            { title: 'Products', href: '/products', icon: Package },
            { title: 'Categories', href: '/categories', icon: Tag },
            { title: 'Brands', href: '/brands', icon: Tag },
            { title: 'Units', href: '/units', icon: Calculator },
        ],
    },
    {
        title: 'Purchase',
        icon: ShoppingCart,
        items: [
            { title: 'Purchases', href: '/purchases', icon: ShoppingCart },
            { title: 'Purchase Returns', href: '/purchase-returns', icon: Repeat },
        ],
    },
    {
        title: 'Sale',
        icon: Tag,
        items: [
            { title: 'Sales', href: '/sales', icon: Tag },
            { title: 'Sale Returns', href: '/sale-returns', icon: Repeat },
            { title: 'POS Terminal', href: '/pos', icon: Store },
            { title: 'Due Collection', href: '/due-collections', icon: CollectIcon },
            { title: 'Quotations', href: '/quotations', icon: FileText },
            { title: 'Exchanges', href: '/exchanges', icon: Repeat },
            { title: 'Installments', href: '/installments', icon: DollarSign },
            { title: 'Challans', href: '/challans', icon: Truck },
            { title: 'Packing Slips', href: '/packing-slips', icon: Package },
            { title: 'Gift Cards', href: '/gift-cards', icon: Gift },
            { title: 'Coupons', href: '/coupons', icon: Ticket },
        ],
    },
    {
        title: 'Income',
        icon: DollarSign,
        items: [
            { title: 'Incomes', href: '/incomes', icon: DollarSign },
            { title: 'Income Categories', href: '/income-categories', icon: Tag },
        ],
    },
    {
        title: 'Expense',
        icon: TrendingDown,
        items: [
            { title: 'Expenses', href: '/expenses', icon: TrendingDown },
            { title: 'Expense Categories', href: '/expense-categories', icon: Tag },
        ],
    },
    {
        title: 'Stock',
        icon: Warehouse,
        items: [
            { title: 'Stock Adjustment', href: '/stock', icon: Warehouse },
            { title: 'Stock Transfers', href: '/stock-transfers', icon: Repeat },
            { title: 'Stock Counts', href: '/stock-counts', icon: Calculator },
            { title: 'Damage Stock', href: '/damage-stock', icon: AlertTriangle },
        ],
    },
    {
        title: 'HRM',
        icon: Users,
        items: [
            { title: 'Employees', href: '/hrm/employees', icon: Users },
            { title: 'Attendance', href: '/hrm/attendance', icon: UserCheck },
            { title: 'Salaries', href: '/hrm/salary', icon: DollarSign },
        ],
    },
    {
        title: 'Manufacturing',
        icon: Factory,
        items: [
            { title: 'Recipes', href: '/manufacturing/recipes', icon: Cog },
            { title: 'Production Orders', href: '/manufacturing/orders', icon: Factory },
        ],
    },
    {
        title: 'Repairs',
        icon: Wrench,
        items: [
            { title: 'Repair Tickets', href: '/repairs', icon: Wrench },
        ],
    },
    {
        title: 'Projects',
        icon: FolderKanban,
        items: [
            { title: 'All Projects', href: '/projects', icon: FolderKanban },
        ],
    },
    {
        title: 'Accounting',
        icon: BookOpen,
        items: [
            { title: 'Chart of Accounts', href: '/accounting/accounts', icon: BookOpen },
            { title: 'Trial Balance', href: '/accounting/trial-balance', icon: Calculator },
            { title: 'General Ledger', href: '/accounting/general-ledger', icon: FileText },
            { title: 'Balance Sheet', href: '/accounting/balance-sheet', icon: BarChart3 },
            { title: 'Cash Flow', href: '/accounting/cash-flow', icon: DollarSign },
        ],
    },
    {
        title: 'Administration',
        icon: ShieldCheck,
        items: [
            { title: 'Reports', href: '/reports', icon: BarChart3 },
            { title: 'Branches', href: '/branches', icon: Building2 },
            { title: 'Discount Plans', href: '/settings/discount-plans', icon: BadgePercent },
            { title: 'Customer Groups', href: '/settings/customer-groups', icon: UserCheck },
            { title: 'Reward Points', href: '/settings/reward-points', icon: Star },
            { title: 'POS Settings', href: '/settings/pos-settings', icon: SlidersHorizontal },
            { title: 'WhatsApp', href: '/whatsapp', icon: MessageCircle },
            { title: 'Landing Page', href: '/settings/landing-page', icon: Settings },
            { title: 'AI Assistant', href: '/ai-assistant', icon: Bot },
        ],
    },
];

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRoles = (auth?.user?.roles as string[]) ?? [];
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
                        <SidebarMenuButton size="sm" asChild>
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
                                size="sm"
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

                {/* Navigation groups */}
                {visibleSections.map((section) => (
                    <SidebarGroup key={section.title}>
                        <GroupLabel
                            icon={section.icon}
                            items={isCollapsed ? [] : (section.items as NavItem[])}
                        >
                            {section.title}
                        </GroupLabel>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
