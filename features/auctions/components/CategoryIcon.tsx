import { CATEGORIES } from "@/lib/categories";
import React from "react";

interface Props {
  categoryId: string;
}

const CategoryIcon = ({ categoryId }: Props) => {
  return (
    <div className="flex items-center justify-center gap-2 border text-xl border-[#e0e0e0] bg-[#f3f2ef] rounded-[8px] h-[3rem] w-[3rem] ">
      {CATEGORIES.find((c) => c.id === categoryId)?.icon ??
        "Nepoznata kategorija"}{" "}
    </div>
  );
};

export default CategoryIcon;
