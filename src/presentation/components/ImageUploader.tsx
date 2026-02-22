import { useState, useRef, type ChangeEvent } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../infrastructure/firebase/storageConfig';

interface Props {
  folder: string;
  onUpload: (url: string) => void;
}

export function ImageUploader({ folder, onUpload }: Props) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const timestamp = Date.now();
    const storageRef = ref(storage, `${folder}/${timestamp}_${file.name}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      },
      (err) => {
        setError(`上傳失敗：${err.message}`);
        setProgress(null);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onUpload(url);
        setProgress(null);
        if (inputRef.current) inputRef.current.value = '';
      },
    );
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="block w-full text-sm text-stone-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gold/10 file:text-gold hover:file:bg-gold/20 transition"
      />
      {progress !== null && (
        <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}
