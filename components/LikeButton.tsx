"use client";

import { useState } from "react";

type LikeButtonProps = {
  initialLikes: number;
};

export default function LikeButton({ initialLikes }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);

  return (
    <button
      type="button"
      onClick={() => setLikes((current) => current + 1)}
      className="border p-2 hover:bg-gray-100"
    >
      ❤ {likes}
    </button>
  );
}
