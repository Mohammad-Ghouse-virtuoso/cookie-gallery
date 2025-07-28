import chocoChunk from '../assets/Choco-cookie.jpg';
import oatmealRaisin from '../assets/Oatmeal-cookie.jpg';
import whiteChoco from '../assets/white_choco-cookie.jpg';
import gingerCookie from '../assets/ginger-cookie.jpg';
import peanutCookie from '../assets/Peanut_butter-cookie.jpg';
import doubleChoco from '../assets/double-choco-cookie.jpg';
import cranberryCookie from '../assets/cranberry-cookie.jpg';
import coconutCookie from '../assets/coconut-cookie.jpg';
import almondCookie from '../assets/almond-cookie.jpg';
import blueberryCookie from '../assets/blueberry-cookie.jpg';


export type CookieData  = {
    id: string;
    name: string;
    price: number;
    description: string;
    src: string;
  };

  export const cookies: CookieData [] = [
    {
      id: 'choco-cookie',
      name: 'Choco cookie',
      price: 70, // Basic chocolate, medium price
      description: "A delightful classic with rich chocolate chips, perfect for any time.",
      src:chocoChunk, // Placeholder src
    },
    {
      id: 'oatmeal-cookie',
      name: 'Oatmeal cookie',
      price: 65, // Simple, wholesome, lower price
      description: "Hearty oatmeal cookie, a comforting and traditional treat.",
      src: oatmealRaisin, // Placeholder src
    },
    {
      id: "white-choco-cookie",
      name: "White Choco cookie",
      price: 105, // White chocolate often pricier
      description: "Sweet and creamy white chocolate chunks baked into a soft, chewy cookie.",
      src: whiteChoco, // Placeholder src
    },
    {
      id: 'ginger-cookie',
      name: 'Ginger cookie',
      price: 75, // Aromatic, distinct flavor, medium price
      description: "Spicy and warm ginger cookie with a crisp edge and chewy center.",
      src: gingerCookie, // Placeholder src
    },
    {
      id: 'peanut-cookie',
      name: 'Peanut cookie',
      price: 95, // Nut-based, slightly higher
      description: "Rich and nutty, a classic peanut butter cookie with a soft texture.",
      src: peanutCookie, // Placeholder src
    },
    {
      id: 'double-choco-cookie',
      name: 'Double Choco cookie',
      price: 85, // More chocolate, slightly higher
      description: "Indulge in deep chocolate flavor with extra chocolate chunks.",
      src: doubleChoco, // Placeholder src
    },
    {
      id: "cranberry-cookie",
      name: "Cranberry cookie",
      price: 80, // Fruit-based, medium price
      description: "Sweet and tart cranberries baked into a delicious, chewy cookie.",
      src: cranberryCookie, // Placeholder src
    },
    {
      id: "coconut-cookie",
      name: "Coconut cookie",
      price: 85, // Distinct flavor, medium-high price
      description: "Tropical delight with shredded coconut for a tender and flavorful experience.",
      src: coconutCookie, // Placeholder src
    },
    {
      id: "almond-cookie",
      name: "Almond cookie",
      price: 120, // As requested, most expensive
      description: "A premium cookie rich with the delicate, nutty flavor of almonds.",
      src: almondCookie, // Placeholder src
    },
    {
      id: "blueberry-cookie",
      name: "Blueberry cookie",
      price: 110, // Fruit and unique flavor, higher price
      description: "Bursting with juicy blueberries, a delightful and fruity treat.",
      src: blueberryCookie, // Placeholder src
    },
  ];