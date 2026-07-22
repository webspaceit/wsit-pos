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

interface Props {
    landing: Record<string, string>;
}

export default function LandingPageSettings({ landing }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        hero_title: landing.hero_title || '',
        hero_subtitle: landing.hero_subtitle || '',
        hero_cta_text: landing.hero_cta_text || '',
        features_title: landing.features_title || '',
        features_subtitle: landing.features_subtitle || '',
        features: (typeof landing.features === 'string' ? JSON.parse(landing.features) : landing.features || []) as Feature[],
        pricing_title: landing.pricing_title || '',
        pricing_subtitle: landing.pricing_subtitle || '',
        pricing: (typeof landing.pricing === 'string' ? JSON.parse(landing.pricing) : landing.pricing || []) as PricingPlan[],
        testimonials_title: landing.testimonials_title || '',
        testimonials: (typeof landing.testimonials === 'string' ? JSON.parse(landing.testimonials) : landing.testimonials || []) as Testimonial[],
        cta_title: landing.cta_title || '',
        cta_subtitle: landing.cta_subtitle || '',
        cta_button_text: landing.cta_button_text || '',
        footer_text: landing.footer_text || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/settings/landing-page');
    };

    const updateFeature = (index: number, field: keyof Feature, value: string) => {
        const updated = [...data.features];
        updated[index] = { ...updated[index], [field]: value };
        setData('features', updated);
    };

    const addFeature = () => {
        setData('features', [...data.features, { icon: 'Star', title: '', description: '' }]);
    };

    const removeFeature = (index: number) => {
        setData('features', data.features.filter((_, i) => i !== index));
    };

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

    const addPlan = () => {
        setData('pricing', [...data.pricing, { name: '', price: '', period: '/month', description: '', features: [], highlighted: false }]);
    };

    const removePlan = (index: number) => {
        setData('pricing', data.pricing.filter((_, i) => i !== index));
    };

    const updateTestimonial = (index: number, field: keyof Testimonial, value: string) => {
        const updated = [...data.testimonials];
        updated[index] = { ...updated[index], [field]: value };
        setData('testimonials', updated);
    };

    const addTestimonial = () => {
        setData('testimonials', [...data.testimonials, { name: '', role: '', text: '' }]);
    };

    const removeTestimonial = (index: number) => {
        setData('testimonials', data.testimonials.filter((_, i) => i !== index));
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Settings', href: '/settings' }, { title: 'Landing Page', href: '/settings/landing-page' }]}>
            <Head title="Landing Page Settings" />
            <div className="p-4 max-w-3xl">
                <h2 className="text-xl font-semibold mb-4">Landing Page Settings</h2>
                <form onSubmit={submit} className="space-y-6">
                    {/* Hero Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Hero Section</h3>
                        <Field label="Title" value={data.hero_title} onChange={(v) => setData('hero_title', v)} error={errors.hero_title} />
                        <Textarea label="Subtitle" value={data.hero_subtitle} onChange={(v) => setData('hero_subtitle', v)} error={errors.hero_subtitle} />
                        <Field label="CTA Button Text" value={data.hero_cta_text} onChange={(v) => setData('hero_cta_text', v)} />
                    </section>

                    {/* Features Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Features Section</h3>
                        <Field label="Section Title" value={data.features_title} onChange={(v) => setData('features_title', v)} />
                        <Field label="Section Subtitle" value={data.features_subtitle} onChange={(v) => setData('features_subtitle', v)} />

                        <div className="space-y-4 mt-4">
                            {data.features.map((feature, i) => (
                                <div key={i} className="rounded-lg bg-gray-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Feature {i + 1}</span>
                                        <button type="button" onClick={() => removeFeature(i)} className="text-xs text-red-600 hover:text-red-800">Remove</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Icon Name" value={feature.icon} onChange={(v) => updateFeature(i, 'icon', v)} />
                                        <Field label="Title" value={feature.title} onChange={(v) => updateFeature(i, 'title', v)} />
                                    </div>
                                    <Textarea label="Description" value={feature.description} onChange={(v) => updateFeature(i, 'description', v)} />
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addFeature} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Feature</button>
                    </section>

                    {/* Pricing Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Pricing Section</h3>
                        <Field label="Section Title" value={data.pricing_title} onChange={(v) => setData('pricing_title', v)} />
                        <Field label="Section Subtitle" value={data.pricing_subtitle} onChange={(v) => setData('pricing_subtitle', v)} />

                        <div className="space-y-4 mt-4">
                            {data.pricing.map((plan, i) => (
                                <div key={i} className="rounded-lg bg-gray-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Plan {i + 1}</span>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-1 text-xs">
                                                <input type="checkbox" checked={plan.highlighted} onChange={(e) => updatePlan(i, 'highlighted', e.target.checked)} className="rounded" />
                                                Highlighted
                                            </label>
                                            <button type="button" onClick={() => removePlan(i)} className="text-xs text-red-600 hover:text-red-800">Remove</button>
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
                        <button type="button" onClick={addPlan} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Plan</button>
                    </section>

                    {/* Testimonials Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Testimonials Section</h3>
                        <Field label="Section Title" value={data.testimonials_title} onChange={(v) => setData('testimonials_title', v)} />

                        <div className="space-y-4 mt-4">
                            {data.testimonials.map((t, i) => (
                                <div key={i} className="rounded-lg bg-gray-50 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-sm">Testimonial {i + 1}</span>
                                        <button type="button" onClick={() => removeTestimonial(i)} className="text-xs text-red-600 hover:text-red-800">Remove</button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Name" value={t.name} onChange={(v) => updateTestimonial(i, 'name', v)} />
                                        <Field label="Role" value={t.role} onChange={(v) => updateTestimonial(i, 'role', v)} />
                                    </div>
                                    <Textarea label="Testimonial Text" value={t.text} onChange={(v) => updateTestimonial(i, 'text', v)} />
                                </div>
                            ))}
                        </div>
                        <button type="button" onClick={addTestimonial} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">+ Add Testimonial</button>
                    </section>

                    {/* CTA Section */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Call to Action Section</h3>
                        <Field label="Title" value={data.cta_title} onChange={(v) => setData('cta_title', v)} />
                        <Textarea label="Subtitle" value={data.cta_subtitle} onChange={(v) => setData('cta_subtitle', v)} />
                        <Field label="Button Text" value={data.cta_button_text} onChange={(v) => setData('cta_button_text', v)} />
                    </section>

                    {/* Footer */}
                    <section className="rounded-xl border p-6 space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Footer</h3>
                        <Field label="Footer Text" value={data.footer_text} onChange={(v) => setData('footer_text', v)} />
                    </section>

                    <div className="flex justify-end pt-4 pb-8">
                        <button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-6 py-2 text-sm text-white font-semibold hover:bg-indigo-700 disabled:opacity-50">
                            {processing ? 'Saving...' : 'Save Landing Page'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

function Field({ label, value, onChange, error, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; error?: string; type?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}

function Textarea({ label, value, onChange, error }: { label: string; value: string; onChange: (v: string) => void; error?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <textarea value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border px-3 py-2 text-sm" rows={3} />
            {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
        </div>
    );
}
