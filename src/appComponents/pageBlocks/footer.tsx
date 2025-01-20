import Link from "next/link";

const Footer = () => {
  return (
    <>
      <div className="px-14 py-10 bg-gray-900 flex justify-center items-center">
        <div className="flex flex-col md:flex-row gap-[30px] md:gap-[50px] lg:gap-[100px]">
          <div className="flex flex-col gap-6">
            <h1 className="text-white text-lg">ABOUT</h1>
            <p className="text-sm text-gray-400 font-light w-[300px] leading-relaxed">
              loginOne– Super International Freight Services LTD. is a member
              of Super group of companies headed by leading business group
              owned by Mr. Mohamed Al Shamali in Dubai and Middle East. Freight
              forwarding division is being fully managed by top professionals
              having vast experience in shipping industry.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-white  text-lg">QUICK LINKS</h1>
            <div className="grid grid-flow-row text-sm text-gray-400 font-light gap-1">
              <Link href="/">Home</Link>
              <a
                href="https://loginOneae.com/about-us"
                className="hover:text-[#93b6e0]"
              >
                About Us
              </a>
              <a
                href="https://loginOneae.com/services"
                className="hover:text-[#93b6e0]"
              >
                Services
              </a>
              <a
                href="https://loginOneae.com/gallery"
                className="hover:text-[#93b6e0]"
              >
                Gallery
              </a>
              <a
                href="https://loginOneae.com/careers"
                className="hover:text-[#93b6e0]"
              >
                Career
              </a>
              <a
                href="https://loginOneae.com/enquiry"
                className="hover:text-[#93b6e0]"
              >
                Enquiry
              </a>
              <Link href="/#contactus">Contact Us</Link>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-white  text-lg">QUICK LINKS</h1>
            <div className="grid grid-flow-row text-sm text-gray-400 font-light gap-1">
              <a
                href="https://loginOneae.com/services/air-cargo-services"
                className="hover:text-[#93b6e0]"
              >
                Air Cargo Services
              </a>
              <a
                href="https://loginOneae.com/services/sea-cargo-services"
                className="hover:text-[#93b6e0]"
              >
                Sea Cargo Services
              </a>
              <a
                href="https://loginOneae.com/services/customs-clearances"
                className="hover:text-[#93b6e0]"
              >
                Customs Clearances
              </a>
              <a
                href="https://loginOneae.com/services/warehousing-services"
                className="hover:text-[#93b6e0]"
              >
                Warehousing Services
              </a>
              <a
                href="https://loginOneae.com/services/land-cargo-services"
                className="hover:text-[#93b6e0]"
              >
                Land Cargo Services
              </a>
              <a
                href="https://loginOneae.com/services/moving-and-relocation"
                className="hover:text-[#93b6e0]"
              >
                Moving And Relocation
              </a>
              <a
                href="https://loginOneae.com/services/logistics-services"
                className="hover:text-[#93b6e0]"
              >
                Logistics Services
              </a>
              <a
                href="https://loginOneae.com/themes/loginOne/assets/img/tariff.pdf"
                className="hover:text-[#93b6e0]"
              >
                Tariff
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <h1 className="text-white  text-lg">CONTACT INFO</h1>
            <div className="grid grid-flow-row text-sm text-gray-400 font-light gap-1">
              <p>Red Avenue Building</p>
              <p>Suite #112</p>
              <p>Behind GGICO Metro Station</p>
              <p>Al Garhoud- Dubai</p>
              <p>Tel: +9714 2956337</p>
              <p>Fax: +9714 2956338</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center items-center text-gray-300 bg-gray-950 py-2">
        <p className="text-sm font-light text-center mx-4">
          &copy;Copyright 2024 loginOne | powered by{" "}
          <a href="https://karisimbitech.rw" className="text-[#93b6e0]">
            Karisimbi Technology Solution
          </a>
        </p>
      </div>
    </>
  );
};
export default Footer;
