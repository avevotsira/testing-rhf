import * as React from "react";

// ponytail: minimal stand-ins — the spec assumed these existed; swap for shadcn's
// input-group when/if it gets installed.
export function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={`flex items-center rounded-md border border-input focus-within:ring-2 focus-within:ring-ring ${className ?? ""}`}
      {...props}
    />
  );
}

export function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={`w-full bg-transparent px-3 py-2 outline-none ${className ?? ""}`}
      {...props}
    />
  );
}

export function InputGroupAddon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={`px-3 text-sm text-gray-500 ${className ?? ""}`} {...props} />
  );
}
