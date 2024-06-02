import { importAnyImage2Jpg } from '@/components/DynamicComponents';

export default function Home() {
  const AnyImage2Jpg = importAnyImage2Jpg();
  return (
    <main className="p-8 max-w-4xl m-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Convert Any Image to JPG</h1>
      <h2 className="text-sm text-center text-gray-700 mb-8">
        Fast, secure, ad-free. Please consider&nbsp;<a className="underline hover:text-purple-500" href="https://www.buymeacoffee.com/jayjin" target="_blank" rel="noopener noreferrer">buying me a coffee</a>&nbsp;to support the site.
      </h2>
      <AnyImage2Jpg />
      <p className="mt-16 text-xs text-gray-600">Your file is not supported? Or any feedback, please&nbsp;<a className="underline hover:text-purple-500" href="https://forms.gle/Gm9FJ3iwbg9Sfjga7" target="_blank" rel="noopener noreferrer">let us know.</a></p>
    </main>
  );
}
