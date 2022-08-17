import { DownloadIcon } from '@heroicons/react/solid';
import { useState } from 'react';

interface ImagePicker {
  name?: string;
  value?: string;
  className?: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ImagePicker: React.FC<ImagePicker> = ({
  name,
  value,
  className,
  onImageChange,
}) => {
  const [image, setImage] = useState('');
  return (
    <div className={className}>
      <div
        className={`hover:opacity-50 rounded-md border border-gray-300 p-3 h-56 overflow-hidden w-full`}
      >
        <label
          htmlFor='image'
          className='flex flex-col justify-center space-y-5 items-center w-full h-full'
        >
          {value || image.length > 0 ? (
            <img
              src={value ?? image}
              className='w-full object-cover object-center'
            />
          ) : (
            <>
              <DownloadIcon className='sm:w-1/12 text-gray-500' />
              <h2 className='text-gray-500 text-center text-2xl font-semibold'>
                Upload quiz image
              </h2>
            </>
          )}
        </label>
        <input
          type='file'
          id='image'
          name={name ?? 'image'}
          className='hidden'
          accept='image/*'
          onChange={(e) => {
            onImageChange(e);
            if (e.currentTarget.files) {
              setImage(window.URL.createObjectURL(e.currentTarget.files[0]));
            }
          }}
        />
      </div>
    </div>
  );
};

export default ImagePicker;
