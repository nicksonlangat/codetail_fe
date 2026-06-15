import { Home, Settings } from "lucide-react";

export default function ColorsPage() {
  return (
    <div className="flex gap-2 bg-[#1B1D20] h-screen">
      <div className="h-full w-full p-2 flex">
        <div className="w-16 text-xs flex flex-col items-center justify-between  h-full bg-[#2A2D31]/60 rounded-lg">
         <div className="pt-5 pb-5">
          <div>
{/* logo */}
          </div>

           <ul className=" space-y-2">
            <li className=" flex flex-col items-center cursor-pointer hover:bg-[#6670851A] transition-all duration-500 ease-in-out p-2 rounded-lg px-4">
              <Home className="size-5" />
              Home
            </li>
             <li className=" flex flex-col items-center cursor-pointer hover:bg-[#6670851A] transition-all duration-500 ease-in-out p-2 rounded-lg px-4">
              <Home className="size-5" />
              Paths
            </li>
             <li className=" flex flex-col items-center cursor-pointer hover:bg-[#6670851A] transition-all duration-500 ease-in-out p-2 rounded-lg px-4">
              <Home className="size-5" />
              Interviews
            </li>
             <li className=" flex flex-col items-center cursor-pointer hover:bg-[#6670851A] transition-all duration-500 ease-in-out p-2 rounded-lg px-4">
              <Home className="size-5" />
              Canvas
            </li>
             <li className=" flex flex-col items-center cursor-pointer hover:bg-[#6670851A] transition-all duration-500 ease-in-out p-2 rounded-lg px-4">
              <Settings className="size-5" />
              Settings
            </li>
          </ul>
         </div>

         <div>

         </div>
        </div>
        <div className="flex-1 p-5">
          <div className="w-full max-w-full flex justify-between">
            <div>
              <p>
                Good morning, <span className="font-bold">Nick</span>
              </p>
              <p className=" text-[#B8C0CC99]">
                How is your coding journey going? Happy coding!
              </p>
            </div>
            <div>
              <div className="bg-[#2A2D31]/60 size-10 flex items-center justify-center border cursor-pointer border-[#42464E] rounded-full" >
                NI
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
