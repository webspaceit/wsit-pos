export function formatCurrency(amount: number, symbol = '৳'): string {
    return `${symbol}${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function formatDateTime(date: string): string {
    return new Date(date).toLocaleString('en-BD', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export const PAYMENT_METHODS = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'bkash', label: 'bKash' },
    { value: 'nagad', label: 'Nagad' },
    { value: 'rocket', label: 'Rocket' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'other', label: 'Other' },
] as const;

export const STATUSES = {
    sale: [
        { value: 'completed', label: 'Completed' },
        { value: 'void', label: 'Void' },
        { value: 'pending', label: 'Pending' },
    ],
    purchase: [
        { value: 'pending', label: 'Pending' },
        { value: 'received', label: 'Received' },
        { value: 'cancelled', label: 'Cancelled' },
    ],
} as const;
