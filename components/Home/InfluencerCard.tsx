"use client";

import { useEffect, useState, useRef } from "react";
import { FiInstagram, FiVolume2, FiVolumeX, FiAlertCircle } from "react-icons/fi";
import { InstagramEmbed } from "./InstagramEmbed";
import { api } from "@/lib/api";

export default function InfluencerSection({
  title,
  items,
}: {
  title?: string;
  items: any[];
}) {
  if (!items?.length) return null;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 relative z-10">
        
        {/* Header */}
        <div className="mb-16 text-center">
          {title && (
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-brandBlack italic font-serif mb-4">
              {title}
            </h2>
          )}
          <div className="flex justify-center items-center gap-3">
            <div className="h-px w-12 bg-brandPink/30" />
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-black flex items-center gap-2">
              <FiInstagram className="text-brandPink" />
              As Seen On Social
            </p>
            <div className="h-px w-12 bg-brandPink/30" />
          </div>
        </div>

        {/* Scrollable container */}
        <div
          id="influencer-scroll"
          className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-10 px-4"
        >
          {items.map((item, idx) => (
            <InfluencerCard key={idx} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function InfluencerCard({ item }: { item: any }) {
  const [mediaError, setMediaError] = useState(false);
  const [mediaLoading, setMediaLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    console.log("InfluencerCard item:", item);
  }, [item]);

  useEffect(() => {
    if (item.product && Object.keys(item.product).length > 0) {
      setProduct(item.product);
    } else if (item.productId) {
      api.get(`/products/${item.productId}`)
        .then((res) => setProduct(res.data))
        .catch(() => setProduct(null));
    }
  }, [item.product, item.productId]);

  const getMediaUrl = (mediaUrl: string) => {
    if (!mediaUrl) return null;
    if (mediaUrl.startsWith('http')) return mediaUrl;
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (mediaUrl.startsWith('/')) {
      return `${apiUrl}${mediaUrl}`;
    }
    return `${apiUrl}/${mediaUrl}`;
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const mediaUrl = item.media?.url ? getMediaUrl(item.media.url) : null;
  const baseImgUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/`;
  const productImage = product?.img1 ? `${baseImgUrl}${product.img1}` : null;
  const isInstagram = !!item.embedUrl;
const isUploadedVideo = item.media?.type === "VIDEO";
const isUploadedImage = item.media?.type === "IMAGE";

  const handleVideoReady = () => {
    console.log("✅ Video is ready to play");
    setMediaLoading(false);
    setMediaError(false);
  };

  const handleVideoError = (e: any) => {
    console.error("❌ Video error:", e);
    setMediaError(true);
    setMediaLoading(false);
  };

  return (
    <div className="min-w-[340px] max-w-[340px] group bg-white border border-gray-100 rounded-sm overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] transition-all duration-500">
      
      {/* MEDIA CONTAINER - Changed from gray-900 to black for testing */}
      {/* MEDIA CONTAINER */}
<div className="relative h-[550px] bg-black overflow-hidden">

  {/* INSTAGRAM */}
  {isInstagram && (
    <InstagramEmbed url={item.embedUrl} />
  )}

  {/* UPLOADED VIDEO */}
  {!isInstagram && isUploadedVideo && mediaUrl && (
    <div className="absolute inset-0">
      <video
        ref={videoRef}
        src={mediaUrl}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={() => setMediaLoading(false)}
        onError={() => {
          setMediaError(true);
          setMediaLoading(false);
        }}
      />

      <button
        onClick={toggleMute}
        className="absolute bottom-4 right-4 z-50 bg-black/60 text-white p-3 rounded-full"
      >
        {isMuted ? <FiVolumeX /> : <FiVolume2 />}
      </button>
    </div>
  )}

  {/* UPLOADED IMAGE */}
  {!isInstagram && isUploadedImage && mediaUrl && (
    <img
      src={mediaUrl}
      className="w-full h-full object-cover"
      onLoad={() => setMediaLoading(false)}
      onError={() => setMediaError(true)}
    />
  )}

  {/* LOADING */}
  {mediaLoading && !mediaError && (
    <div className="absolute inset-0 flex items-center justify-center bg-black z-20">
      <FiInstagram size={40} className="text-white/20 animate-pulse" />
    </div>
  )}

  {/* ERROR */}
  {mediaError && (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-40">
      <FiAlertCircle size={40} className="text-red-500" />
    </div>
  )}
</div>


      {/* PRODUCT INFO */}
      <div className="p-6 bg-white">
        {product ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h3 className="text-xs font-black uppercase tracking-widest text-brandBlack line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-base font-black text-brandPink leading-none">
                  ₹{Number(product.price).toLocaleString()}
                </p>
              </div>
              {productImage && (
                <img
                  src={productImage}
                  className="w-14 h-14 object-cover border border-gray-50 p-0.5 rounded-sm"
                  alt={product.title}
                />
              )}
            </div>

            <button
              onClick={() => (window.location.href = `/products/${product.id}`)}
              className="w-full bg-brandBlack text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-brandPink transition-all active:scale-95 shadow-xl shadow-black/10 rounded-sm"
            >
              {item.ctaText || "Shop the Vibe"}
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
            <div className="h-12 bg-gray-100 rounded animate-pulse mt-6" />
          </div>
        )}
      </div>
    </div>
  );
}