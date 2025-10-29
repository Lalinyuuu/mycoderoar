export default function AuthorBadge({ name, avatar, displayDate, dateISO }) {
    return (
      <div className="mt-4 flex items-center gap-3 text-sm gray-6">
        <img
          src={avatar}
          alt={name}
          className="h-8 w-8 rounded-full object-cover border-2 border-purple-2"
        />
        <span className="gray-8 font-medium">By {name}</span>
        {displayDate && (
          <>
            <span className="mx-1 gray-4">•</span>
            <time className="gray-5" dateTime={dateISO}>{displayDate}</time>
          </>
        )}
      </div>
    );
  }