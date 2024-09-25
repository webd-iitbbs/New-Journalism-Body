import React from "react";
import keyboarding from "./../assets/keyboard.jpg";
import newspaper from "./../assets/newpaper.jpg";
import instiimg from "./../assets/insti1.png";
function Mainpage() {
  return (
    <>
      <div className="bg-[#F9F4ED]">
        <div className="flex flex-row w-full h-[600px] p-10">
          <div className="  w-1/2 flex flex-col">
            <div className="bg-[#2A2A2A] rounded-[20px] h-[480px] ">
              <div className="text-[35px] font-[Metro Sans] font-bold text-[#F9F4ED] text-start pl-6 lg:text-[50px]">
                Scouring
                <br></br>
                For The
                <br></br>
                Scoop
              </div>
              <div className="w-full text-[20px] font-[Metro Sans] text-[#FFFFFF] text-left p-6 flex-col justify-end items-end font-thin">
                Our cosmic insight scours the realms of information, bringing
                you the latest scoops that are practically written in the stars.
              </div>
            </div>
            <div className="flex flex-row m-2 h-[120px]">
              <img src={newspaper} className="w-3/4 rounded-md mr-2" />
              <div className="bg-[#AF695C] w-1/4 ml-2 rounded-md"></div>
            </div>
          </div>
          <div className="w-1/2 rounded-[20px] flex justify-center overflow-hidden ml-4">
            <img
              src={keyboarding}
              alt="dsfg"
              className="rounded-[20px] w-full scale-[1.1]"
            />
          </div>
        </div>
      </div>
      <div className="bg-[#2A2A2A]">
        <div className="flex flex-row w-full h-[680px] p-10">
          <div className="p-6  w-1/2 flex flex-col h-full overflow-hidden rounded-[20px] bg-[#F9F4ED]">
            <img
              src={instiimg}
              className=" h-full scale-[2.8] translate-y-16"
            />
          </div>
          <div className="w-1/2 rounded-[20px] flex flex-col pl-5">
            <div className="bg-[#2A2A2A]  p-4 mb-2 rounded-2xl border border-white shadow-2xl">
              <div className="text-[60px] font-bold font-[Metro Sans] text-[#F9F4ED] text-start text-wrap ">
                <span className="text-[#F9F4ED] ">ABOUT</span>
                <br></br>
                <span className="text-[#AF695C] ">US</span>
              </div>
            </div>
            <div className="bg-[#2A2A2A] p-4 h-full rounded-2xl border border-white shadow-2xl">
              <div className="pt-3 pb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  class="flex-none fill-current text-[#F9F4ED] bg-black rounded-full font-bold h-8 w-8"
                >
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-.001 5.75c.69 0 1.251.56 1.251 1.25s-.561 1.25-1.251 1.25-1.249-.56-1.249-1.25.559-1.25 1.249-1.25zm2.001 12.25h-4v-1c.484-.179 1-.201 1-.735v-4.467c0-.534-.516-.618-1-.797v-1h3v6.265c0 .535.517.558 1 .735v.999z" />
                </svg>
              </div>
              <div className="text-[15px] font-[Metro Sans] text-[#F9F4ED] text-start text-wrap lg:text-[20px] items-center font-thin">
                <p>
                  Our cosmic insight scours the realms of information, bringing
                  you the latest scoops that are practically written in the
                  stars. Our cosmic insight scours the realms of information,
                  bringing you the latest scoops that are practically written in
                  the stars. Trust us to unravel the mysteries of institution
                  happenings with a touch of oracle-like wisdom and a knack for
                  revealing the most compelling stories in the cosmos of campus
                  life.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Mainpage;
