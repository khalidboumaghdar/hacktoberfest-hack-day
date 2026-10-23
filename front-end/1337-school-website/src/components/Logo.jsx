export default function Logo({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-4xl font-black tracking-tight text-white">1337</span>
      <span className="border-l border-white/40 pl-2 text-[10px] leading-tight text-white/90">
        Coding School
        <br />
        UM6P
      </span>
    </div>
  );
}
