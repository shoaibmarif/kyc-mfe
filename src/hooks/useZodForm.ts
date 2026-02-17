import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z, ZodTypeAny } from 'zod';

interface UseZodFormProps<TSchema extends ZodTypeAny> extends UseFormProps<z.infer<TSchema>> {
    schema: TSchema;
}

/**
 * Typed react-hook-form helper wired to a Zod schema.
 */
export function useZodForm<TSchema extends ZodTypeAny>(
    props: UseZodFormProps<TSchema>,
): UseFormReturn<z.infer<TSchema>> {
    const { schema, ...formProps } = props;

    return useForm<z.infer<TSchema>>({
        resolver: zodResolver(schema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        ...formProps,
    });
}
