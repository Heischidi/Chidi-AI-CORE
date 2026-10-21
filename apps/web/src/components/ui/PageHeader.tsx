import React from 'react';

export default function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-[#8aab98] font-sans">
            {description}
          </p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}