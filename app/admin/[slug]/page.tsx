// app/admin/[slug]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, updateDoc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';
import ImageUploader from '@/app/components/ImageUploader';
import { auth, db, serverTimestamp } from '../../lib/firebase';
import AuthCheck from '../../components/AuthCheck';
import { Post } from '../../lib/types';

export default function AdminPostEdit() {
  return (
    <AuthCheck>
      <PostManager />
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState(false);
  const params = useParams();
  const slug = params.slug as string;

  const postRef = doc(db, 'posts', slug);
  const [post] = useDocumentData(postRef);

  return (
    <main className="container">
      {post && (
        <>
          <section>
            <h1>{post.title}</h1>
            <p>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post as Post} preview={preview} />
          </section>

          <aside>
            <h3>Tools</h3>
            <button onClick={() => setPreview(!preview)}>
              {preview ? 'Edit' : 'Preview'}
            </button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            <ImageUploader 
  onImageUploaded={(url) => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      // Wrap URL in angle brackets to escape special characters
      const imageMarkdown = `![alt](<${url}>)`;
      console.log('Inserting markdown:', imageMarkdown);
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      textarea.value = text.substring(0, start) + imageMarkdown + text.substring(end);
      const event = new Event('input', { bubbles: true });
      textarea.dispatchEvent(event);
    }
  }} 
/>

          </aside>
        </>
      )}
    </main>
  );
}

interface FormData {
  content: string;
  published: boolean;
}

interface PostFormProps {
  defaultValues: Post;
  postRef: any; // We'll type this more specifically
  preview: boolean;
}

function PostForm({ defaultValues, postRef, preview }: PostFormProps) {
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch,
    formState: { errors, isDirty, isValid }
  } = useForm<FormData>({ 
    defaultValues: {
      content: defaultValues.content,
      published: defaultValues.published || false
    }, 
    mode: 'onChange' 
  });

  const updatePost = async ({ content, published }: FormData) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });
    toast.success('Post updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? 'hidden' : 'controls'}>
        <textarea
          {...register('content', {
            maxLength: { 
              value: 20000, 
              message: 'Content is too long (max 20,000 characters)' 
            },
            minLength: { 
              value: 10, 
              message: 'Content is too short (min 10 characters)' 
            },
            required: { 
              value: true, 
              message: 'Content is required'
            }
          })}
          className="textarea"
        />
        
        {errors.content && (
          <p className="text-danger">{errors.content.message}</p>
        )}

        <fieldset>
          <input
            className="checkbox"
            type="checkbox"
            {...register('published')}
          />
          <label>Published</label>
        </fieldset>

        <button 
          type="submit" 
          className="btn-green"
          disabled={!isDirty || !isValid}
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}