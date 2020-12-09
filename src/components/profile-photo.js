export function ProfilePhoto({
  photoUrl = "/gustavo.png",
  bgClass = "bg-concept-positive"
}) {
  return (
    <div>
      <div className="relative overflow-hidden transition-all bg-lt-bg dark:bg-dk-bg w-full h-full">
        <div
          className={`absolute bg-repeat ${bgClass} filter dark:invert-80  transform animate-concept-scroll`}
          style={{
            width: "92%",
            height: "11559px",
            backgroundSize: "200% auto"
          }}
        />
        <div className="absolute flex items-center w-full h-full">
          <img
            alt="Headshot"
            className="transform scale-75 object-cover"
            src={photoUrl}
          />
        </div>
        <svg
          className="relative transition-all fill-current text-lt-bg dark:text-dk-bg"
          style={{ width: "100%", height: "100%" }}
          viewBox="0 0 200 200"
        >
          <defs>
            <mask id="hole">
              <rect className="w-full h-full" fill="white" />
              <circle className="" r="40%" cx="50%" cy="50%" fill="black" />
            </mask>
          </defs>
          <rect
            id="donut"
            className="w-full h-full"
            mask="url(#hole)"
            fill="currentColor"
          />
          <circle
            className="text-indigo-500"
            r="45%"
            cx="50%"
            cy="50%"
            mask="url(#hole)"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
