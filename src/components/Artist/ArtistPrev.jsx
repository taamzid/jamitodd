import React, { useState } from "react";
import backButton from "../../assets/artist/back.svg";
import globe from "../../assets/artist/globe.svg";
import searchIcon from "../../assets/artist/searchIcon.svg";
import axios from "axios";

const ArtistPrev = () => {
  const [view, setView] = useState("globeView");
  const [artistName, setArtistName] = useState("");
  const [addedArtist, setAddedArtist] = useState(null);
  const [artistData, setArtistData] = useState(null);
  const [newArtistName, setNewArtistName] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [newDate, setNewDate] = useState("");
  const [datesForSelectedLocation, setDatesForSelectedLocation] = useState([]);

  const handleSearchChange = async (e) => {
    const name = e.target.value;
    setArtistName(name);

    if (name) {
      try {
        const response = await axios.get(
          `https://spotifyapp-backend.onrender.com/get-artist?q=${name}`
        );
        setArtistData(response.data.artists[0]);
        console.log("artist", response.data.artists[0].locations);
      } catch (error) {
        console.error("Error fetching artist data:", error);
      }
    } else {
      setArtistData(null);
    }
  };

  const handleArtistSelect = (artist) => {
    setSelectedArtist(artist);
    setView("location");
  };
  const handleArtistSelectCustom = () => {
    setSelectedArtist(addedArtist);
    setView("location");
  };

  const handleLocationClick = (location) => {
    setSelectedLocation(location);
    const venue = location.split(",")[0].toLowerCase();

    const dates = selectedArtist.dates.filter((date, index) => {
      const loc = selectedArtist.locations[index];
      if (loc) {
        const [locVenue] = loc.split(",");
        return locVenue.toLowerCase() === venue;
      }
      return false;
    });

    setDatesForSelectedLocation(dates);
    setView("date");
  };

  const handleAddArtist = async () => {
    if (newArtistName.trim()) {
      try {
        const response = await axios.post(
          "https://spotifyapp-backend.onrender.com/add-artist",
          {
            name: newArtistName,
          }
        );
        console.log("Response Data:", response.data);
        const newArtist = response.data.artist;
        setNewArtistName("");
        setAddedArtist(newArtist);
        setView("addedArtist");
      } catch (error) {
        console.error("Error adding artist:", error);
      }
    } else {
      alert("Please enter a valid artist name.");
    }
  };

  const handleAddLocation = async () => {
    if (newLocation.trim()) {
      const formattedLocation = newLocation.trim() + ",,";
      try {
        const response = await axios.post(
          `https://spotifyapp-backend.onrender.com/add-location/${selectedArtist._id}`,
          {
            location: formattedLocation,
          }
        );
        console.log("Location added:", response.data);
        setSelectedArtist((prev) => ({
          ...prev,
          locations: [...prev.locations, formattedLocation],
        }));
        setNewLocation("");
      } catch (error) {
        console.error("Error adding location:", error);
      }
    } else {
      alert("Please enter a valid location.");
    }
  };

  const handleAddDate = async () => {
    if (newDate.trim() && selectedLocation) {
      const trimmedLocation = selectedLocation.trim();
      const formattedLocation = trimmedLocation.endsWith(",")
        ? trimmedLocation
        : `${trimmedLocation},`;

      try {
        const locationIndex = selectedArtist.locations.findIndex(
          (loc) => loc === formattedLocation
        );
        const dateIndex = selectedArtist.dates.findIndex(
          (date) => date === newDate
        );

        // Case: Location exists but date does not
        if (locationIndex !== -1 && dateIndex === -1) {
          const dateResponse = await axios.post(
            `https://spotifyapp-backend.onrender.com/add-date/${selectedArtist._id}`,
            {
              date: newDate,
              location: formattedLocation,
            }
          );
          console.log("Date added for existing location:", dateResponse.data);
        }

        // Case: Location exists and date exists, add both
        if (locationIndex !== -1 && dateIndex !== -1) {
          // Add the location even if it already exists
          await axios.post(
            `https://spotifyapp-backend.onrender.com/add-location/${selectedArtist._id}`,
            {
              location: formattedLocation,
            }
          );
          console.log("Location added again");

          // Add the date even if it already exists
          await axios.post(
            `https://spotifyapp-backend.onrender.com/add-date/${selectedArtist._id}`,
            {
              date: newDate,
              location: formattedLocation,
            }
          );
          console.log("Date added again for existing location");
        }

        // Case: Location does not exist, add both date and location
        if (locationIndex === -1) {
          const dateResponse = await axios.post(
            `https://spotifyapp-backend.onrender.com/add-date/${selectedArtist._id}`,
            {
              date: newDate,
              location: formattedLocation,
            }
          );
          console.log("Date added for new location:", dateResponse.data);

          const locationResponse = await axios.post(
            `https://spotifyapp-backend.onrender.com/add-location/${selectedArtist._id}`,
            {
              location: formattedLocation,
            }
          );
          console.log("Location added:", locationResponse.data);
        }

        // Update the selected artist state
        setSelectedArtist((prev) => ({
          ...prev,
          dates: [...prev.dates, newDate],
          locations: [...prev.locations, formattedLocation],
        }));

        // Reset inputs
        setNewDate("");
        setSelectedLocation(null);
      } catch (error) {
        console.error("Error adding date or location:", error);
      }
    } else {
      alert("Please enter a valid date and select a location.");
    }
  };

  return (
    <div className="bg-bg-one h-screen flex items-center justify-center w-max-[430px]">
      {view === "globeView" && (
        <div className="relative">
          <img src={globe} alt="globe" />
          <div className="absolute top-[15vh] bg-bg-search min-w-[387px] h-[325px] rounded-[15px] p-[20px]">
            <div>
              <input
                type="text"
                className="bg-transparent relative w-full text-white border border-gray-300 px-[50px] py-[12px] rounded-full"
                placeholder="Search artist..."
                value={artistName}
                onChange={handleSearchChange}
              />
              <img
                src={searchIcon}
                alt="searchIcon"
                className="absolute top-[35px] left-[30px]"
              />
            </div>

            <div className="mt-[2vh] text-white ml-[10px]">
              {artistData ? (
                <div
                  key={artistData._id}
                  onClick={() => handleArtistSelect(artistData)}
                  className="cursor-pointer"
                >
                  <h1>{artistData.name}</h1>
                  <hr className="mt-[5px]" />
                </div>
              ) : (
                <div>
                  <h1 className="text-white">No available artists.</h1>
                </div>
              )}
              <div>
                <input
                  type="text"
                  placeholder="Add artist name"
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  className="mt-[8vh] p-[5px] text-white bg-transparent w-full border-none focus:outline-none"
                />
                <hr />
                <div className="flex items-center justify-center mt-[1vh]">
                  <div
                    className="bg-bg-artist-btn w-[207px] h-[52px] rounded-full flex items-center justify-center cursor-pointer"
                    onClick={handleAddArtist}
                  >
                    <h1 className="text-[18px] text-white">
                      Add Artist Manually
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {view === "addedArtist" && addedArtist && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-[24px] text-white">Added Artist</h1>
          <div
            className="bg-bg-artist-btn rounded-md p-[10px] w-full mt-[2vh] cursor-pointer"
            onClick={handleArtistSelectCustom}
          >
            <h1 className="text-white">{addedArtist.name}</h1>
            <h1 className="text-white hidden">{addedArtist._id}</h1>
          </div>
        </div>
      )}

      {view === "location" && selectedArtist && (
        <div>
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-white text-[24px]">
              Locations This Artist Performed
            </h1>
            <div
              className={`overflow-y-auto w-[350px] hide-scrollbar ${
                artistData?.locations?.length > 0
                  ? "md:h-[600px] md:mt-[2vh]"
                  : "h-[160px]"
              }`}
            >
              {selectedArtist?.locations?.length > 0 ? (
                selectedArtist.locations.map((loc, index) => (
                  <div
                    key={index}
                    className="bg-bg-artist-btn rounded-md p-[10px] w-full mt-[2vh] cursor-pointer"
                    onClick={() => handleLocationClick(loc)}
                  >
                    <h1 className="text-white">{loc?.split(",")[0]}</h1>
                  </div>
                ))
              ) : (
                <div>
                  <h1 className="text-white text-center">
                    No locations available for this artist.
                  </h1>
                </div>
              )}
            </div>
          </div>

          <div className="md:mt-[2vh]">
            <input
              type="text"
              placeholder="Add artist location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="mt-[8vh] p-[5px] text-white bg-transparent w-full border-none focus:outline-none"
            />
            <hr />
            <div className="flex items-center justify-center mt-[1vh]">
              <div
                className="bg-bg-artist-btn w-[250px] h-[52px] rounded-full flex items-center justify-center cursor-pointer"
                onClick={handleAddLocation}
              >
                <h1 className="text-[18px] text-white">
                  Add Location Manually
                </h1>
              </div>
            </div>

            <div
              className="flex items-center gap-[10px] cursor-pointer md:mt-[5vh]"
              onClick={() => setView("globeView")}
            >
              <div className="bg-bg-artist-back rounded-full w-[55px] h-[55px] flex items-center justify-center">
                <img src={backButton} alt="back" />
              </div>
              <h1 className="text-[18px] text-white">Back</h1>
            </div>
          </div>
        </div>
      )}

      {view === "date" && selectedArtist && (
        <div>
          <div>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-white text-[24px] mb-[60px]">
                Dates This Artist Performed
              </h1>
              <div
                className={`overflow-y-auto w-[350px] hide-scrollbar ${
                  artistData?.dates?.length > 0 ? "md:h-[600px]" : "h-[300px]"
                }`}
              >
                {selectedLocation && (
                  <div>
                    <h2 className="text-[#ffffff] text-[18px]">
                      Dates for {selectedLocation.split(",")[0]}.
                    </h2>
                    <div className="overflow-y-auto h-[600px] w-[350px] mt-[2px] hide-scrollbar">
                      {datesForSelectedLocation.length > 0 ? (
                        datesForSelectedLocation.map((date, index) => (
                          <div
                            key={index}
                            className="bg-bg-artist-btn rounded-md p-[10px] w-full mt-[2vh]"
                          >
                            <h1 className="text-white">{date}</h1>
                          </div>
                        ))
                      ) : (
                        <div>
                          <h1 className="text-white text-center">
                            No dates available for this location!!
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-center gap-[10px]">
              <input
                type="text"
                placeholder="Add artist date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="mt-[1px] p-[5px] text-white bg-transparent w-full border-none focus:outline-none"
              />
              <hr />
              <div
                className="bg-bg-artist-back rounded-md w-[205px] h-[42px] flex items-center justify-center"
                onClick={handleAddDate}
              >
                <h1 className="text-[18px] text-white">Add Date Manually</h1>
              </div>
            </div>

            <div className="mt-[10vh] flex items-center justify-between">
              <div
                className="flex items-center gap-[10px] cursor-pointer"
                onClick={() => setView("location")}
              >
                <div className="bg-bg-artist-back rounded-full w-[55px] h-[55px] flex items-center justify-center">
                  <img src={backButton} alt="back" />
                </div>
                <h1 className="text-[18px] text-white">Back</h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistPrev;
