
"use client";

import GenerationRedirectButton from '@/app/_components/Buttons/GenerationRedirectButton';

export default function AboutProjectAndCTA() {
  return (
    <>
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-royal_blue_traditional-800 dark:text-yellow-accent mb-8">
              About This Project
            </h2>
            <div className="space-y-6 text-lg text-royal_blue_traditional-600 dark:text-yellow-accent leading-relaxed">
              <p>
                ImageineIt is a full-stack AI application that demonstrates the integration of modern web technologies 
                with cutting-edge machine learning models. It uses
                React, Next.js, TypeScript, and AI model integration via Ollama namely the Qwen 2.5-vl and Llama 3.1.
              </p>
              <p>
                The application combines computer vision capabilities with natural language processing to create 
                an intuitive storytelling tool. It features real-time image analysis, streaming story generation, 
                and a responsive design that works seamlessly across devices.
              </p>
              <p>
                This project demonstrates practical implementation of complex technologies in an accessible, user-friendly interface.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-anti_flash_white-50/50 dark:bg-royal_blue_traditional-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-royal_blue_traditional-800 dark:text-yellow-accent mb-6">
            Ready to Transform Your Images?
          </h2>
          <p className="text-lg text-royal_blue_traditional-600 dark:text-yellow-accent max-w-2xl mx-auto mb-8">
            Experience the future of visual storytelling. Upload an image and watch as AI breathes life into your pictures.
          </p>
          <GenerationRedirectButton href="/generate-story" className='mx-[400px] py-4 mb-[-80px]'>
            Start Creating Stories
          </GenerationRedirectButton>
        </div>
      </section>
    </>
  );
}