import React, { useState, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { GoldButton } from './GoldButton';

interface ImageUploaderProps {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, maxImages = 5 }) => {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  const handleFile = (files: FileList | null) => {
    if (!files) return;
    
    Array.from(files).slice(0, maxImages - images.length).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImages(prev => [...prev, base64]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFile(e.dataTransfer.files); }}
        className={`
          relative border-2 border-dashed rounded-3xl p-10 text-center transition-all
          ${isDragging ? 'border-[#D4B483] bg-[#D4B483]/10' : 'border-white/10 hover:border-[#D4B483]/30'}
          ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onClick={() => document.getElementById('image-input')?.click()}
      >
        <input 
          id="image-input" 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={(e) => handleFile(e.target.files)}
          disabled={images.length >= maxImages}
        />
        <div className="flex flex-col items-center gap-4">
           <div className="w-16 h-16 rounded-2xl bg-[#D4B483]/10 flex items-center justify-center text-[#D4B483]">
              <Upload size={32} />
           </div>
           <div>
              <p className="font-bold">اسحب الصور هنا أو انقر للاختيار</p>
              <p className="text-[10px] text-psy-text/40 mt-1">يمكنك رفع حتى {maxImages} صور (JPG, PNG)</p>
           </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, i) => (
            <div key={i} className="group relative aspect-square rounded-2xl overflow-hidden glass border-white/10">
              <img src={img} className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {images.length > 0 && (
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold bg-emerald-500/10 w-fit px-4 py-2 rounded-xl">
          <CheckCircle size={14} /> تم تجهيز {images.length} صور للرفع
        </div>
      )}
    </div>
  );
};
