"use client";

export default function AboutHeroSection() {
  const stats = [
    { value: "7B+", label: "Parameters in Vision Model" },
    { value: "8B+", label: "Parameters in Language Model" },
    { value: "4", label: "Story Generation Modes" },
    { value: "∞", label: "Creative Possibilities" }
  ];

  return (
    <section className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
          <span className="block text-royal_blue_traditional-800 dark:text-yellow-accent mb-2">
            Where Technology
          </span>
          <span className="block text-royal_blue_traditional-600 dark:text-yellow-accent">
            Meets Imagination
          </span>
        </h1>
        <p className="text-lg sm:text-xl text-royal_blue_traditional-600 dark:text-yellow-accent max-w-4xl mx-auto leading-relaxed mb-8">
          A picture is worth a thousand words. Here's the proof. ImageineIt transforms the way we interact with visual content. Using state-of-the-art AI models, 
          we bridge the gap between seeing and storytelling, turning every image into a gateway for creative expression.
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-royal_blue_traditional-600 dark:text-mustard-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-royal_blue_traditional-600 dark:text-yellow-accent">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}