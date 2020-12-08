import * as React from "react";

export function TabbedContent({
  className,
  labels,
  showSideline = true,
  children
}) {
  const [currentTab, setCurrentTab] = React.useState(0);

  const handleTabChange = (tab) => setCurrentTab(tab);

  const childrenCount = React.Children.count(children);

  return (
    <>
      <div className="flex flex-wrap pb-3 pt-3 justify-around mt-2 mb-4">
        {Array(childrenCount)
          .fill()
          .map((c, childIndex) => (
            <div key={childIndex}>
              <button
                className={`flex items-center m-2 h-8 py-1 px-2 text-xl font-semibold rounded-full md:text-md transition-none hover:text-gray-800 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white ${
                  childIndex === currentTab
                    ? "text-gray-800 bg-lt-primary-300 dark:hover-text-gray-800"
                    : "text-coolGray-400 dark:hover:text-gray-100"
                }`}
                onClick={() => handleTabChange(childIndex)}
              >
                {labels ? labels[childIndex] : childIndex + 1}
              </button>
            </div>
          ))}
      </div>
      <div
        className={`${className} ${
          showSideline ? "border-lt-accent-400 md:border-l-8" : ""
        }`}
      >
        {React.Children.toArray(children)[currentTab]}
      </div>
    </>
  );
}
