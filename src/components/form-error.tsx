import { FaExclamationCircle } from "react-icons/fa";

interface FormErrorProps {
    message: string;
}

export const FormError = ({ message }: FormErrorProps) => {
    if(!message) return null;

    return (
        <div className="bg bg-destructive/15 p-3 rounded-md flex items-center text-sm gap-x-2 text-destructive">
            <FaExclamationCircle className="mr-2" />
            <p>{message}</p>
        </div>
    );
}
