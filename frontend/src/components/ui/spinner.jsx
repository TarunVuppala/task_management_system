import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Spinner = ({ className }) => {
  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Loader2 className="animate-spin h-10 w-10 text-primary" />
    </div>
  );
};
