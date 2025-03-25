import React from 'react';

const Skeleton = ({ variant = 'rectangle', width, height, className = '' }) => {
  let baseClasses = 'bg-gray-700 animate-pulse';
  
  if (variant === 'text') {
    return <div className={`${baseClasses} rounded h-4 ${className}`} style={{ width }}></div>;
  }
  
  if (variant === 'circle') {
    return <div 
      className={`${baseClasses} rounded-full ${className}`} 
      style={{ width: width || 40, height: height || width || 40 }}
    ></div>;
  }
  
  return (
    <div 
      className={`${baseClasses} rounded-md ${className}`} 
      style={{ width, height }}
    ></div>
  );
};

export const CardSkeleton = () => (
  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-md">
    <Skeleton variant="text" className="w-3/4 mb-4 h-6" />
    <Skeleton variant="text" className="w-full mb-2" />
    <Skeleton variant="text" className="w-full mb-2" />
    <Skeleton variant="text" className="w-1/2 mb-4" />
    <div className="flex justify-end">
      <Skeleton variant="rectangle" width={80} height={32} className="rounded-md" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 4 }) => {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array(columns).fill(0).map((_, i) => (
        <Skeleton key={i} variant="text" className="h-5" />
      ))}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, columns = 4 }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="grid gap-4 mb-4 pb-4 border-b border-gray-700" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array(columns).fill(0).map((_, i) => (
          <Skeleton key={i} variant="text" className="h-6" />
        ))}
      </div>
      <div className="space-y-4 pt-2">
        {Array(rows).fill(0).map((_, i) => (
          <TableRowSkeleton key={i} columns={columns} />
        ))}
      </div>
    </div>
  );
};

export const StatCardSkeleton = () => (
  <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 shadow-md">
    <div className="flex justify-between items-center">
      <div className="w-3/4">
        <Skeleton variant="text" className="w-1/2 mb-2 h-5" />
        <Skeleton variant="text" className="w-3/4 h-8 mb-2" />
        <Skeleton variant="text" className="w-1/3 h-4" />
      </div>
      <Skeleton variant="circle" width={50} height={50} />
    </div>
  </div>
);

export default Skeleton;
