// import React, { useState } from "react";
// import worldMap from "../../assets/artist/worldMap.svg";
// import backButton from "../../assets/artist/back.svg";
// import globe from "../../assets/artist/globe.svg";
// import searchIcon from "../../assets/artist/searchIcon.svg";
// import axios from "axios";

// const ArtistPrev = () => {
//   const [view, setView] = useState("initial");
//   const [artistName, setArtistName] = useState("");
//   const [artistData, setArtistData] = useState(null);
//   const [selectedArtist, setSelectedArtist] = useState(null);
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [datesForSelectedLocation, setDatesForSelectedLocation] = useState([]);

//   const handleAddArtistClick = () => setView("addArtist");

//   const handleNextClick = () => setView("globeView");

//   const handleNextArtistClick = () => setView("addedArtist");

//   const handleNextLocationClick = () => setView("location");

//   const handleNextDateClick = () => setView("date");

//   const handleBackClick = () => setView("initial");

//   const handleSearchChange = async (e) => {
//     const name = e.target.value;
//     setArtistName(name);

//     if (name) {
//       try {
//         const response = await axios.get(
//           `https://spotifyapp-backend.onrender.com/get-artist?q=${name}`
//         );
//         setArtistData(response.data.artists[0]);
//         console.log("artist", response.data.artists[0].locations);
//       } catch (error) {
//         console.error("Error fetching artist data:", error);
//       }
//     } else {
//       setArtistData(null);
//     }
//   };

//   const handleArtistSelect = (artist) => {
//     setSelectedArtist(artist);
//     setView("location");
//   };

//   const handleLocationClick = (location) => {
//     setSelectedLocation(location);
//     const venue = location.split(",")[0].toLowerCase();

//     // Get the dates for the selected venue
//     const dates = selectedArtist.dates.filter((date, index) => {
//       const [locVenue] = selectedArtist.locations[index].split(",");
//       return locVenue.toLowerCase() === venue;
//     });

//     setDatesForSelectedLocation(dates);
//     setView("date");
//   };

//   return (
//     <div className="bg-bg-one h-screen flex items-center justify-center w-max-[430px]">
//       {view === "initial" && (
//         <div className="flex flex-col items-center justify-center">
//           <img src={worldMap} alt="worldMap" />
//           <div className="mt-[5vh] text-[18px] text-white">History</div>
//           <div
//             className="bg-bg-artist-btn mt-[20vh] w-[207px] h-[52px] rounded-full flex items-center justify-center cursor-pointer"
//             onClick={handleAddArtistClick}
//           >
//             <h1 className="text-[18px] text-white">Add Artist</h1>
//           </div>
//         </div>
//       )}

//       {view === "addArtist" && (
//         <div>
//           <h1 className="text-[28px] text-white">Add a new artist</h1>
//           <div
//             className="bg-bg-artist-btn mt-[2vh] w-[207px] h-[52px] rounded-full flex items-center justify-center cursor-pointer"
//             onClick={handleNextClick}
//           >
//             <h1 className="text-[18px] text-white">Add Artist</h1>
//           </div>

//           <div
//             className="mt-[20vh] flex items-center gap-[10px] cursor-pointer"
//             onClick={handleBackClick}
//           >
//             <div className="bg-bg-artist-back rounded-full w-[55px] h-[55px] flex items-center justify-center">
//               <img src={backButton} alt="back" />
//             </div>
//             <h1 className="text-[18px] text-white">Back</h1>
//           </div>
//         </div>
//       )}

//       {view === "globeView" && (
//         <div className="relative">
//           <img src={globe} alt="globe" />
//           <div className="absolute top-[15vh] bg-bg-search min-w-[387px] h-[325px] rounded-[15px] p-[20px]">
//             <div>
//               <input
//                 type="text"
//                 className="bg-transparent relative w-full text-white border border-gray-300 px-[50px] py-[12px] rounded-full"
//                 placeholder="Search artist..."
//                 value={artistName}
//                 onChange={handleSearchChange}
//               />
//               <img
//                 src={searchIcon}
//                 alt="searchIcon"
//                 className="absolute top-[35px] left-[30px]"
//               />
//             </div>

//             <div className="mt-[2vh] text-white ml-[10px]">
//               {artistData ? (
//                 <div
//                   key={artistData._id}
//                   onClick={() => handleArtistSelect(artistData)}
//                   className="cursor-pointer"
//                 >
//                   <h1>{artistData.name}</h1>
//                   <hr className="mt-[5px]" />
//                 </div>
//               ) : (
//                 <h1 className="text-white">No available artists.</h1>
//               )}
//             </div>

