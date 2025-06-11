import React from "react";

const FrontPage = () => {
  return (
    <section className="bg-[#1a1a2e] min-h-screen flex items-center justify-center p-8">
      <div className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-8 rounded-3xl bg-[#1a1a2e] p-8">
        {/* Left side */}
        <div className="md:w-1/2 text-white space-y-6">
          <h1 className="text-4xl font-extrabold flex items-center gap-2">
            S<span className="text-pink-400 font-bold">!</span>anime
          </h1>
         
          <p className="text-sm">
            <strong>Top search:</strong> One Piece, The Apothecary Diaries Se...<br />
            Wind Breaker Season 2, Fire Force Season 3, Attack on Titan,<br />
            Naruto: Shippuden, The Brilliant Healer's New Lif...<br />
            Solo Leveling Season 2: Aris... Bleach, Demon Slayer: Kimetsu no ...
          </p>

          <button className="bg-pink-400 text-black font-bold px-6 py-3 rounded-lg hover:bg-pink-500 transition" onClick={() => window.location.href = "/home"}>  
            Watch anime &rarr;
          </button>
        </div>

        {/* Right side */}
        <div className="md:w-1/2 rounded-3xl overflow-hidden">
          <video
            autoPlay
            loop
            muted
            src="https://v1.pinimg.com/videos/iht/expMp4/fb/af/64/fbaf64c1004955dedd445bff9802f7e2_720w.mp4"
            alt="Anime characters"
            className="w-full h-full object-cover rounded-3xl"
            style={{ objectPosition: "top", aspectRatio: "4/4" }}
          />
        </div>
      </div>
    </section>
  );
};

export default FrontPage;
