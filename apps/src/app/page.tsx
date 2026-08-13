import Link from 'next/link';
import { ArrowRight, QrCode, BarChart3, Shield, Zap } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-20 w-full items-center justify-between bg-white px-8 shadow-sm dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <img src="/logo.svg" alt="ARTIBOTS Logo" className="h-10 w-10" />
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">ARTIBOTS</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 dark:bg-gray-950">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-8 pb-32 pt-24 lg:pt-36">
          <div className="mx-auto max-w-5xl text-center">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
              Dynamic QR Codes for <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Teams
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
              Create, manage, and track dynamic QR codes in real-time. Change the destination URL at any time without reprinting. Built for scale, security, and speed.
            </p>
            <div className="mt-10 flex items-center justify-center space-x-6">
              <Link
                href="/register"
                className="group flex h-14 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
              >
                Start Creating Free
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/login"
                className="flex h-14 items-center justify-center rounded-full border border-gray-200 bg-white px-8 text-base font-semibold text-gray-900 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-7xl px-8 pb-24">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Dynamic Routing</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Update where your QR code points instantly. Powered by Redis caching for lightning-fast sub-millisecond redirects globally.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Real-time Analytics</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Track scans, unique devices, operating systems, and geolocations in real-time through an interactive Recharts dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Stateless JWT authentication, automated rate-limiting, Helmet protected headers, and robust Argon2 password hashing.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
