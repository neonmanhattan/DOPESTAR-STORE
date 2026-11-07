export type Occasion = "Everyday" | "Smart casual" | "Streetwear" | "Evening";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  occasions: Occasion[];
  colors: string[];
  clothing: boolean;
};

export const products: Product[] = [
  {
    id: "cuban-set",
    name: "Cuban Shirt & Beltless Pants",
    category: "Matching set",
    price: 85000,
    image: "/products/cuban-set.jpeg",
    description: "An easy, polished two-piece for days out and dinners.",
    occasions: ["Smart casual", "Evening"],
    colors: ["White", "Blue", "Grey", "Black"],
    clothing: true,
  },
  {
    id: "stretch-jeans",
    name: "Stretchy Jeans",
    category: "Pants",
    price: 72000,
    image: "/products/jeans-blue.jpeg",
    description: "A comfortable everyday staple with an easy-to-style wash.",
    occasions: ["Everyday", "Streetwear"],
    colors: ["Blue", "Grey", "Black"],
    clothing: true,
  },
  {
    id: "striped-shirt",
    name: "Striped Cuban Shirt",
    category: "Shirts",
    price: 110000,
    image: "/products/striped-shirt.jpeg",
    description: "A statement stripe that works from daytime plans into the evening.",
    occasions: ["Smart casual", "Evening"],
    colors: ["Blue", "Green", "Purple"],
    clothing: true,
  },
  {
    id: "knit-tee",
    name: "Knitted T-Shirt",
    category: "Shirts",
    price: 95000,
    image: "/products/knit-tee.jpeg",
    description: "A textured short-sleeve layer for a clean, relaxed look.",
    occasions: ["Everyday", "Smart casual"],
    colors: ["Cream", "Grey", "Black", "Green"],
    clothing: true,
  },
  {
    id: "quarter-zip",
    name: "Quarter Zip Sweater",
    category: "Sweaters",
    price: 38000,
    image: "/products/quarter-zip.jpeg",
    description: "An easy layer for cooler Kampala evenings.",
    occasions: ["Everyday", "Smart casual"],
    colors: ["Brown", "Black", "Cream", "Green"],
    clothing: true,
  },
  {
    id: "track-set",
    name: "Puma Sweater-Pants Set",
    category: "Tracksuit",
    price: 120000,
    image: "/products/track-set.jpeg",
    description: "A coordinated set made for laid-back days and streetwear looks.",
    occasions: ["Everyday", "Streetwear"],
    colors: ["Black", "Green", "Cream", "Pink"],
    clothing: true,
  },
  {
    id: "power-suit",
    name: "Men's Power Suit",
    category: "Suits",
    price: 180000,
    image: "/products/power-suit.jpeg",
    description: "A sharp option for events, celebrations, and dressed-up plans.",
    occasions: ["Smart casual", "Evening"],
    colors: ["Black", "Grey", "Brown"],
    clothing: true,
  },
  {
    id: "wool-jacket",
    name: "Woolen Jacket",
    category: "Jackets",
    price: 65000,
    image: "/products/wool-jacket.jpeg",
    description: "A warm layer that adds an easy finish to casual outfits.",
    occasions: ["Everyday", "Streetwear"],
    colors: ["White", "Black", "Blue", "Brown"],
    clothing: true,
  },
  {
    id: "classic-watch",
    name: "Classic Watch",
    category: "Accessories",
    price: 35000,
    image: "/products/classic-watch.jpeg",
    description: "A finishing touch for everyday and smart-casual outfits.",
    occasions: ["Everyday", "Smart casual", "Evening"],
    colors: ["Gold", "Silver", "Black"],
    clothing: false,
  },
  {
    id: "jewelry",
    name: "Jewelry",
    category: "Accessories",
    price: 22000,
    image: "/products/jewelry.jpeg",
    description: "Small details to make a look feel like your own.",
    occasions: ["Everyday", "Smart casual", "Evening"],
    colors: ["Gold", "Silver", "Black"],
    clothing: false,
  },
];

export const formatUGX = (amount: number) =>
  `UGX ${Math.round(amount).toLocaleString("en-UG")}`;
