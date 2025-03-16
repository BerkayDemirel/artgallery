interface PeriodIntroductionProps {
  introduction: string;
}

export default function PeriodIntroduction({ introduction }: PeriodIntroductionProps) {
  return (
    <section className="py-12">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-6">Introduction</h2>
        <div className="prose prose-lg">
          <p className="text-lg leading-relaxed text-gallery-dark">
            {introduction}
          </p>
        </div>
      </div>
    </section>
  );
}
