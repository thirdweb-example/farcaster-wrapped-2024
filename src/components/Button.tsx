import React from 'react'

export function Button({ children, ...props }: React.ComponentPropsWithoutRef<"button">) {
  return <button {...props} className="bg-white text-slate-900 rounded-md py-2 px-4 font-semibold active:opacity-80">
      {children}
    </button>
}

