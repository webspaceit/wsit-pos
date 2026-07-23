import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('success', (event) => {
            const flash = (event.detail as any)?.page?.props?.flash;

            if (flash?.success) {
                toast.success(flash.success);
            }

            if (flash?.error) {
                toast.error(flash.error);
            }

            if (flash?.message) {
                toast.info(flash.message);
            }
        });
    }, []);
}