//             <div className="flex items-center justify-center mt-[8vh]">
//               <div
//                 className="bg-bg-artist-btn w-[207px] h-[52px] rounded-full flex items-center justify-center cursor-pointer"
//                 onClick={handleNextArtistClick}
//               >
//                 <h1 className="text-[18px] text-white">Add Artist</h1>
//               </div>
//             </div>
//           </div>
//           <div
//             className="mt-[20vh] flex items-center gap-[10px] cursor-pointer"
//             onClick={() => setView("addArtist")}
//           >
//             <div className="bg-bg-artist-back rounded-full w-[55px] h-[55px] flex items-center justify-center">
//               <img src={backButton} alt="back" />
//             </div>
//             <h1 className="text-[18px] text-white">Back</h1>
//           </div>
//         </div>
//       )}

//       {view === "location" && selectedArtist && (
//         <div>
//           <div className="flex flex-col items-center justify-center">
//             <h1 className="text-white text-[24px]">
//               Locations This Artist Performed
//             </h1>
//             <div className="overflow-y-auto md:h-[700px] w-[350px] md:mt-[2vh] hide-scrollbar">
//               {selectedArtist?.locations?.length > 0 ? (
//                 selectedArtist.locations.map((loc, index) => (
//                   <div
//                     key={index}
//                     className="bg-bg-artist-btn rounded-md p-[10px] w-full mt-[2vh] cursor-pointer"
//                     onClick={() => handleLocationClick(loc)}
//                   >
//                     <h1 className="text-white">{loc.split(",")[0]}</h1>
//                   </div>
//                 ))
//               ) : (
//                 <h1 className="text-white text-center">
//                   No locations available for this artist.
//                 </h1>
//               )}
//             </div>
//           </div>

//           <div className="mt-[10vh] flex items-center justify-between">
//             <div
//               className="flex items-center gap-[10px] cursor-pointer"
//               onClick={() => setView("globeView")}
//             >
//               <div className="bg-bg-artist-back rounded-full w-[55px] h-[55px] flex items-center justify-center">
//                 <img src={backButton} alt="back" />
//               </div>
//               <h1 className="text-[18px] text-white">Back</h1>
//             </div>
//             <div
//               className="flex items-center gap-[10px] cursor-pointer"
//               onClick={handleNextDateClick}
//             >
//               <div className="bg-bg-artist-back rounded-md w-[80px] h-[42px] flex items-center justify-center">
//                 <h1 className="text-[18px] text-white">Next</h1>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {view === "date" && selectedArtist && (
//         <div>
//           <div>
//             <div className="flex flex-col items-center justify-center">
//               <h1 className="text-white text-[24px]">
//                 Dates This Artist Performed
//               </h1>
//               <div className="overflow-y-auto h-[700px] w-[350px] mt-[5vh] hide-scrollbar">
//                 {selectedLocation && (
//                   <div>
//                     <h2 className="text-white text-[20px]">
//                       Dates for {selectedLocation.split(",")[0]}:
//                     </h2>
//                     <div className="overflow-y-auto h-[700px] w-[350px] mt-[2px] hide-scrollbar">
//                       {datesForSelectedLocation.length > 0 ? (
//                         datesForSelectedLocation.map((date, index) => (
//                           <div
//                             key={index}
//                             className="bg-bg-artist-btn rounded-md p-[10px] w-full mt-[2vh]"
//                           >
//                             <h1 className="text-white">{date}</h1>
//                           </div>
//                         ))
//                       ) : (
//                         <h1 className="text-white text-center">
//                           No dates available for this location.
//                         </h1>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mt-[10vh] flex items-center justify-between">
//               <div
//                 className="flex items-center gap-[10px] cursor-pointer"
//                 onClick={() => setView("location")}
//               >
//                 <div className="bg-bg-artist-back rounded-full w-[55px] h-[55px] flex items-center justify-center">
//                   <img src={backButton} alt="back" />
//                 </div>
//                 <h1 className="text-[18px] text-white">Back</h1>
//               </div>
//               <div className="flex items-center gap-[10px] cursor-pointer">
//                 <div className="bg-bg-artist-back rounded-md w-[80px] h-[42px] flex items-center justify-center">
//                   <h1 className="text-[18px] text-white">Next</h1>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ArtistPrev;
