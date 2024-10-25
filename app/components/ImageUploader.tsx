// app/components/ImageUploader.tsx
'use client';

import { useState } from 'react';
import { auth, storage } from '../lib/firebase';
import Loader from './Loader';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface ImageUploaderProps {
  onImageUploaded?: (url: string) => void;
}

const ImageUploader = ({ onImageUploaded }: ImageUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState<string | null>(null);

  // Creates a Firebase Upload Task
  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Get the file
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!auth.currentUser) {
      console.error('No user logged in');
      return;
    }

    const extension = file.type.split('/')[1];
    
    // Makes reference to the storage bucket location
    const storageRef = ref(storage, `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`);
    setUploading(true);

    // Starts the upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Listen to updates to upload task
    uploadTask.on('state_changed', 
      (snapshot) => {
        const pct = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
        setProgress(Number(pct));
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error('Upload failed:', error);
        setUploading(false);
      },
      async () => {
        // Handle successful upload
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        setDownloadURL(url);
        setUploading(false);
        if (onImageUploaded) {
          onImageUploaded(url);
        }
      }
    );
  };

  return (
    <div className="box">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="btn">
            📸 Upload Img
            <input 
              type="file" 
              onChange={uploadFile} 
              accept="image/x-png,image/gif,image/jpeg" 
              className="hidden"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <div className="mt-4">
          <code className="upload-snippet bg-gray-100 p-2 rounded block">
            {`![alt](${downloadURL})`}
          </code>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;