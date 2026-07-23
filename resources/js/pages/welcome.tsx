import { Head, Link, usePage } from '@inertiajs/react';
import { login } from '@/routes';
import { useState } from 'react';

interface Feature {
    icon: string;
    title: string;
    description: string;
}

interface PricingPlan {
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
    highlighted: boolean;
}

interface Testimonial {
    name: string;
    role: string;
    text: string;
}

interface Stat {
    value: string;
    label: string;
}

interface Faq {
    question: string;
    answer: string;
}

interface LandingData {
    hero_title: string;
    hero_subtitle: string;
    hero_cta_text: string;
    stats_title: string;
    stats_subtitle: string;
    stats: Stat[];
    logos_title: string;
    logos: string[];
    features_title: string;
    features_subtitle: string;
    features: Feature[];
    pricing_title: string;
    pricing_subtitle: string;
    pricing: PricingPlan[];
    testimonials_title: string;
    testimonials: Testimonial[];
    faq_title: string;
    faq_subtitle: string;
    faq: Faq[];
    cta_title: string;
    cta_subtitle: string;
    cta_button_text: string;
    footer_text: string;
}

function FaqItem({ faq }: { faq: Faq }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-gray-200 py-5">
            <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left">
                <span className="text-base font-medium text-gray-900">{faq.question}</span>
                <svg className={`h-5 w-5 shrink-0 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </button>
            {open && <p className="mt-3 text-sm leading-6 text-gray-600">{faq.answer}</p>}
        </div>
    );
}

export default function Welcome() {
    const { auth, landing } = usePage().props;
    const l = landing as LandingData;

    return (
        <>
            <Head title={l.hero_title} />
            <div className="min-h-screen bg-white">
                {/* Navigation */}
                <nav className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
                    <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
                                <span className="text-lg font-bold text-white">W</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">WSIT POS</span>
                        </Link>
                        <div className="hidden items-center gap-8 md:flex">
                            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                Features
                            </a>
                            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                Pricing
                            </a>
                            <a href="#testimonials" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                Testimonials
                            </a>
                            <a href="#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                                FAQ
                            </a>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login()}
                                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={login()}
                                        className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-green-50 pt-24">
                    <div className="absolute inset-0">
                        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-brand-100 opacity-60 blur-3xl" />
                        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-green-100 opacity-60 blur-3xl" />
                    </div>
                    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <span className="inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-medium text-brand">
                                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                                Made for Bangladesh
                            </span>
                            <h1 className="mt-8 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
                                {l.hero_title}
                            </h1>
                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                                {l.hero_subtitle}
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-4">
                                <Link
                                    href={login()}
                                    className="rounded-xl bg-brand px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark hover:shadow-xl"
                                >
                                    {l.hero_cta_text}
                                </Link>
                                <a
                                    href="#features"
                                    className="rounded-xl border border-gray-200 bg-white px-8 py-3.5 text-base font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Learn More
                                </a>
                            </div>
                        </div>
                        {/* Hero Image Mockup */}
                        <div className="mx-auto mt-16 max-w-5xl">
                            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl">
                                <div className="rounded-xl bg-gray-50 p-6">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="h-3 w-3 rounded-full bg-red-400" />
                                        <div className="h-3 w-3 rounded-full bg-yellow-400" />
                                        <div className="h-3 w-3 rounded-full bg-green-400" />
                                        <span className="ml-4 text-sm text-gray-400">POS Terminal</span>
                                    </div>
                                    <div className="grid grid-cols-12 gap-4">
                                        <div className="col-span-8 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                                            <div className="grid grid-cols-4 gap-3">
                                                {['Miniket Rice', 'Coca-Cola', 'Oreo', 'Lifebuoy', 'Nescafe', 'Lays', 'Colgate', 'Head & Shoulders'].map(
                                                    (item) => (
                                                        <div key={item} className="rounded-lg border border-gray-100 p-3 text-center hover:border-brand-200 hover:bg-brand-50 transition">
                                                            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-100 text-brand text-sm font-bold">
                                                                {item[0]}
                                                            </div>
                                                            <p className="text-xs font-medium text-gray-700 truncate">{item}</p>
                                                            <p className="text-xs text-brand font-semibold">৳{Math.floor(Math.random() * 200 + 30)}</p>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-span-4 rounded-lg bg-white p-4 shadow-sm border border-gray-100">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-3">Current Bill</h3>
                                            <div className="space-y-2 text-sm">
                                                {[
                                                    { name: 'Miniket Rice', qty: 2, price: 150 },
                                                    { name: 'Coca-Cola', qty: 3, price: 255 },
                                                    { name: 'Oreo', qty: 1, price: 45 },
                                                ].map((i) => (
                                                    <div key={i.name} className="flex justify-between text-gray-600">
                                                        <span>{i.name} x{i.qty}</span>
                                                        <span className="font-medium">৳{i.price}</span>
                                                    </div>
                                                ))}
                                                <div className="border-t border-gray-100 pt-2 mt-2">
                                                    <div className="flex justify-between font-semibold text-gray-900">
                                                        <span>Total</span>
                                                        <span className="text-brand font-semibold">৳450</span>
                                                    </div>
                                                </div>
                                                <button className="mt-3 w-full rounded-lg bg-brand py-2 text-sm font-semibold text-white">
                                                    Pay with bKash
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 border-b border-gray-100">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl font-bold tracking-tight text-gray-900">{l.stats_title}</h2>
                            <p className="mt-2 text-base text-gray-600">{l.stats_subtitle}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                            {l.stats?.map((stat, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-3xl font-bold text-brand sm:text-4xl">{stat.value}</div>
                                    <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Logos Section */}
                <section className="py-16 bg-gray-50">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <p className="text-center text-sm font-medium uppercase tracking-widest text-gray-500">{l.logos_title}</p>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                            {l.logos?.map((logo) => (
                                <div key={logo} className="flex items-center gap-2 text-xl font-bold text-gray-300 transition hover:text-gray-500">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-sm text-gray-500">
                                        {logo[0]}
                                    </div>
                                    {logo}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{l.features_title}</h2>
                            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">{l.features_subtitle}</p>
                        </div>
                        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                            {l.features?.map((feature) => (
                                <div
                                    key={feature.title}
                                    className="group rounded-2xl border border-gray-100 p-8 transition hover:border-brand-100 hover:bg-brand-50/50 hover:shadow-lg"
                                >
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand transition group-hover:bg-brand group-hover:text-white">
                                        <span className="text-xl font-bold">{feature.icon[0]}</span>
                                    </div>
                                    <h3 className="mt-5 text-lg font-semibold text-gray-900">{feature.title}</h3>
                                    <p className="mt-2 text-sm leading-6 text-gray-600">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{l.pricing_title}</h2>
                            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">{l.pricing_subtitle}</p>
                        </div>
                        <div className="mt-16 grid gap-8 lg:grid-cols-3">
                            {l.pricing?.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`relative rounded-2xl border-2 p-8 transition ${
                                        plan.highlighted
                                            ? 'border-brand bg-white shadow-xl shadow-brand/10'
                                            : 'border-gray-200 bg-white'
                                    }`}
                                >
                                    {plan.highlighted && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-brand px-4 py-1 text-xs font-semibold text-white">
                                            Most Popular
                                        </div>
                                    )}
                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                    <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
                                    <div className="mt-4 flex items-baseline gap-1">
                                        <span className="text-sm font-medium text-gray-500">৳</span>
                                        <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                                        <span className="text-sm text-gray-500">{plan.period}</span>
                                    </div>
                                    <ul className="mt-8 space-y-3">
                                        {plan.features.map((feature) => (
                                            <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                                                <svg className="h-5 w-5 shrink-0 text-brand" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                </svg>
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Link
                                        href={login()}
                                            className={`mt-8 block w-full rounded-xl py-3 text-center text-sm font-semibold transition ${
                                                plan.highlighted
                                                    ? 'bg-brand text-white hover:bg-brand-dark'
                                                    : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section id="testimonials" className="py-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{l.testimonials_title}</h2>
                        </div>
                        <div className="mt-16 grid gap-8 md:grid-cols-3">
                            {l.testimonials?.map((testimonial) => (
                                <div key={testimonial.name} className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="mt-4 text-sm leading-6 text-gray-600">"{testimonial.text}"</p>
                                    <div className="mt-6 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand">
                                            {testimonial.name[0]}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">{testimonial.name}</p>
                                            <p className="text-xs text-gray-500">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="bg-gray-50 py-20">
                    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{l.faq_title}</h2>
                            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-600">{l.faq_subtitle}</p>
                        </div>
                        <div className="mt-12 divide-y divide-gray-200">
                            {l.faq?.map((faq, i) => (
                                <FaqItem key={i} faq={faq} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-brand py-20">
                    <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{l.cta_title}</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-100">{l.cta_subtitle}</p>
                        <div className="mt-8 flex items-center justify-center gap-4">
                            <Link
                                href={login()}
                                className="rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-brand shadow-lg transition hover:bg-gray-50"
                            >
                                {l.cta_button_text}
                            </Link>
                            <a
                                href="#pricing"
                                className="rounded-xl border border-brand-200 px-8 py-3.5 text-base font-semibold text-white transition hover:bg-brand-dark"
                            >
                                View Pricing
                            </a>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-gray-100 bg-white py-12">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                            <div className="flex items-center gap-2">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
                                    <span className="text-sm font-bold text-white">W</span>
                                </div>
                                <span className="text-sm font-semibold text-gray-900">{l.footer_text}</span>
                            </div>
                            <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} WebSpace IT. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
