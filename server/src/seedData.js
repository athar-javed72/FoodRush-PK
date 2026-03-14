import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { Category } from './models/Category.js';
import { Product } from './models/Product.js';

// High-quality Unsplash images — name matches product (w=800, q=80)
const IMG = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80',
  cheeseburger: 'https://images.unsplash.com/photo-1508736793122-f516e3ba5569?w=800&q=80',
  chickenBurger: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800&q=80',
  sandwich: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800&q=80',
  fries: 'https://images.unsplash.com/photo-1606755456206-b25206cde27e?w=800&q=80',
  friedChicken: 'https://images.unsplash.com/photo-1626645738196-c2a72c7d649b?w=800&q=80',
  nuggets: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800&q=80',
  wings: 'https://images.unsplash.com/photo-1567620836583-6f6cf7e9c6f6?w=800&q=80',
  onionRings: 'https://images.unsplash.com/photo-1639024471283-03518883512d?w=800&q=80',
  taco: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=800&q=80',
  burrito: 'https://images.unsplash.com/photo-1632660346941-023cc64e1252?w=800&q=80',
  nachos: 'https://images.unsplash.com/photo-1547592168-8198c8c43a8e?w=800&q=80',
  quesadilla: 'https://images.unsplash.com/photo-1618040996337-27b2b726160b?w=800&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
  pizzaSlice: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
  pasta: 'https://images.unsplash.com/photo-1696935242644-cce4c40d17c4?w=800&q=80',
  kebab: 'https://images.unsplash.com/photo-1755438538504-97119f066871?w=800&q=80',
  shawarma: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80',
  fishChips: 'https://images.unsplash.com/photo-1764397557799-258db31fe6a4?w=800&q=80',
  donut: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=800&q=80',
  iceCream: 'https://images.unsplash.com/photo-1560008581-98ca296fd14a?w=800&q=80',
  milkshake: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&q=80',
  brownie: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=800&q=80',
  cookie: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80',
  pretzel: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&q=80',
  // Beverages — each product has its own correct image
  cola: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&q=80',
  pepsi: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=800&q=80',
  mirinda: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80',
  sprite: 'https://images.unsplash.com/photo-1680404005217-a441afdefe83?w=800&q=80',
  sevenUp: 'https://images.unsplash.com/photo-1680404005217-a441afdefe83?w=800&q=80',
  water: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800&q=80',
  juice: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80',
  mangoJuice: 'https://images.unsplash.com/photo-1764403713624-44a80917851b?w=800&q=80',
  lemonade: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800&q=80',
  icedTea: 'https://images.unsplash.com/photo-1676159435365-e4401cd933af?w=800&q=80',
  coffee: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
  tea: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=800&q=80',
  greenTea: 'https://images.unsplash.com/photo-1727726672422-0fff852450f9?w=800&q=80',
  energyDrink: 'https://images.unsplash.com/photo-1579217809265-e45e5449610a?w=800&q=80'
};

