declare module 'customMain/components' {
    export const Button: React.ComponentType<any>;
    export const TextInput: React.ComponentType<any>;
    export const Select: React.ComponentType<any>;
    export type SelectOption = any;
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
