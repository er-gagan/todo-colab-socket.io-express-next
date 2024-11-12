import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import moment from 'moment';

export const showLoader = () => {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = "block"
    }
}
export const hideLoader = () => {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = "none"
    }
}
export const handleNavigation = ({ path, router }: { path: string, router: AppRouterInstance }) => {
    if (location.pathname !== path) {
        showLoader()
    }
    router.push(path)
}

// Debounce function
export function debounce(fn: (...args: any[]) => void, delay: number): (...args: any[]) => void {
    let timeoutId: NodeJS.Timeout | null = null;
    return function (...args: any[]) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    };
}

export const getTimeStampDate = () => {
    const date: Date = new Date()
    const timestampDate: number = date.valueOf() / 1000
    const data = Math.floor(timestampDate)
    return data
}

export const getTokenAge = ({ inDays, inHours, inMinutes, inSeconds }: { inDays?: number, inHours?: number, inMinutes?: number, inSeconds?: number }) => {

    let tokenAge: number;

    if (inDays) {
        tokenAge = inDays * 24 * 60 * 60 * 1000
    } else if (inHours) {
        tokenAge = inHours * 60 * 60 * 1000
    } else if (inMinutes) {
        tokenAge = inMinutes * 60 * 1000
    } else if (inSeconds) {
        tokenAge = inSeconds * 1000
    } else {
        tokenAge = 60 * 24 * 60 * 60 * 1000  // 1 day default
    }

    return tokenAge
}

export const getDateFromISO8601 = ({ isoDate, showTime = false }: { isoDate: string, showTime?: boolean }) => {
    if (!isoDate) {
        return null
    }
    return moment(isoDate).format(showTime ? "DD-MMM-YYYY hh:mm:ss A" : "DD-MMM-YYYY")
}

export const truncateString = (str: string, num: number) => {
    if (!str) return '';
    if (str.length > num) {
        return str.slice(0, num) + '...';
    } else {
        return str;
    }
};