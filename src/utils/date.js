export function toDate(value) {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    if (typeof value === "number") return toDate(new Date(value));
    if (typeof value === "string") return toDate(new Date(value));
    return null;
  }
  
  export function formatDate(value, locale = "en-US") {
    const d = toDate(value);
    if (!d) return null;
    try {
      return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "2-digit" });
    } catch {
      return null;
    }
  }
  
  export function toISO(value) {
    const d = toDate(value);
    return d ? d.toISOString() : undefined;
  }

  // Smart timestamp formatting
  export function formatSmartTime(value, locale = 'en-US') {
    const date = toDate(value);
    if (!date) return '';

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffH   = Math.floor(diffMin / 60);
    const diffD   = Math.floor(diffH / 24);
    const diffW   = Math.floor(diffD / 7);

    if (diffSec < 60) return `${diffSec} seconds ago`;
    if (diffMin < 60) return `${diffMin} minutes ago`;
    if (diffH < 24)   return `${diffH} hours ago`;
    if (diffD < 7)    return `${diffD} days ago`;
    if (diffW < 4)    return `${diffW} weeks ago`;

    const datePart = date.toLocaleDateString(locale, {
      year: 'numeric', month: 'short', day: '2-digit'
    });
    const timePart = date.toLocaleTimeString(locale, {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
    return `${datePart} ${timePart}`;
  }

  export function formatDateTime(value, locale='en-US') {
    const date = toDate(value);
    if (!date) return '';
    const datePart = date.toLocaleDateString(locale, { year:'numeric', month:'short', day:'2-digit'});
    const timePart = date.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit', hour12:true});
    return `${datePart} ${timePart}`;
  }