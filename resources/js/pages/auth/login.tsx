import { Head, Link, usePage, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { home } from '@/routes';
import { useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';

const roleCredentials: Record<string, { email: string; password: string }> = {
    Admin:  { email: 'admin@wsit-pos.com', password: 'password' },
    Cashier: { email: 'cashier@wsit-pos.com', password: 'password' },
};

const newsItems = [
    {
        title: 'Bangladesh\'s Leading POS System',
        date: '2026',
        excerpt:
            'Complete point of sale solution designed specifically for Bangladeshi businesses with BDT support.',
    },
    {
        title: 'bKash & Nagad Integration',
        date: '2026',
        excerpt:
            'Accept mobile payments directly from your POS terminal with built-in bKash, Nagad, and Rocket support.',
    },
    {
        title: 'Multi-Branch Management',
        date: '2026',
        excerpt:
            'Manage multiple store locations from a single dashboard with real-time stock synchronization.',
    },
    {
        title: 'VAT & Tax Compliant',
        date: '2026',
        excerpt:
            'Automatic VAT calculation and compliant invoice generation as per Bangladesh tax regulations.',
    },
    {
        title: 'Offline Mode Support',
        date: '2026',
        excerpt:
            'Keep selling even when your internet goes down. All transactions sync automatically when back online.',
    },
];

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const { name, branding } = usePage().props as {
        name: string;
        branding?: { logo?: string | null };
    };
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setLoginErrors({});
        router.post(store.url(), { email, password, remember }, {
            onError: (err) => {
                setLoginErrors(err);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    }

    function fillRole(role: string) {
        const creds = roleCredentials[role];
        setEmail(creds.email);
        setPassword(creds.password);
    }

    return (
        <>
            <Head title="Log in" />

            <div className="flex h-dvh bg-gradient-to-br from-[#007C47] to-teal-500">
                <div className="flex h-dvh w-full max-w-[1200px] flex-col overflow-hidden bg-white shadow-2xl md:mx-auto md:flex-row">
                    <div className="flex flex-col items-center overflow-y-auto p-8 md:w-1/2 md:p-10">
                        <div className="mb-6 flex flex-col items-center gap-3">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#007C47]">
                                    {branding?.logo ? (
                                        <img
                                            src={`/storage/${branding.logo}`}
                                            alt="Logo"
                                            className="size-10 object-contain"
                                        />
                                    ) : (
                                        <AppLogoIcon className="size-10 fill-white" />
                                    )}
                                </div>
                            </Link>
                            <h2 className="text-xl font-bold text-gray-800">
                                POS Login
                            </h2>
                            <p className="text-sm text-gray-500">Sign In</p>
                        </div>

                        <div className="mb-4 flex flex-wrap justify-center gap-2">
                            {Object.keys(roleCredentials).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => fillRole(role)}
                                    className="cursor-pointer rounded-full border border-[#007C47] bg-[#007C47] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#006038]"
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <p className="mb-6 text-center text-xs text-gray-400">
                            *Click a role above to auto-fill credentials, then
                            click Sign In.
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="flex w-full flex-col gap-5"
                        >
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Enter Your Email"
                                        className="h-11 rounded-lg border-gray-300 text-black"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                    <InputError message={loginErrors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter Your Password"
                                        className="h-11 rounded-lg border-gray-300 text-black"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <InputError message={loginErrors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        tabIndex={3}
                                        className="text-[#007C47]"
                                        checked={remember}
                                        onCheckedChange={(checked) =>
                                            setRemember(checked === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-gray-600"
                                    >
                                        Remember Me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-11 w-full rounded-lg bg-[#007C47] text-base font-semibold hover:bg-[#006038]"
                                    tabIndex={4}
                                    disabled={submitting}
                                    data-test="login-button"
                                >
                                    {submitting && <Spinner />}
                                    Sign In
                                </Button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <Link
                                    href={register()}
                                    className="text-[#007C47] hover:text-[#006038] hover:underline"
                                >
                                    User Login
                                </Link>
                                <Link
                                    href={home()}
                                    className="text-[#007C47] hover:text-[#006038] hover:underline"
                                >
                                    Front Site
                                </Link>
                            </div>

                            {canResetPassword && (
                                <div className="text-center">
                                    <Link
                                        href={request()}
                                        className="text-sm text-red-500 hover:text-red-600 hover:underline"
                                        tabIndex={5}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}
                        </form>

                        {status && (
                            <div className="mt-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                    </div>

                    <div className="overflow-y-auto bg-gray-50 p-8 md:w-1/2 md:p-10">
                        <h3 className="mb-6 text-lg font-bold text-gray-800">
                            What's New In {name}
                        </h3>
                        <div className="space-y-5">
                            {newsItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="border-b border-gray-200 pb-4 last:border-0 last:pb-0"
                                >
                                    <p className="mb-1 text-xs text-gray-400">
                                        {item.date}
                                    </p>
                                    <h4 className="mb-1 text-sm font-semibold text-gray-800">
                                        {item.title}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {item.excerpt}{' '}
                                        <Link
                                            href="#"
                                            className="text-[#007C47] hover:underline"
                                        >
                                            Read More
                                        </Link>
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = function PassThrough({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
};
