export function getIdFromVideoUrl(videoUrl: string) {
    const url = new URL(videoUrl);
    return url.searchParams.get("v") || "";
}
