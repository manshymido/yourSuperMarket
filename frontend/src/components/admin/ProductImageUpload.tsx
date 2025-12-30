'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ProductImageUploadProps {
  images: File[];
  existingImages?: string[];
  onImagesChange: (images: File[]) => void;
  onRemoveExisting?: (imageUrl: string) => void;
  maxImages?: number;
}

export function ProductImageUpload({
  images,
  existingImages = [],
  onImagesChange,
  onRemoveExisting,
  maxImages = 10,
}: ProductImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        return false;
      }
      return true;
    });

    const newImages = [...images, ...validFiles].slice(0, maxImages);
    onImagesChange(newImages);

    // Create previews
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, maxImages));

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
    
    // Revoke preview URL and remove from previews
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExisting = (imageUrl: string) => {
    if (onRemoveExisting) {
      onRemoveExisting(imageUrl);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Product Images</label>
        <p className="text-xs text-muted-foreground mb-2">
          Upload up to {maxImages} images. Max size: 5MB per image.
        </p>
      </div>

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {existingImages.map((imageUrl, index) => (
            <Card key={`existing-${index}`} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={imageUrl}
                  alt={`Existing ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {onRemoveExisting && (
                  <button
                    type="button"
                    onClick={() => handleRemoveExisting(imageUrl)}
                    className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* New Image Previews */}
      {(images.length > 0 || previews.length > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((file, index) => (
            <Card key={`new-${index}`} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                {previews[index] ? (
                  <Image
                    src={previews[index]}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="p-2 text-xs text-muted-foreground truncate">
                {file.name}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" />
          {images.length === 0 ? 'Upload Images' : 'Add More Images'}
        </Button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}

