import { useCallback, useState } from 'react';
import { TbPhotoPlus } from 'react-icons/tb'
import Image from 'next/image';
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { MediaRenderer } from '@thirdweb-dev/react';

interface ImageUploadProps {
  onChange: (value: string) => void;
  value: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onChange,
  value
}) => {
  const [loading, setLoading] = useState(false);
  const storage = new ThirdwebStorage({clientId: process.env.NEXT_PUBLIC_THIRDWEB_API_KEY});

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];

    if (file) {
      const ipfsUri = await storage.upload(file);
      onChange(ipfsUri);
    }

    setLoading(false);
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={loading}
        className="hidden"
        id="image-upload-input"
      />

      <label
        htmlFor="image-upload-input"
        className="
          relative
          cursor-pointer
          hover:opacity-70
          transition
          border-dashed 
          border-2 
          p-20 
          border-neutral-300
          flex
          flex-col
          justify-center
          items-center
          gap-4
          text-neutral-600
        "
      >
        <TbPhotoPlus size={50} />
        <div className="font-semibold text-lg">
          Click to upload
        </div>
        {loading && <div>Loading...</div>}
        {value && (
          <div className="absolute inset-0 w-full h-full">
            <MediaRenderer
              style={{ objectFit: 'fill', width: 'fit-content', height: '-webkit-fill-available', margin: 'auto' }} 
              src={value} 
              alt="House" 
            />
          </div>
        )}
      </label>
    </div>
  );
}

export default ImageUpload;
