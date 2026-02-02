import { useEffect } from "react";

export function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    if ((window as any).instgrm?.Embeds) {
      (window as any).instgrm.Embeds.process();
    }
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-version="14"
      style={{ width: "100%", minHeight: "550px" }}
    >
      {/* 🔴 THIS TEXT IS REQUIRED */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        View this post on Instagram
      </a>
    </blockquote>
  );
}
