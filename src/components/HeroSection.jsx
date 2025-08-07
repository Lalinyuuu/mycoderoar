// src/components/HeroSection.jsx
export default function HeroSection() {
    return (
      <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16 gap-12">
        
        {/* Left text section */}
        <div className="md:w-1/3 text-center md:text-left">
          <h1 className="text-4xl font-bold mb-4">
            Stay Informed,<br />Stay Inspired
          </h1>
          <p className="text-gray-600">
            Discover a World of Knowledge at Your Fingertips. <br />
            Your Daily Dose of Inspiration and Information.
          </p>
        </div>
  
        {/* Image section */}
        <div className="md:w-1/3">
          <img
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt="Author with cat"
            className="rounded-xl w-full"
          />
        </div>
  
        {/* Author section */}
        <div className="md:w-1/3 text-center md:text-left">
          <p className="text-sm text-gray-500 mb-1">– Author</p>
          <h3 className="text-lg font-semibold mb-2">Thompson P.</h3>
          <p className="text-gray-700 mb-4">
            I am a pet enthusiast and freelance writer who specializes in animal
            behavior and care. With a deep love for cats, I enjoy sharing insights
            on feline companionship and wellness.
          </p>
          <p className="text-gray-700">
            When i’m not writing, I spends time volunteering at my local animal shelter,
            helping cats find loving homes.
          </p>
        </div>
      </section>
    );
  }