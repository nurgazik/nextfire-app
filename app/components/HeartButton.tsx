import { useState } from 'react';
import { doc, writeBatch, collection, increment, DocumentReference } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';
import { db, auth } from '@/app/lib/firebase';
import toast from 'react-hot-toast';

interface HeartButtonProps {
  postRef: string;  // The path to the post document
}

export default function HeartButton({ postRef }: HeartButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get references
  const postDocRef = doc(db, postRef);
  const user = auth.currentUser;
  const heartRef = doc(collection(postDocRef, 'hearts'), user!.uid);
  
  // Listen to heart document for currently logged in user
  const [heartDoc] = useDocument(heartRef);

  // Create a user-to-post relationship
  const addHeart = async () => {
    setIsLoading(true);
    
    try {
      const batch = writeBatch(db);

      batch.update(postDocRef, { heartCount: increment(1) });
      batch.set(heartRef, { uid: user!.uid });

      await batch.commit();
      toast.success('Post hearted!');
    } catch (error) {
      toast.error('Failed to heart post!');
      console.error('Error adding heart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a user-to-post relationship
  const removeHeart = async () => {
    setIsLoading(true);

    try {
      const batch = writeBatch(db);

      batch.update(postDocRef, { heartCount: increment(-1) });
      batch.delete(heartRef);

      await batch.commit();
      toast.success('Post unhearted!');
    } catch (error) {
      toast.error('Failed to unheart post!');
      console.error('Error removing heart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return heartDoc?.exists() ? (
    <button 
      onClick={removeHeart} 
      disabled={isLoading}
      className="btn-red"
    >
      💔 Unheart
    </button>
  ) : (
    <button 
      onClick={addHeart} 
      disabled={isLoading}
      className="btn-green"
    >
      💗 Heart
    </button>
  );
}