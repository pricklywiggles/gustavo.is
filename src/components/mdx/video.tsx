interface VideoProps {
  src: string;
  title?: string;
}

export function Video({ src, title }: VideoProps) {
  return (
    <div className="my-8 overflow-hidden rounded-lg">
      <div className="relative aspect-video">
        <iframe
          src={src}
          title={title ?? "Embedded video"}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
