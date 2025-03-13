function Footer() {
  return (
    <footer className="h-[90vh] bg-black text-white py-10 px-5 flex justify-between items-center flex-col ">
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 divide-x divide-gray-700 border-b border-t border-gray-700 pt-8 pb-8">
        <div className="p-6 ">
          <h2 className="text-lg font-semibold">Verdict.ai</h2>
          <p className="text-gray-400 mt-2">© copyright Verdict.ai 2024. All rights reserved.</p>
        </div>
        <div className="w-full flex justify-center items-center flex-col justify-self-center p-6">
          <h3 className="text-lg font-semibold">Socials</h3>
          <ul className="mt-2 space-y-1 text-gray-400">

            <li>Facebook</li>
            <li>Instagram</li>
            <li>Twitter</li>
            <li>LinkedIn</li>
          </ul>
        </div>

        <div className=" justify-self-center p-6">
          <h3 className="text-lg font-semibold pl-2">Legal</h3>
          <ul className="mt-2 space-y-1 text-gray-400 ">
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>


      <p class="text-center mt-20 text-5xl md:text-9xl lg:text-[12rem] xl:text-[13rem] font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 dark:from-neutral-950 to-neutral-200 dark:to-neutral-800 inset-x-0">Verdict.ai</p>
    </footer>
  );
}

export default Footer;
