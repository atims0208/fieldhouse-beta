"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  value: string[]
  onChange: (value: string[]) => void
  maxFiles?: number
  maxSize?: number // in bytes
}

export default function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB default
}: ImageUploadProps) {
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setError(null)
      
      // Check if adding new files would exceed maxFiles
      if (value.length + acceptedFiles.length > maxFiles) {
        setError(`You can only upload up to ${maxFiles} images`)
        return
      }

      // Process each file
      acceptedFiles.forEach((file) => {
        if (file.size > maxSize) {
          setError(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
          return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
          if (event.target?.result) {
            onChange([...value, event.target.result as string])
          }
        }
        reader.readAsDataURL(file)
      })
    },
    [value, onChange, maxFiles, maxSize]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxFiles,
    maxSize,
  })

  const removeImage = (index: number) => {
    const newImages = [...value]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 cursor-pointer text-center
          ${isDragActive ? "border-fhsb-green bg-fhsb-green/10" : "border-fhsb-green/30"}
          hover:border-fhsb-green hover:bg-fhsb-green/5 transition-colors
        `}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-fhsb-cream">Drop the images here...</p>
        ) : (
          <div className="space-y-2">
            <p className="text-fhsb-cream">Drag & drop images here, or click to select files</p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG, GIF up to {maxSize / 1024 / 1024}MB (max {maxFiles} files)
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden">
              <Image
                src={url}
                alt={`Uploaded image ${index + 1}`}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 