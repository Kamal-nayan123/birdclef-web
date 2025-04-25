export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 animate-fade-in">
        Welcome to BirdCLEF 🐦
      </h1>
      <p className="mt-4 text-xl text-gray-700 max-w-xl">
        Discover bird species just by uploading their sounds. Powered by Google's Flash 2.0.
      </p>
      <a
        href="/upload"
        className="mt-8 px-6 py-3 bg-green-600 text-white text-lg rounded-full hover:bg-green-700 transition shadow-lg"
      >
        Get Started
      </a>
    </main>
  );
}
