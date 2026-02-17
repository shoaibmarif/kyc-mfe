import { FieldValues, type Resolver, useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ZodTypeAny } from 'zod';

interface UseZodFormProps<TFieldValues extends FieldValues>
    extends UseFormProps<TFieldValues> {
    schema: ZodTypeAny;
}

/**
 * Typed react-hook-form helper wired to a Zod schema.
 */
export function useZodForm<TFieldValues extends FieldValues>(
    props: UseZodFormProps<TFieldValues>,
): UseFormReturn<TFieldValues> {
    const { schema, ...formProps } = props;

    const resolver = zodResolver(schema as ZodTypeAny) as Resolver<TFieldValues>;

    return useForm<TFieldValues>({
        resolver,
        mode: 'onChange',
        reValidateMode: 'onChange',
        ...formProps,
    });
}
