import Image from 'next/image';
import { DefiningFeature } from '@/types/api';

interface PeriodFeaturesProps {
  features: DefiningFeature[];
}

export default function PeriodFeatures({ features }: PeriodFeaturesProps) {
  return (
    <section className="py-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Defining Features</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={feature.imageUrl}
                  alt={feature.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gallery-dark">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
