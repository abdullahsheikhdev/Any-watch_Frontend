import Image from "next/image";

export default function Dashbord() {
  return (
    <div className="bg-[#0F172A] text-white h-screen p-6">
      <h1 className="text-3xl font-bold">Dashbord</h1>
      <div className="md:flex flex-wrap gap-6 mt-6">
        <div className="flex justify-center items-center p-5 rounded-xl bg-[#141c38] border border-gray-700 shadow-lg w-full md:w-auto mt-6 gap-8">
          <div>
            <h2 className="text-2xl text-gray-400">Total Revenue</h2>
            <p className="text-4xl font-bold">1,234</p>
          </div>
          <div>
            <Image src="/money.svg" alt="Revenue" width={50} height={50} />
          </div>
        </div>

        <div className="flex justify-center items-center p-5 rounded-xl bg-[#141c38] border border-gray-700 shadow-lg w-full md:w-auto mt-6 gap-8">
          <div>
            <h2 className="text-2xl text-gray-400">Total Revenue</h2>
            <p className="text-4xl font-bold">1,234</p>
          </div>
          <div>
            <Image src="/money.svg" alt="Revenue" width={50} height={50} />
          </div>
        </div>

        <div className="flex justify-center items-center p-5 rounded-xl bg-[#141c38] border border-gray-700 shadow-lg w-full md:w-auto mt-6 gap-8">
          <div>
            <h2 className="text-2xl text-gray-400">Total Revenue</h2>
            <p className="text-4xl font-bold">1,234</p>
          </div>
          <div>
            <Image src="/money.svg" alt="Revenue" width={50} height={50} />
          </div>
        </div>

        <div className="flex justify-center items-center p-5 rounded-xl bg-[#141c38] border border-gray-700 shadow-lg w-full md:w-auto mt-6 gap-8">
          <div>
            <h2 className="text-2xl text-gray-400">Total Revenue</h2>
            <p className="text-4xl font-bold">1,234</p>
          </div>
          <div>
            <Image src="/money.svg" alt="Revenue" width={50} height={50} />
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h1 className="text-2xl font-bold">Active Show</h1>
        <div className="md:flex flex-wrap gap-6 mt-6">
          <div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
