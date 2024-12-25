import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function LoadingSpinner() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <ArrowPathIcon className="w-8 h-8 animate-spin" />
    </div>
  );
}