function slug(s) {
  return s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

async function seed() {
  await connectDB();

  const categoriesData = [
    { name: 'Burgers & Sandwiches', description: 'Classic burgers, cheeseburgers, and sandwiches' },
    { name: 'Fried Items', description: 'Crispy fried chicken, fries, nuggets, and more' },
    { name: 'Mexican-Inspired', description: 'Tacos, burritos, nachos, and quesadillas' },
    { name: 'Pizza & Italian', description: 'Pizza slices, whole pizzas, and pasta' },
    { name: 'International Fast Food', description: 'Kebabs, shawarma, fish and chips' },
    { name: 'Snacks & Desserts', description: 'Donuts, ice cream, milkshakes, cookies, and treats' },
    { name: 'Beverages', description: 'Cold drinks, juices, tea, coffee, and more' }
  ];

  console.log('Creating categories...');
  const categories = {};
  for (const c of categoriesData) {
    const slugVal = slug(c.name);
    let cat = await Category.findOne({ slug: slugVal });
    if (!cat) {
      cat = await Category.create({ name: c.name, slug: slugVal, description: c.description });
      console.log('  +', c.name);
    }
    categories[c.name] = cat._id;
  }

  const productsData = [
    // Burgers & Sandwiches
    { name: 'Classic Hamburger', category: 'Burgers & Sandwiches', price: 350, description: 'Juicy beef patty with fresh lettuce, tomato, and our signature sauce.', image: IMG.burger },
    { name: 'Cheeseburger', category: 'Burgers & Sandwiches', price: 399, description: 'Beef patty topped with melted cheddar, pickles, and mayo.', image: IMG.cheeseburger },
    { name: 'Chicken Burger', category: 'Burgers & Sandwiches', price: 380, description: 'Crispy chicken fillet with coleslaw and tangy sauce.', image: IMG.chickenBurger },
    { name: 'Grilled Cheese Sandwich', category: 'Burgers & Sandwiches', price: 299, description: 'Toasted bread with melted cheese blend.', image: IMG.sandwich },
    { name: 'Club Sandwich', category: 'Burgers & Sandwiches', price: 450, description: 'Triple-decker with chicken, bacon, lettuce, and tomato.', image: IMG.sandwich },
    // Fried Items
    { name: 'French Fries', category: 'Fried Items', price: 150, description: 'Golden crispy fries with a pinch of salt.', image: IMG.fries },
    { name: 'Fried Chicken (4 pcs)', category: 'Fried Items', price: 599, description: 'Crispy fried chicken pieces, perfectly seasoned.', image: IMG.friedChicken },
    { name: 'Chicken Nuggets (6 pcs)', category: 'Fried Items', price: 299, description: 'Tender chicken nuggets with your choice of dip.', image: IMG.nuggets },
    { name: 'Chicken Wings (6 pcs)', category: 'Fried Items', price: 449, description: 'Spicy or mild buffalo wings with blue cheese dip.', image: IMG.wings },
    { name: 'Onion Rings', category: 'Fried Items', price: 199, description: 'Crispy battered onion rings with dipping sauce.', image: IMG.onionRings },
    // Mexican-Inspired
    { name: 'Beef Tacos (3 pcs)', category: 'Mexican-Inspired', price: 399, description: 'Soft tortillas with seasoned beef, salsa, and cheese.', image: IMG.taco },
    { name: 'Chicken Burrito', category: 'Mexican-Inspired', price: 449, description: 'Wrapped with rice, beans, chicken, and guacamole.', image: IMG.burrito },
    { name: 'Loaded Nachos', category: 'Mexican-Inspired', price: 399, description: 'Tortilla chips with cheese, jalapeños, and sour cream.', image: IMG.nachos },
    { name: 'Cheese Quesadilla', category: 'Mexican-Inspired', price: 299, description: 'Grilled tortilla with melted cheese and veggies.', image: IMG.quesadilla },
    // Pizza & Italian
    { name: 'Margherita Pizza', category: 'Pizza & Italian', price: 699, description: 'Classic tomato sauce, mozzarella, and fresh basil.', image: IMG.pizza },
    { name: 'Pepperoni Pizza Slice', category: 'Pizza & Italian', price: 249, description: 'Single slice of pepperoni pizza.', image: IMG.pizzaSlice },
    { name: 'BBQ Chicken Pizza', category: 'Pizza & Italian', price: 799, description: 'BBQ sauce, chicken, red onion, and cilantro.', image: IMG.pizza },
    { name: 'Spaghetti Bolognese', category: 'Pizza & Italian', price: 449, description: 'Pasta with rich meat sauce and parmesan.', image: IMG.pasta },
    // International
    { name: 'Chicken Kebab', category: 'International Fast Food', price: 349, description: 'Grilled chicken kebab with flatbread and sauce.', image: IMG.kebab },
    { name: 'Beef Shawarma', category: 'International Fast Food', price: 399, description: 'Wrapped shawarma with tahini and pickles.', image: IMG.shawarma },
    { name: 'Fish & Chips', category: 'International Fast Food', price: 549, description: 'Beer-battered fish with fries and tartar sauce.', image: IMG.fishChips },
    // Snacks & Desserts
    { name: 'Glazed Donut', category: 'Snacks & Desserts', price: 120, description: 'Fresh glazed donut, soft and sweet.', image: IMG.donut },
    { name: 'Vanilla Ice Cream', category: 'Snacks & Desserts', price: 199, description: 'Scoop of creamy vanilla ice cream.', image: IMG.iceCream },
    { name: 'Chocolate Milkshake', category: 'Snacks & Desserts', price: 299, description: 'Thick chocolate milkshake with whipped cream.', image: IMG.milkshake },
    { name: 'Chocolate Brownie', category: 'Snacks & Desserts', price: 199, description: 'Warm chocolate brownie with nuts.', image: IMG.brownie },
    { name: 'Chocolate Chip Cookie', category: 'Snacks & Desserts', price: 80, description: 'Fresh-baked cookie with chocolate chips.', image: IMG.cookie },
    { name: 'Soft Pretzel', category: 'Snacks & Desserts', price: 149, description: 'Soft pretzel with salt and cheese dip.', image: IMG.pretzel },
    // Beverages
    { name: 'Coca Cola', category: 'Beverages', price: 80, description: 'Chilled Coca Cola 300ml.', image: IMG.cola },
    { name: 'Pepsi', category: 'Beverages', price: 80, description: 'Chilled Pepsi 300ml.', image: IMG.pepsi },
    { name: 'Mirinda', category: 'Beverages', price: 80, description: 'Orange fizzy drink 300ml.', image: IMG.mirinda },
    { name: '7Up', category: 'Beverages', price: 80, description: 'Lemon-lime soda 300ml.', image: IMG.sevenUp },
    { name: 'Sprite', category: 'Beverages', price: 80, description: 'Lemon-lime refreshment 300ml.', image: IMG.sprite },
    { name: 'Mineral Water', category: 'Beverages', price: 50, description: 'Bottled mineral water 500ml.', image: IMG.water },
    { name: 'Fresh Orange Juice', category: 'Beverages', price: 150, description: 'Freshly squeezed orange juice.', image: IMG.juice },
    { name: 'Mango Juice', category: 'Beverages', price: 120, description: 'Sweet mango juice 250ml.', image: IMG.mangoJuice },
    { name: 'Lemonade', category: 'Beverages', price: 100, description: 'Fresh lemonade with mint.', image: IMG.lemonade },
    { name: 'Iced Tea', category: 'Beverages', price: 120, description: 'Chilled iced tea, peach or lemon.', image: IMG.icedTea },
    { name: 'Hot Coffee', category: 'Beverages', price: 180, description: 'Freshly brewed coffee.', image: IMG.coffee },
    { name: 'Karak Chai', category: 'Beverages', price: 80, description: 'Strong masala karak chai.', image: IMG.tea },
    { name: 'Green Tea', category: 'Beverages', price: 100, description: 'Hot or iced green tea.', image: IMG.greenTea },
    { name: 'Energy Drink', category: 'Beverages', price: 200, description: 'Energy drink 250ml.', image: IMG.energyDrink }
  ];

  console.log('Creating/updating products...');
  for (const p of productsData) {
    const catId = categories[p.category];
    const slugVal = slug(p.name);
    const payload = {
      name: p.name,
      slug: slugVal,
      description: p.description,
      category: catId,
      price: p.price,
      image: p.image,
      isAvailable: true
    };
    const existing = await Product.findOne({ slug: slugVal });
    if (existing) {
      await Product.findByIdAndUpdate(existing._id, payload);
      console.log('  ~', p.name, '(updated image & details)');
    } else {
      await Product.create(payload);
      console.log('  +', p.name, '- Rs.', p.price);
    }
  }

  console.log('Seed completed. Categories and products are ready.');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
