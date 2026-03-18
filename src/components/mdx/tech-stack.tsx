interface TechStackProps {
  items: string[];
}

export function TechStack({ items }: TechStackProps) {
  return (
    <div className="my-6 flex flex-wrap gap-2">
      {items.map((tech) => (
        <span
          key={tech}
          className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300"
        >
          {tech}
        </span>
      ))}
    </div>
  );
}
