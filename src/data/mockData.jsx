// data/mockData.js
export const mockProducts = [
  {
    id: 1,
    title: "Vintage Camera",
    description: "A beautiful vintage camera from the 1970s in perfect working condition.",
    category: "Electronics",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=300&fit=crop",
    condition: "Used",
    quantity: 1,
    year: 1975,
    brand: "Canon",
    model: "AE-1",
    sellerId: 1,
    status: "active",
    createdAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    title: "Wooden Desk",
    description: "Solid wooden desk with minimal wear. Perfect for home office.",
    category: "Furniture",
    price: 120.00,
    image: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=300&h=300&fit=crop",
    condition: "Like New",
    quantity: 1,
    sellerId: 2,
    status: "active",
    createdAt: "2024-01-14T14:22:00Z"
  },
  // Add more mock products as needed
];

export const mockPurchases = [
  {
    id: 101,
    title: "Wireless Headphones",
    description: "Noise-cancelling wireless headphones",
    category: "Electronics",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop",
    purchaseDate: "2024-01-10T11:30:00Z",
    status: "completed"
  }
];

export const categories = ["Electronics", "Furniture", "Clothing", "Books", "Other"];