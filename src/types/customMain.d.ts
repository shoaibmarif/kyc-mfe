declare module 'customMain/components' {
    export const Button: React.ComponentType<any>;
    export const TextInput: React.ComponentType<any>;
    export const Select: React.ComponentType<any>;
    export const Checkbox: React.ComponentType<any>;
    export type SelectOption = any;
}

declare module 'customMain/hooks' {
    export function useZodForm<TFieldValues extends Record<string, any>>(props: {
        schema: any;
        defaultValues?: TFieldValues;
        mode?: string;
        reValidateMode?: string;
    }): any;
}

declare module 'customMain/utils' {
    export const showToast: {
        success: (message: string, testId?: string, options?: any) => void;
        error: (message: string, testId?: string, options?: any) => void;
        info: (message: string, testId?: string, options?: any) => void;
        warning: (message: string, testId?: string, options?: any) => void;
    };
}

declare module 'customMain/api' {
    interface ApiService {
        get<T = unknown>(url: string, config?: unknown): Promise<T>;
        post<T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T>;
        put<T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T>;
        patch<T = unknown>(url: string, data?: unknown, config?: unknown): Promise<T>;
        delete<T = unknown>(url: string, config?: unknown): Promise<T>;
    }

    const apiService: ApiService;
    export default apiService;
}

declare module 'customMain/api/api.service.types' {
    export type ApiSuccessResponse<_T = unknown> = any;
    export type ApiErrorResponse = any;
}

declare module 'customMain/observability' {
    export const Tracer: {
        mfeMounting(name: string): void;
        mfeMounted(name: string): void;
        mfeUnmounted(name: string): void;
        reportPageView(path: string): void;
        reportError(context: string, error: Error): void;
        isReady(): boolean;
        setUserContext(userId: string, role: string, email?: string): void;
        clearUserContext(): void;
        reportCustomEvent(
            eventName: string,
            tags?: Record<string, string | number | boolean>,
        ): void;
        reportLongTask(durationMs: number, mfeName?: string): void;
    };
    export function useMfeRouteTracker(): void;
}
