import * as React from 'react';
import { logos } from '@/utils/data';
import { FComp } from '@/types/common';

type TechnologyCardProps = {
  id: string;
  name: string;
  type: string;
  highlights: string[];
  icon?: string; // emoji
};

export const TechnologyCard: FComp<TechnologyCardProps> = ({
  id,
  name,
  type,
  highlights,
  icon
}) => {
  const logo = logos[id as keyof typeof logos];
  return (
    <div className="">
      <div className="relative bg-cyan-400 p-4 z-10 border-1 border-gray-500 shadow-lg w-min rounded-full">
        {logo ? (
          React.createElement(logo.component, {
            className: `w-14 h-14 ${
              logo.themed ? 'fill-current dark:text-indigo-400' : ''
            }`
          })
        ) : (
          <div className="inline-flex items-center justify-center text-6xl h-14 w-14 rounded-full overflow-hidden bg-cyan-400">
            {icon}
          </div>
        )}
      </div>
      <div className="flex justify-center text-8xl text-center  min-h-full"></div>
      <div
        key={name}
        className="pl-16 p-4 ml-10 max-w-min -mt-20 bg-white dark:bg-dk-bg-200 rounded-xl border border-lt-bg dark:border-2 dark:border-dk-bg-400 shadow-md"
      >
        <div className="font-normal text-sm uppercase text-gray-400">
          {type}
        </div>
        <div className="font-semibold mb-4 text-xl border-b text-gray-800 border-gray-300 dark:border-dk-bg-400">
          {name}
        </div>

        <div className=" text-gray-500 self-center md:w-4/5 ">
          {highlights.map((highlight) => (
            <div key={highlight} className="inline-block w-60">
              {highlight}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
