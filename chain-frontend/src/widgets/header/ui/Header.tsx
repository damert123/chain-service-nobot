export default function Header() {
  return (
    <header className="relative flex h-[45px] overflow-hidden bg-[#0F0147]">
      <div className="flex h-full items-center px-[20px]">
        <img
          src="/logo.svg"
          alt="Logo"
          draggable={false}
          className="h-[24px] w-auto select-none"
        />
      </div>

      <div className="absolute left-[125px] top-1/2 h-[200px] w-[200px] -translate-y-1/2 rotate-45 bg-[#23155B]" />
      <div className="f-full relative z-10 ml-20 grow bg-[#23155B]"></div>
    </header>
  );
}
