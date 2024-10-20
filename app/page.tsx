import Image from "next/image";
import Link from 'next/link';
import Loader from "./components/Loader";
import TestComponent from "./components/TestComponent";
import ToastButton from "./components/ToastButton";

export const metadata = {
  title: 'Your Page Title',
  description: 'Your page description',
};

export default function Home() {
  return (
    <div>
      <h1>There should be a loader here yo brother</h1>
      <Loader show={true} />
      <TestComponent/>
      <ToastButton 
        type="success" 
        message="Operation successful!" 
        buttonText="Show Success Toast" 
      />
      <ToastButton 
        type="error" 
        message="An error occurred." 
        buttonText="Show Error Toast" 
      />
      <ToastButton 
        type="loading" 
        message="Loading..." 
        buttonText="Show Loading Toast" 
      />
      <ToastButton 
        type="custom" 
        message="Custom toast message" 
        buttonText="Show Custom Toast" 
        options={{ icon: '👋' }}
      />
    </div>
  );
}