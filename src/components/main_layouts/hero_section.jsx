export default function HeroSection() {
  return (
    <section className="max-w-6xl md:max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16">
      <div className="grid grid-cols-12 items-center gap-8 md:gap-12">

 
        <div className="col-span-12 md:col-span-4 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="block">Stay</span>
            <span className="block">Informed,</span>
            <span className="block">Stay Inspired</span>
          </h1>
          <p className="mt-5 text-gray-600 md:text-base">
            Discover a World of Knowledge at Your Fingertips.
            <br className="hidden md:block" />
            Your Daily Dose of Inspiration and Information.
          </p>
        </div>

        
        <div className="col-span-12 md:col-span-4">
          <img
            src="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg"
            alt="Author with cat"
            className="rounded-2xl w-full object-cover shadow-sm"
          />
        </div>

        
        <div className="col-span-12 md:col-span-4 text-center md:text-left">
          <p className="text-sm text-gray-500 mb-1">– Author</p>
          <h3 className="text-xl font-semibold mb-3">Thompson P.</h3>
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

      </div>
    </section>
  );
}