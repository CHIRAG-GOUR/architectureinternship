function getYouTubeId(url) {
    if (!url) return null;
    let m = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    m = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    return null;
}

export default function VideoEmbed({ url, title }) {
    const videoId = getYouTubeId(url);
    if (!videoId) return null;

    return (
        <div className="content-card">
            {title && (
                <h4>{title}</h4>
            )}
            <div className="video-wrap">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                    title={title || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                />
            </div>
        </div>
    );
}
