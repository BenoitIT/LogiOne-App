interface InputErrorProps {
    errors: Record<string, string | undefined>;
    fieldName: string;
}

export const InputError = ({
    errors,
    fieldName,
}: InputErrorProps) => {
    return (
        <span
            className={errors[fieldName] ? 'text-xs text-red-500' : 'hidden'}
        >
            {errors[fieldName]}
        </span>
    );
};
