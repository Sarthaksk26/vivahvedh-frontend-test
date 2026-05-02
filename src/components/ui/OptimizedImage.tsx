import { useState } from 'react';
import { resolveImageUrl } from '@/lib/url';
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
  fallbackSrc = '/placeholder-user.png',
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
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {/* Blur placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-foreground/5 flex items-center justify-center">
           <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary/60"></div>
        </div>
      )}

      <img
        src={error ? fallbackSrc : currentSrc}
        alt={alt}
        className={cn(
          "transition-opacity duration-500 ease-in-out",
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
