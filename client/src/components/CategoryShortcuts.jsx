import { Link } from 'react-router-dom';

const categories = [
  { name: 'Hoodies', image: '/products/hoodie-olive-front.jpg' },
  { name: 'T-Shirts', image: '/products/tee-front.jpg' },
  { name: 'Bottoms', image: 'https://placehold.co/600x800?text=Bottoms' },
  { name: 'Accessories', image: '/products/beanie.jpg' },
];

export default function CategoryShortcuts() {
  return (
    <section className="px-6 md:px-10 py-16">
      <h2 className="font-display text-2xl md:text-3xl mb-6">Shop by Category</h2>
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            to="/"
            className="relative flex-shrink-0 w-40 md:w-56 aspect-[3/4] overflow-hidden bg-stone/10 group"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <span className="absolute bottom-4 left-4 text-bone font-display text-lg">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
