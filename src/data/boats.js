import sunrise from "../images/sunrice.jpg";
import sunset from "../images/boat-sunset.png";
import charter from "../images/heroimage.jpg";

export const boats = [
  {
    id: "sunrise",
    name: "Sunrise Boat Ride",
    tagline: "First light over the ghats",
    image: sunrise,
    duration: "1–2 hours",
    price: 800,
    unit: "person",
    maxGuests: 6,
    slots: ["5:00 AM", "5:30 AM", "6:00 AM"],
    includes: ["Local boatman", "Tea on board", "Ghat pickup"],
  },
  {
    id: "sunset",
    name: "Sunset & Aarti Ride",
    tagline: "Evening light and the Ganga Aarti from the water",
    image: sunset,
    duration: "2 hours",
    price: 900,
    unit: "person",
    maxGuests: 6,
    slots: ["4:30 PM", "5:00 PM", "5:30 PM"],
    includes: ["Aarti viewing spot", "Local boatman", "Photos from the river"],
  },
  {
    id: "charter",
    name: "Private Charter",
    tagline: "The whole boat, your own rhythm",
    image: charter,
    duration: "2–3 hours",
    price: 4500,
    unit: "boat",
    maxGuests: 8,
    slots: ["6:00 AM", "9:00 AM", "4:00 PM", "6:00 PM"],
    includes: ["Private boatman", "Flexible route", "Snacks & chai"],
  },
];
