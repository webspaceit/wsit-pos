import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

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

interface NavLink {
    label: string;
    href: string;
}

interface Stat {
    value: string;
    label: string;
}

interface Faq {
    question: string;
    answer: string;
}

interface Props {
    landing: Record<string, string>;
}

export default function LandingPageSettings({ landing }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        logo_text: landing.logo_text || '',
        nav_links: (typeof landing.nav_links === 'string' ? JSON.parse(landing.nav_links) : landing.nav_links || []) as NavLink[],
        hero_title: landing.hero_title || '',
        hero_subtitle: landing.hero_subtitle || '',
        hero_cta_text: landing.hero_cta_text || '',
        stats_title: landing.stats_title || '',
        stats_subtitle: landing.stats_subtitle || '',
        stats: (typeof landing.stats === 'string' ? JSON.parse(landing.stats) : landing.stats || []) as Stat[],
        logos_title: landing.logos_title || '',
        logos: (typeof landing.logos === 'string' ? JSON.parse(landing.logos) : landing.logos || []) as string[],
        features_title: landing.features_title || '',
        features_subtitle: landing.features_subtitle || '',
        features: (typeof landing.features === 'string' ? JSON.parse(landing.features) : landing.features || []) as Feature[],
        pricing_title: landing.pricing_title || '',
        pricing_subtitle: landing.pricing_subtitle || '',
        pricing: (typeof landing.pricing === 'string' ? JSON.parse(landing.pricing) : landing.pricing || []) as PricingPlan[],
        testimonials_title: landing.testimonials_title || '',
        testimonials: (typeof landing.testimonials === 'string' ? JSON.parse(landing.testimonials) : landing.testimonials || []) as Testimonial[],
        faq_title: landing.faq_title || '',
        faq_subtitle: landing.faq_subtitle || '',
        faq: (typeof landing.faq === 'string' ? JSON.parse(landing.faq) : landing.faq || []) as Faq[],
        cta_title: landing.cta_title || '',
        cta_subtitle: landing.cta_subtitle || '',
        cta_button_text: landing.cta_button_text || '',
        footer_text: landing.footer_text || '',
        footer_copyright: landing.footer_copyright || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/landing-page');
    };

    const updateNavLink = (index: number, field: keyof NavLink, value: string) => {
        const updated = [...data.nav_links];
        updated[index] = { ...updated[index], [field]: value };
        setData('nav_links', updated);
    };

    const addNavLink = () => setData('nav_links', [...data.nav_links, { label: '', href: '' }]);
    const removeNavLink = (index: number) => setData('nav_links', data.nav_links.filter((_, i) => i !== index));

    const updateFeature = (index: number, field: keyof Feature, value: string) => {
        const updated = [...data.features];
        updated[index] = { ...updated[index], [field]: value };
        setData('features', updated);
    };

    const addFeature = () => setData('features', [...data.features, { icon: 'Star', title: '', description: '' }]);
    const removeFeature = (index: number) => setData('features', data.features.filter((_, i) => i !== index));

    const updatePlan = (index: number, field: keyof PricingPlan, value: string | boolean) => {
        const updated = [...data.pricing];
        updated[index] = { ...updated[index], [field]: value };
        setData('pricing', updated);
    };

    const updatePlanFeatures = (planIndex: number, featuresStr: string) => {
        const updated = [...data.pricing];
        updated[planIndex] = { ...updated[planIndex], features: featuresStr.split('\n').filter(Boolean) };
        setData('pricing', updated);
    };

    const addPlan = () => setData('pricing', [...data.pricing, { name: '', price: '', period: '/month', description: '', features: [], highlighted: false }]);
    const removePlan = (index: number) => setData('pricing', data.pricing.filter((_, i) => i !== index));

    const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
        const updated = [...data.testimonials];
        updated[index] = { ...updated[index], [field]: value };
        setData('testimonials', updated);
    };

    const addTestimonial = () => setData('testimonials', [...data.testimonials, { name: '', role: '', text: '' }]);
    const removeTestimonial = (index: number) => setData('testimonials', data.testimonials.filter((_, i) => i !== index));

    const updateStat = (index: number, field: keyof Stat, value: string) => {
        const updated = [...data.stats];
        updated[index] = { ...updated[index], [field]: value };
        setData('stats', updated);
    };

    const addStat = () => setData('stats', [...data.stats, { value: '', label: '' }]);
    const removeStat = (index: number) => setData('stats', data.stats.filter((_, i) => i !== index));

    const updateLogo = (index: number, value: string) => {
        const updated = [...data.logos];
        updated[index] = value;
        setData('logos', updated);
    };

    const addLogo = () => setData('logos', [...data.logos, '']);
    const removeLogo = (index: number) => setData('logos', data.logos.filter((_, i) => i !== index));

    const updateFaq = (index: number, field: keyof Faq, value: string) => {
        const updated = [...data.faq];
        updated[index] = { ...updated[index], [field]: value };
        setData('faq', updated);
    };

    const addFaq = () => setData('faq', [...data.faq, { question: '', answer: '' }]);
    const removeFaq = (index: number) => setData('faq', data.faq.filter((_, i) => i !== index));

    return (
        <AppLayout breadcrumbs={[{ title: 'Settings', href: '/settings' }, { title: 'Landing Page', href: '/settings/landing-page' }]}>
            <Head title="Landing Page Settings" />
            <div className="p-4 max-w-4xl space-y-4">
                <h1 className="text-lg font-semibold">Landing Page</h1>
                <p className="text-sm text-muted-foreground">Manage the content displayed on the public landing page</p>

                <form onSubmit={submit} className="space-y-6">
                    {/* Navigation Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Navigation / Header</h3>
                        <Field label="Logo Text" value={data.logo_text} onChange={(v) => setData('logo_text', v)} />

                        <div className="space-y-3 mt-4">
                            {data.nav_links.map((link, i) => (
                                <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                    <input type="text" value={link.label} onChange={(e) => updateNavLink(i, 'label', e.target.value)} placeholder="Label (e.g. Features)" className="flex-1 rounded-md border px-3 py-2 text-sm bg-background" />
                                    <input type="text" value={link.href} onChange={(e) => updateNavLink(i, 'href', e.target.value)} placeholder="Href (e.g. #features)" className="flex-1 rounded-md border px-3 py-2 text-sm bg-background" />
                                    <button type="button" onClick={() => removeNavLink(i)} className="text-xs text-destructive hover:text-destructive/80">Remove</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addNavLink} className="text-sm text-primary hover:text-primary/80 font-medium">+ Add Nav Link</button>
                    </section>

                    {/* Hero Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Hero Section</h3>
                        <Field label="Title" value={data.hero_title} onChange={(v) => setData('hero_title', v)} error={errors.hero_title} />
                        <Textarea label="Subtitle" value={data.hero_subtitle} onChange={(v) => setData('hero_subtitle', v)} error={errors.hero_subtitle} />
                        <Field label="CTA Button Text" value={data.hero_cta_text} onChange={(v) => setData('hero_cta_text', v)} />
                    </section>

                    {/* Stats Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Stats Section</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Section Title" value={data.stats_title} onChange={(v) => setData('stats_title', v)} />
                            <Field label="Section Subtitle" value={data.stats_subtitle} onChange={(v) => setData('stats_subtitle', v)} />
                        </div>

                        <div className="space-y-3 mt-4">
                            {data.stats.map((stat, i) => (
                                <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                    <input type="text" value={stat.value} onChange={(e) => updateStat(i, 'value', e.target.value)} placeholder="Value (e.g. 2,500+)" className="flex-1 rounded-md border px-3 py-2 text-sm bg-background" />
                                    <input type="text" value={stat.label} onChange={(e) => updateStat(i, 'label', e.target.value)} placeholder="Label (e.g. Active Businesses)" className="flex-1 rounded-md border px-3 py-2 text-sm bg-background" />
                                    <button type="button" onClick={() => removeStat(i)} className="text-xs text-destructive hover:text-destructive/80">Remove</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addStat} className="text-sm text-primary hover:text-primary/80 font-medium">+ Add Stat</button>
                    </section>

                    {/* Logos Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Trusted Brands / Logos</h3>
                        <Field label="Section Title" value={data.logos_title} onChange={(v) => setData('logos_title', v)} />

                        <div className="space-y-3 mt-4">
                            {data.logos.map((logo, i) => (
                                <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                                    <input type="text" value={logo} onChange={(e) => updateLogo(i, e.target.value)} placeholder="Brand name (e.g. Shwapno)" className="flex-1 rounded-md border px-3 py-2 text-sm bg-background" />
                                    <button type="button" onClick={() => removeLogo(i)} className="text-xs text-destructive hover:text-destructive/80">Remove</button>
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addLogo} className="text-sm text-primary hover:text-primary/80 font-medium">+ Add Brand</button>
                    </section>

                    {/* Features Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Features Section</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Section Title" value={data.features_title} onChange={(v) => setData('features_title', v)} />
                            <Field label="Section Subtitle" value={data.features_subtitle} onChange={(v) => setData('features_subtitle', v)} />
                        </div>

                        <div className="space-y-4 mt-4">
                            {data.features.map((feature, i) => (
                                <div key={i} className="rounded-lg bg-muted/50 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Feature {i + 1}</span>
                                        <button type="button" onClick={() => removeFeature(i)} className="text-xs text-destructive hover:text-destructive/80">Remove</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Icon Name" value={feature.icon} onChange={(v) => updateFeature(i, 'icon', v)} />
                                        <Field label="Title" value={feature.title} onChange={(v) => updateFeature(i, 'title', v)} />
                                    </div>
                                    <Textarea label="Description" value={feature.description} onChange={(v) => updateFeature(i, 'description', v)} />
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addFeature} className="text-sm text-primary hover:text-primary/80 font-medium">+ Add Feature</button>
                    </section>

                    {/* Pricing Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Pricing Section</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Section Title" value={data.pricing_title} onChange={(v) => setData('pricing_title', v)} />
                            <Field label="Section Subtitle" value={data.pricing_subtitle} onChange={(v) => setData('pricing_subtitle', v)} />
                        </div>

                        <div className="space-y-4 mt-4">
                            {data.pricing.map((plan, i) => (
                                <div key={i} className="rounded-lg bg-muted/50 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Plan {i + 1}</span>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-1 text-xs">
                                                <input type="checkbox" checked={plan.highlighted} onChange={(e) => updatePlan(i, 'highlighted', e.target.checked)} className="rounded" />
                                                Highlighted
                                            </label>
                                            <button type="button" onClick={() => removePlan(i)} className="text-xs text-destructive hover:text-destructive/80">Remove</button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3">
                                        <Field label="Plan Name" value={plan.name} onChange={(v) => updatePlan(i, 'name', v)} />
                                        <Field label="Price (৳)" value={plan.price} onChange={(v) => updatePlan(i, 'price', v)} />
                                        <Field label="Period" value={plan.period} onChange={(v) => updatePlan(i, 'period', v)} />
                                    </div>
                                    <Field label="Description" value={plan.description} onChange={(v) => updatePlan(i, 'description', v)} />
                                    <Textarea label="Features (one per line)" value={plan.features.join('\n')} onChange={(v) => updatePlanFeatures(i, v)} />
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addPlan} className="text-sm text-primary hover:text-primary/80 font-medium">+ Add Plan</button>
                    </section>

                    {/* Testimonials Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Testimonials Section</h3>
                        <Field label="Section Title" value={data.testimonials_title} onChange={(v) => setData('testimonials_title', v)} />

                        <div className="space-y-4 mt-4">
                            {data.testimonials.map((t, i) => (
                                <div key={i} className="rounded-lg bg-muted/50 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Testimonial {i + 1}</span>
                                        <button type="button" onClick={() => removeTestimonial(i)} className="text-xs text-destructive hover:text-destructive/80">Remove</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Name" value={t.name} onChange={(v) => updateTestimonial(i, 'name', v)} />
                                        <Field label="Role" value={t.role} onChange={(v) => updateTestimonial(i, 'role', v)} />
                                    </div>
                                    <Textarea label="Testimonial Text" value={t.text} onChange={(v) => updateTestimonial(i, 'text', v)} />
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addTestimonial} className="text-sm text-primary hover:text-primary/80 font-medium">+ Add Testimonial</button>
                    </section>

                    {/* FAQ Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">FAQ Section</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Section Title" value={data.faq_title} onChange={(v) => setData('faq_title', v)} />
                            <Field label="Section Subtitle" value={data.faq_subtitle} onChange={(v) => setData('faq_subtitle', v)} />
                        </div>

                        <div className="space-y-4 mt-4">
                            {data.faq.map((item, i) => (
                                <div key={i} className="rounded-lg bg-muted/50 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">FAQ {i + 1}</span>
                                        <button type="button" onClick={() => removeFaq(i)} className="text-xs text-destructive hover:text-destructive/80">Remove</button>
                                    </div>
                                    <Field label="Question" value={item.question} onChange={(v) => updateFaq(i, 'question', v)} />
                                    <Textarea label="Answer" value={item.answer} onChange={(v) => updateFaq(i, 'answer', v)} />
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addFaq} className="text-sm text-primary hover:text-primary/80 font-medium">+ Add FAQ</button>
                    </section>

                    {/* CTA Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Call to Action Section</h3>
                        <Field label="Title" value={data.cta_title} onChange={(v) => setData('cta_title', v)} />
                        <Textarea label="Subtitle" value={data.cta_subtitle} onChange={(v) => setData('cta_subtitle', v)} />
                        <Field label="Button Text" value={data.cta_button_text} onChange={(v) => setData('cta_button_text', v)} />
                    </section>

                    {/* Footer */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Footer</h3>
                        <Field label="Footer Text" value={data.footer_text} onChange={(v) => setData('footer_text', v)} />
                        <Field label="Copyright Text" value={data.footer_copyright} onChange={(v) => setData('footer_copyright', v)} />
                    </section>

                    <div className="flex justify-end pt-2 pb-8">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-primary px-6 py-2 text-sm text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50"
                        >
                            {processing ? 'Saving...' : 'Save Landing Page'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({
    label,
    value,
    onChange,
    error,
    type = 'text',
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    type?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    );
}

function Textarea({
    label,
    value,
    onChange,
    error,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border bg-background px-3 py-2 text-sm" rows={3} />
            {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        </div>
    );
}
