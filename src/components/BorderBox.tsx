export default function BorderBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-8 lg:p-16 relative">
      <div className="absolute border-l-2 border-r-2 border-dashed left-8 lg:left-16 right-8 lg:right-16 top-0 bottom-0" />
      <div className="absolute border-b-2 border-t-2 border-dashed left-0 right-0 top-8 lg:top-16 bottom-8 lg:bottom-16" />
      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-tr from-black lg:from-10% via-transparent lg:to-90% to-black" />
      <div className="absolute left-0 top-0 w-full h-full bg-gradient-to-br from-black lg:from-10% via-transparent lg:to-90% to-black" />
      <div className="w-full h-full relative z-10">
        {children}
      </div>
    </div>
  );
}
