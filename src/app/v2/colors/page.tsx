export default function ColorsPage() {
  return (
    <div className="flex gap-2 bg-white flex-col items-center justify-center min-h-screen py-2">
      <div className="w-full max-w-xl">
        <button className="bg-[#0898A0] hover:bg-[#006D79] bg-[#005864]- text-white hover:bg-[#009AA0]- transition-all duration-500 ease-in-out py-2 rounded-lg px-4 cursor-pointer text-sm">
          Primary button cta
        </button>
      </div>
      <div className="w-full max-w-xl">
        <div className="p-5 bg-[#F3F4F6] rounded-lg"></div>
      </div>


       <div className="w-full max-w-xl">
        <div className="p-5 bg-[#1B1D20] rounded-lg"></div>
      </div>

      <div className="w-full max-w-xl">
        <div className="p-5 bg-[#2A2D31] rounded-lg"></div>
      </div>

      <div className="w-full max-w-xl">
        <div className="p-5 bg-[#EDFFFF] rounded-lg"></div>
      </div>

      <div className="w-full max-w-xl">
        <div className="p-5 bg-[#9FDCE1] rounded-lg"></div>
      </div>

      <div className="w-full max-w-xl">
        <div className="p-5 border border-[#EAECF0] rounded-lg"></div>
      </div>

      <div className="w-full text-[#002A3A] max-w-xl">
        <p>this is a primary text color example</p>
      </div>

      <div className="w-full text-[#747881] max-w-xl">
        <p>this is a text color example</p>
      </div>
    </div>
  );
}
