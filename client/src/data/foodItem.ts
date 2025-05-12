const foodItems = [
  // Salads (IDs 1–10)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: (i + 1).toString(),
    name: `Salad Item ${i + 1}`,
    description: "Crisp lettuce, cherry tomatoes, cucumber, and bell peppers with a light vinaigrette dressing",
    price: 149 + (i % 3) * 10,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FsYWR8ZW58MHx8MHx8fDA%3D",
    category: "Salads",
    quantity: 0,
  })),

  // Soups (IDs 11–20)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: (i + 11).toString(),
    name: `Soup Item ${i + 1}`,
    description: "Rich tomato soup with fresh basil and a touch of cream",
    price: 129 + (i % 3) * 15,
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c291cHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Soups",
    quantity: 0,
  })),

  // Snacks (IDs 21–30)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: (i + 21).toString(),
    name: `Snack Item ${i + 1}`,
    description: "Crispy tortilla chips topped with melted cheese, jalapeños, salsa, and sour cream",
    price: 189 + (i % 4) * 10,
    image: "https://plus.unsplash.com/premium_photo-1679591002405-13fec066bd53?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c25hY2tzfGVufDB8fDB8fHww",
    category: "Snacks",
    quantity: 0,
  })),

  // French Fries (IDs 31–40)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: (i + 31).toString(),
    name: `French Fries Item ${i + 1}`,
    description: "French fries topped with melted cheese, bacon bits, and green onions",
    price: 99 + (i % 3) * 20,
    image: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnJlbmNoJTIwZnJpZXN8ZW58MHx8MHx8fDA%3D",
    category: "French Fries",
    quantity: 0,
  })),

  // Pizzas (IDs 41–50)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: (i + 41).toString(),
    name: `Pizza Item ${i + 1}`,
    description: "Pizza topped with tomato sauce, mozzarella cheese, and spicy pepperoni slices",
    price: 249 + (i % 4) * 25,
    image: "https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGl6emFzfGVufDB8fDB8fHww",
    category: "Pizzas",
    quantity: 0,
  })),

  // Pastas (IDs 51–60)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: (i + 51).toString(),
    name: `Pasta Item ${i + 1}`,
    description: "Fettuccine pasta in creamy parmesan sauce with garlic and butter",
    price: 229 + (i % 3) * 20,
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGFzdGF8ZW58MHx8MHx8fDA%3D",
    category: "Pastas",
    quantity: 0,
  })),

  // Drinks (IDs 61–70)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: (i + 61).toString(),
    name: `Drink Item ${i + 1}`,
    description: "Refreshing lemonade made with fresh lemons and a hint of mint",
    price: 79 + (i % 4) * 8,
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZHJpbmtzfGVufDB8fDB8fHww",
    category: "Drinks",
    quantity: 0,
  })),

  // Desserts (IDs 71–80)
  ...Array.from({ length: 8 }, (_, i) => ({
    id: (i + 71).toString(),
    name: `Dessert Item ${i + 1}`,
    description: "Warm chocolate brownie served with vanilla ice cream and chocolate sauce",
    price: 169 + (i % 3) * 15,
    image: "https://plus.unsplash.com/premium_photo-1680172800885-61c5f1fc188e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZGVzc2VydHxlbnwwfHwwfHx8MA%3D%3D",
    category: "Desserts",
    quantity: 0,
  })),
];

export const getFoodItems = () => {
  return foodItems;
};

export const getFoodById = (id: string) => {
  return foodItems.find((item) => item.id === id);
};

export const getFoodByCategory = (name: string) => {
  const item = foodItems.filter((item) => item.category.toLowerCase() === name.toLowerCase())
  return  item       
}