import Image from 'next/image';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className || ''}`}>
      <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center overflow-hidden shrink-0">
        <Image src="/carenium-logo.svg" alt="Carenium Logo" width={56} height={56} className="object-contain" />
      </div>
      <div className="text-left">
        <h1 className="text-2xl font-bold">Carenium</h1>
        <p className="text-emerald-200 text-[11px] tracking-[3px] font-semibold uppercase">Doctor Hub</p>
      </div>
    </Link>
  );
}

export function LogoDark({ className }: { className?: string }) {
  return (
    <Link href="/" className={`flex items-center gap-3 ${className || ''}`}>
      <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center shrink-0 overflow-hidden">
        <Image src="/carenium-logo.svg" alt="Carenium Logo" width={40} height={40} className="object-contain" />
      </div>
      <div className="text-left">
        <span className="text-xl font-bold text-gray-900">Carenium</span>
        <span className="ml-2 text-[9px] font-semibold text-gray-400 tracking-[2px] uppercase">Doctor Hub</span>
      </div>
    </Link>
  );
}
