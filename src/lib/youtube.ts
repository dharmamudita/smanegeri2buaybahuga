// Utility untuk memproses dan menormalkan seluruh variasi tautan YouTube
// Mendukung: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/shorts/ID, query params (?si=..., &t=...), dan Plain ID.

export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function formatYouTubeEmbedUrl(url: string | null | undefined, autoplay = false): string {
  const id = extractYouTubeId(url);
  const base = id
    ? `https://www.youtube-nocookie.com/embed/${id}`
    : "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ";
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    enablejsapi: "1",
  });
  if (autoplay) {
    params.set("autoplay", "1");
  }
  return `${base}?${params.toString()}`;
}

export function formatYouTubeWatchUrl(url: string | null | undefined): string {
  const id = extractYouTubeId(url);
  if (id) {
    return `https://www.youtube.com/watch?v=${id}`;
  }
  if (!url) return "https://www.youtube.com";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

export function getYouTubeThumbnailUrl(
  url: string | null | undefined,
  fallback = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80"
): string {
  const id = extractYouTubeId(url);
  if (id) {
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return fallback;
}
