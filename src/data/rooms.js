import heritage from "../images/room-heritage.png";
import suite from "../images/room-suite.png";
import courtyard from "../images/room-courtyard.png";

export const GST_RATE = 0.12;

export const rooms = [
  {
    id: "heritage",
    name: "Heritage Room",
    tagline: "Old-city charm with a courtyard view",
    image: heritage,
    price: 2200,
    maxGuests: 2,
    bed: "Queen bed",
    perks: ["Courtyard view", "Breakfast included", "Air conditioning"],
  },
  {
    id: "suite",
    name: "Riverside Suite",
    tagline: "Wake up to the Ganges",
    image: suite,
    price: 4800,
    maxGuests: 3,
    bed: "King bed + daybed",
    perks: ["River-facing balcony", "Breakfast included", "Evening chai service"],
  },
  {
    id: "courtyard",
    name: "Courtyard Family Room",
    tagline: "Room to spread out near the ghats",
    image: courtyard,
    price: 3500,
    maxGuests: 4,
    bed: "Two double beds",
    perks: ["Sleeps up to 4", "Breakfast included", "Ghat pickup"],
  },
];
