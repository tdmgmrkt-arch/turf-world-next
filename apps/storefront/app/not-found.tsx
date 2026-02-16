import Link from "next/link";
import { Home, Search, ArrowLeft } from "lucide-react";

const HomeIcon = Home as any;
const SearchIcon = Search as any;
const ArrowLeftIcon = ArrowLeft as any;
const NextLink = Link as any;

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] px-4 py-16">
      {/* Big 404 */}
      <div className="relative mb-6">
        <span className="text-[120px] sm:text-[160px] font-black text-slate-100 leading-none select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <SearchIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
        </div>
      </div>

      {/* Message */}
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-2">
        Page Not Found
      </h1>
      <p className="text-sm sm:text-base text-slate-500 text-center max-w-md mb-8">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may have been moved or no longer exists.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <NextLink
          href="/"
          className="flex items-center gap-2 h-12 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
        >
          <HomeIcon className="w-4 h-4" />
          Back to Home
        </NextLink>
        <NextLink
          href="/shop"
          className="flex items-center gap-2 h-12 px-6 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Browse Products
        </NextLink>
      </div>
    </div>
  );
}
