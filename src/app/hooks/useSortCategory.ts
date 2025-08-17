import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export enum SortCategory {
  NAME = "name",
  ACCURACY = "accuracy",
  WORDS_PER_MINUTE = "wordsPerMinute",
}

export type SortOrder = "asc" | "desc";

export function useLobbySort(defaultCategory: SortCategory = SortCategory.NAME) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [sortCategory, setSortCategory] = useState<SortCategory>(defaultCategory);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    const categoryParam = searchParams.get("sortBy") as SortCategory | null;
    const orderParam = searchParams.get("order") as SortOrder | null;

    if (categoryParam && Object.values(SortCategory).includes(categoryParam)) {
      setSortCategory(categoryParam);
    }

    if (orderParam && ["asc", "desc"].includes(orderParam)) {
      setSortOrder(orderParam);
    }
  }, [searchParams]);

  const changeSortCategory = (category: SortCategory) => {
    let newOrder: SortOrder = "asc";
    if (category === sortCategory) {
      newOrder = sortOrder === "asc" ? "desc" : "asc";
    }
    setSortCategory(category);
    setSortOrder(newOrder);

    const params = new URLSearchParams(searchParams as any);
    params.set("sortBy", category);
    params.set("order", newOrder);
    router.replace(`?${params.toString()}`);
  };

  return {
    sortCategory,
    sortOrder,
    changeSortCategory,
  };
}
