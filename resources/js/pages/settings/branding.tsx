import { Head, router, useForm } from '@inertiajs/react';
import { useRef } from 'react';
import AppLayout from '@/layouts/app-layout';

interface Props {
    logo: string | null;
    favicon: string | null;
}

export default function Branding({ logo, favicon }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Branding', href: '/branding' }]}>
            <Head title="Branding Settings" />
            <div className="p-4 max-w-3xl space-y-6">
                <h1 className="text-lg font-semibold">Branding</h1>
                <p className="text-sm text-muted-foreground">Customize your logo and favicon that appear across the application.</p>

                <LogoSection currentLogo={logo} />
                <FaviconSection currentFavicon={favicon} />
            </div>
        </AppLayout>
    );
}

function LogoSection({ currentLogo }: { currentLogo: string | null }) {
    const { data, setData, post, processing } = useForm<{ logo: File | null }>({ logo: null });
    const fileRef = useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.logo) return;
        post('/branding/logo', { forceFormData: true, onSuccess: () => setData('logo', null) });
    };

    const remove = () => {
        if (confirm('Remove current logo?')) {
            router.delete('/branding/logo');
        }
    };

    return (
        <section className="rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Logo</h3>
            <p className="text-sm text-muted-foreground">This logo appears in the sidebar and header. Recommended size: 200x200px, max 2MB.</p>

            <div className="flex items-start gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed bg-muted/30">
                    {currentLogo ? (
                        <img src={`/storage/${currentLogo}`} alt="Current logo" className="h-20 w-20 rounded-lg object-contain" />
                    ) : (
                        <span className="text-xs text-muted-foreground">No logo</span>
                    )}
                </div>

                <div className="flex-1 space-y-3">
                    <form onSubmit={submit} className="space-y-3">
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => setData('logo', e.target.files?.[0] || null)} />
                        <div className="flex gap-2">
                            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition">
                                Choose Image
                            </button>
                            <button type="submit" disabled={!data.logo || processing} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
                                {processing ? 'Uploading...' : 'Upload Logo'}
                            </button>
                            {currentLogo && (
                                <button type="button" onClick={remove} className="rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition">
                                    Remove
                                </button>
                            )}
                        </div>
                        {data.logo && <p className="text-xs text-muted-foreground">Selected: {data.logo.name}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
}

function FaviconSection({ currentFavicon }: { currentFavicon: string | null }) {
    const { data, setData, post, processing } = useForm<{ favicon: File | null }>({ favicon: null });
    const fileRef = useRef<HTMLInputElement>(null);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.favicon) return;
        post('/branding/favicon', { forceFormData: true, onSuccess: () => setData('favicon', null) });
    };

    const remove = () => {
        if (confirm('Remove current favicon?')) {
            router.delete('/branding/favicon');
        }
    };

    return (
        <section className="rounded-xl border p-6 space-y-4">
            <h3 className="font-semibold text-base border-b pb-2">Favicon</h3>
            <p className="text-sm text-muted-foreground">The small icon shown in browser tabs. Recommended: 32x32px ICO, PNG, or SVG, max 512KB.</p>

            <div className="flex items-start gap-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-lg border-2 border-dashed bg-muted/30">
                    {currentFavicon ? (
                        <img src={`/storage/${currentFavicon}`} alt="Current favicon" className="h-10 w-10 object-contain" />
                    ) : (
                        <span className="text-xs text-muted-foreground">Default</span>
                    )}
                </div>

                <div className="flex-1 space-y-3">
                    <form onSubmit={submit} className="space-y-3">
                        <input ref={fileRef} type="file" accept="image/ico,image/png,image/svg+xml,.ico,.png,.svg" className="hidden" onChange={(e) => setData('favicon', e.target.files?.[0] || null)} />
                        <div className="flex gap-2">
                            <button type="button" onClick={() => fileRef.current?.click()} className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted transition">
                                Choose File
                            </button>
                            <button type="submit" disabled={!data.favicon || processing} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50">
                                {processing ? 'Uploading...' : 'Upload Favicon'}
                            </button>
                            {currentFavicon && (
                                <button type="button" onClick={remove} className="rounded-md border border-destructive/30 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition">
                                    Remove
                                </button>
                            )}
                        </div>
                        {data.favicon && <p className="text-xs text-muted-foreground">Selected: {data.favicon.name}</p>}
                    </form>
                </div>
            </div>
        </section>
    );
}
