import { useState, useRef } from 'react';
import apiClient from '../../lib/apiClient';
import CarouselLightbox from '../layout/Lightbox';
import { resolveImageUrl } from '../../lib/url';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Upload, ImagePlus, Star, ZoomIn, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function PhotoUpload({
  onUploadSuccess,
  existingImages = []
}: {
  onUploadSuccess: () => void;
  existingImages?: any[];
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [carouselOpen, setCarouselOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFileSelection = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    Array.from(selectedFiles).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', `${file.name} exceeds 5MB limit`);
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        showToast('error', `${file.name} — only JPG, PNG, WebP allowed`);
        return;
      }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadAll = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(0);

    let uploaded = 0;
    for (const file of files) {
      const formData = new FormData();
      formData.append('photo', file);
      try {
        await apiClient.post('/user/upload-photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploaded++;
        setUploadProgress(Math.round((uploaded / files.length) * 100));
      } catch (error: any) {
        showToast('error', `Failed to upload ${file.name}`);
      }
    }

    // Clean up
    previews.forEach(p => URL.revokeObjectURL(p));
    setFiles([]);
    setPreviews([]);
    setIsUploading(false);
    setUploadProgress(0);

    if (uploaded > 0) {
      showToast('success', `${uploaded} photo${uploaded > 1 ? 's' : ''} uploaded successfully!`);
      onUploadSuccess();
    }
  };

  const handleDeletePhoto = async (imageId: string) => {
    if (!confirm('Delete this photo permanently?')) return;
    setDeletingId(imageId);
    try {
      await apiClient.delete(`/user/delete-photo/${imageId}`);
      showToast('success', 'Photo deleted');
      onUploadSuccess();
    } catch {
      showToast('error', 'Failed to delete photo');
    } finally {
      setDeletingId(null);
    }
  };


  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelection(e.dataTransfer.files);
  };

  const hasPhotos = existingImages && existingImages.length > 0;
  const totalPhotos = (existingImages?.length || 0) + files.length;

  return (
    <div className="space-y-6 relative">

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-24 left-1/2 z-[300] px-5 py-3 rounded-xl shadow-2xl font-semibold text-sm flex items-center gap-2 backdrop-blur-sm border ${
              toast.type === 'success'
                ? 'bg-green-50/95 text-green-700 border-green-200'
                : 'bg-red-50/95 text-red-700 border-red-200'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Carousel Lightbox */}
      {carouselOpen && hasPhotos && (
        <CarouselLightbox
          images={existingImages}
          startIndex={carouselIndex}
          onClose={() => setCarouselOpen(false)}
        />
      )}

      {/* ========== UPLOAD ZONE ========== */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b bg-gradient-to-r from-primary/5 to-transparent flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ImagePlus size={20} className="text-primary" />
              Upload Photos
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {totalPhotos} of 15 photos used • JPG, PNG, WebP up to 5MB
            </p>
          </div>
          {files.length > 0 && (
            <button
              onClick={handleUploadAll}
              disabled={isUploading}
              className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Uploading {uploadProgress}%
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload {files.length} Photo{files.length > 1 ? 's' : ''}
                </>
              )}
            </button>
          )}
        </div>

        {/* Upload Progress Bar */}
        {isUploading && (
          <div className="h-1 bg-muted overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-rose-400"
              initial={{ width: 0 }}
              animate={{ width: `${uploadProgress}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>
        )}

        <div className="p-6">
          {/* Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 group ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[1.01]'
                : 'border-border hover:border-primary/40 hover:bg-primary/[0.02]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg, image/png, image/webp"
              multiple
              onChange={(e) => handleFileSelection(e.target.files)}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-3">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                isDragging ? 'bg-primary text-white scale-110' : 'bg-primary/10 text-primary group-hover:bg-primary/15 group-hover:scale-105'
              }`}>
                <Upload size={28} strokeWidth={1.5} />
              </div>
              <div>
                <p className="font-bold text-foreground">
                  {isDragging ? 'Drop your photos here' : 'Drag & drop photos here'}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  or <span className="text-primary font-semibold underline underline-offset-2">browse from device</span>
                </p>
              </div>
            </div>
          </div>

          {/* File Previews (Staged for Upload) */}
          <AnimatePresence>
            {previews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6"
              >
                <p className="text-sm font-semibold text-muted-foreground mb-3">Ready to upload:</p>
                <div className="flex gap-3 flex-wrap">
                  {previews.map((preview, idx) => (
                    <motion.div
                      key={preview}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-primary/20 shadow-sm group/preview"
                    >
                      <img src={preview} className="w-full h-full object-cover" alt={`Preview ${idx + 1}`} />
                      <button
                        onClick={(e) => { e.stopPropagation(); removePreview(idx); }}
                        className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover/preview:opacity-100 transition-opacity hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-1.5">
                        <p className="text-white text-[10px] font-medium truncate">{files[idx]?.name}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========== EXISTING GALLERY ========== */}
      {hasPhotos && (
        <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b flex justify-between items-center">
            <div>
              <h3 className="font-bold text-lg">Your Gallery</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{existingImages.length} photo{existingImages.length !== 1 ? 's' : ''} uploaded</p>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {existingImages.map((img: any, idx: number) => (
                <motion.div
                  key={img.id || idx}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: deletingId === img.id ? 0.4 : 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="relative group aspect-square rounded-2xl overflow-hidden border bg-muted shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  {/* Image */}
                  <img
                    src={resolveImageUrl(img.url)}
                    onClick={() => { setCarouselIndex(idx); setCarouselOpen(true); }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05] cursor-zoom-in"
                    alt={`Gallery ${idx + 1}`}
                    loading="lazy"
                  />

                  {/* Hover overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Primary Badge */}
                  {img.isPrimary && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg">
                        <Star size={10} fill="currentColor" /> Primary
                      </span>
                    </div>
                  )}

                  {/* Photo number */}
                  <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {idx + 1}
                    </span>
                  </div>

                  {/* Bottom action bar */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-10">
                    <button
                      onClick={(e) => { e.stopPropagation(); setCarouselIndex(idx); setCarouselOpen(true); }}
                      className="bg-white/20 backdrop-blur-md text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                      title="View"
                    >
                      <ZoomIn size={16} />
                    </button>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeletePhoto(img.id); }}
                      disabled={deletingId === img.id}
                      className="bg-red-500/80 backdrop-blur-md text-white p-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === img.id ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!hasPhotos && files.length === 0 && (
        <div className="bg-gradient-to-br from-primary/5 to-rose-50/50 border border-primary/10 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <ImagePlus size={36} className="text-primary/60" strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold mb-2 text-foreground/80">No photos yet</h3>
          <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
            Profiles with photos get <span className="text-primary font-semibold">10x more responses</span>. 
            Upload a clear, recent photo to make a great first impression.
          </p>
        </div>
      )}
    </div>
  );
}
