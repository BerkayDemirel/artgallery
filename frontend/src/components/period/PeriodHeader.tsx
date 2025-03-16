import Image from 'next/image';

interface PeriodHeaderProps {
  name: string;
  imageUrl: string;
}

export default function PeriodHeader({ name, imageUrl }: PeriodHeaderProps) {
  return (
    <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl}
          alt={`${name} period artwork`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
            {name}
          </h1>
        </div>
      </div>
    </div>
  );
}
