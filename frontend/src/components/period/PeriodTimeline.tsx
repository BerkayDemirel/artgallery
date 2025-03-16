import { TimelineItem } from '@/types/api';

interface PeriodTimelineProps {
  timelineData: TimelineItem[];
}

export default function PeriodTimeline({ timelineData }: PeriodTimelineProps) {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center">Timeline</h2>

        {/* Desktop timeline (horizontal) */}
        <div className="hidden md:block relative">
          <div className="absolute left-0 right-0 h-1 bg-gallery-gray top-8 -z-10"></div>

          <div className="flex justify-between">
            {timelineData.map((item, index) => (
              <div key={index} className="flex flex-col items-center w-32">
                <div className="w-4 h-4 rounded-full bg-gallery-accent mb-2"></div>
                <div className="font-bold text-lg">{item.year}</div>
                <div className="text-sm text-center mt-2">{item.event}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile timeline (vertical) */}
        <div className="md:hidden">
          <div className="relative border-l-2 border-gallery-gray pl-6 ml-4 space-y-8">
            {timelineData.map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute w-4 h-4 rounded-full bg-gallery-accent -left-8 top-1"></div>
                <div className="font-bold text-lg">{item.year}</div>
                <div className="text-sm mt-1">{item.event}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
