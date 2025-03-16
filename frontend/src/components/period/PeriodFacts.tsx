interface PeriodFactsProps {
  facts: string[];
}

export default function PeriodFacts({ facts }: PeriodFactsProps) {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Did You Know?</h2>

        <div className="bg-gallery-offwhite rounded-lg p-6 shadow-sm">
          <ul className="space-y-4">
            {facts.map((fact, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gallery-accent font-bold mr-2">•</span>
                <p className="text-gallery-dark">{fact}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
