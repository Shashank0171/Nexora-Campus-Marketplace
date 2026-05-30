function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-28 gap-5">

      {/* SPINNER */}
      <div className="relative w-10 h-10">

        <div className="absolute inset-0 border-2 border-black/10 rounded-full"></div>

        <div className="absolute inset-0 border-2 border-t-black border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>

      </div>

      {/* BRAND */}
      <div className="text-center">
        <h2 className="text-lg font-semibold tracking-tight text-black">
          Nexora
        </h2>

        <p className="text-sm text-black/50 mt-1">
          Loading marketplace...
        </p>
      </div>

    </div>
  );
}

export default Loader;