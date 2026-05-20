import { useState } from 'react';
import { resolveImageUrl, DEFAULT_USER_AVATAR } from '@/lib/url';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = DEFAULT_USER_AVATAR,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Reset states when src changes (done during render to avoid cascading effects)
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoaded(false);
    setError(false);
  }

  const currentSrc = resolveImageUrl(src) || fallbackSrc;

  return (
    <div className={cn("relative overflow-hidden bg-[#F2F4F6]", className)}>
      {/* Premium Shimmer placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/10 border-t-primary/40"></div>
          </div>
        </div>
      )}

      <img
        src={error ? fallbackSrc : currentSrc}
        alt={alt}
        className={cn(
          "w-full h-full object-cover object-center transition-opacity duration-700 ease-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setError(true);
          setIsLoaded(true);
        }}
        loading="lazy"
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
