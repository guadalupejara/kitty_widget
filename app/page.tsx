import React from "react";
import Link from "next/link";

function Home() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <p>This is the main landing page of our application.</p>
         <Link
        href="/cats"
        className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition"
      >
        Cats
      </Link>
    </div>
  );
}

export default Home;
