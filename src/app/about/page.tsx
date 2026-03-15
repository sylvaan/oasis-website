/**
 * about/page.tsx
 * 
 * 📂 KONSEP: File-based Routing
 * Karena file ini ada di dalam folder 'about', maka URL-nya otomatis menjadi /about.
 */
export default function AboutPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
        Tentang Oasis Notes
      </h1>
      <p className="max-w-2xl text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
        Oasis Notes adalah aplikasi sederhana yang dibuat untuk mempelajari dasar-dasar 
        <strong> Next.js</strong>. Di sini kita belajar tentang App Router, Server Components, 
        dan bagaimana mengelola state di Client Components.
      </p>
      
      {/* Bagian ini mempraktekkan styling Tailwind CSS untuk kartu informasi */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-zinc-900 rounded-2xl border border-blue-100 dark:border-zinc-800">
        <h2 className="text-xl font-semibold mb-2">Yang Dipelajari:</h2>
        <ul className="text-left space-y-2">
          <li>📂 File-based Routing</li>
          <li>🏗️ Shared Layouts</li>
          <li>⚛️ Server vs Client Components</li>
          <li>🎨 Tailwind CSS Styling</li>
        </ul>
      </div>
    </div>
  );
}
