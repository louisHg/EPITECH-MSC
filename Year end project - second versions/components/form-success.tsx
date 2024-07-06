import { CheckCircledIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

export type FormSuccessProps = {
  message?: string;
  className?: string;
};

export const FormSuccess: React.FC<FormSuccessProps> = ({
  message,
  className,
}) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500",
        className
      )}
    >
      <CheckCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};
