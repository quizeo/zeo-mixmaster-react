import axios from "axios";
import React from "react";
import { useLoaderData } from "react-router-dom";
import CocktailList from "../components/CocktailList";
import SearchForm from "../components/SearchForm";
import { useQuery } from "@tanstack/react-query";

const cocktailUrl =
  "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=a";

const searchCocktailQuery = (searchTerm, realUrl) => {
  return {
    queryKey: ["cocktails", searchTerm || "a"],
    queryFn: async () => {
      const response = await axios.get(`${realUrl}${searchTerm}`);
      return response.data.drinks;
    },
  };
};

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const url = new URL(request.url);

    const realUrl = url.searchParams.get("search")
      ? "https://www.thecocktaildb.com/api/json/v1/1/search.php?s="
      : cocktailUrl;

    console.log(url.searchParams.get("search"));

    const searchTerm = url.searchParams.get("search") || "";
    // const response = await axios.get(`${realUrl}${searchTerm}`);

    await queryClient.ensureQueryData(searchCocktailQuery(searchTerm, realUrl));

    return { searchTerm, realUrl };
  };

const Landing = () => {
  const { searchTerm, realUrl } = useLoaderData();

  const { data: drinks } = useQuery(searchCocktailQuery(searchTerm, realUrl));

  return (
    <>
      <SearchForm searchTerm={searchTerm} />
      <CocktailList drinks={drinks} />
    </>
  );
};

export default Landing;
