import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type FormErrorProps = {
  message?: string;
  className?: string;
};

export const FormError: React.FC<FormErrorProps> = ({ message, className }) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-red-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive",
        className
      )}
    >
      <ExclamationTriangleIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
