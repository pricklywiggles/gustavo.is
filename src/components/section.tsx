import { FComp } from '@/types/common';
import * as React from 'react';

type SectionProps = {
  icon: React.ComponentType<{ className: string }>;
  title: string;
};

export const Section: FComp<SectionProps> = ({
  className,
  icon,
  title,
  children
}) => {
  return (
    <div className={className}>
      <section className="mb-10 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="flex rounded-xl h-10 w-10 sm:h-14 sm:w-14 md:h-10 md:w-10 mb-2 bg-blue-800 text-coolGray-200 fill-current shadow-md border dark:border-dk-bg-600 border-gray-400">
              {React.createElement(icon, {
                className: 'h-6 sm:h-8 md:h-6 m-auto text-white fill-blue'
              })}
            </div>
            <div className="text-3xl sm:text-4xl md:text-3xl mb-3 sm:mb-4 dark:text-gray-200 font-semibold tracking-tight">
              {title}
            </div>
            {children}
          </div>
        </div>
      </section>
    </div>
  );
};
