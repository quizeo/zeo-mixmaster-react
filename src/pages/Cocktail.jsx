import axios from "axios";
import React from "react";
import { Link, useLoaderData, Navigate } from "react-router-dom";
import Wrapper from "../assets/wrappers/CocktailPage";
import { useQuery } from "@tanstack/react-query";

const singleCocktailUrl =
  "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const { id } = params;
    // const { data } = await axios.get(`${singleCocktailUrl}${id}`);

    await queryClient.ensureQueryData(CocktailQuery(id));

    return { id };
  };

const CocktailQuery = (id) => {
  return {
    queryKey: ["cocktail", id],
    queryFn: async () => {
      const response = await axios.get(`${singleCocktailUrl}${id}`);
      return response.data;
    },
  };
};

const Cocktail = () => {
  const { id } = useLoaderData();
  const { data } = useQuery(CocktailQuery(id));

  if (!data) {
    return <Navigate to="/" />;
  }

  const singleCocktail = data.drinks[0];

  const {
    strDrink: name,
    strDrinkThumb: image,
    strAlcoholic: info,
    strCategory: category,
    strGlass: glass,
    strInstructions: instructions,
  } = singleCocktail;

  const validIngredients = Object.keys(singleCocktail)
    .filter(
      (key) => key.startsWith("strIngredient") && singleCocktail[key] !== null
    )
    .map((key) => singleCocktail[key]);

  console.log(validIngredients);

  return (
    <Wrapper>
      <header>
        <Link to="/" className="btn">
          Back Home
        </Link>
        <h3>{name}</h3>
      </header>
      <div className="drink">
        <img src={image} alt={name} className="img" />
        <div className="drink-info">
          <p>
            <span className="drink-data">name: </span>
            {name}
          </p>
          <p>
            <span className="drink-data">category: </span>
            {category}
          </p>
          <p>
            <span className="drink-data">info: </span>
            {info}
          </p>
          <p>
            <span className="drink-data">glass: </span>
            {glass}
          </p>
          <p>
            <span className="drink-data">ingredient: </span>
            {validIngredients.map((ingredient, index) => {
              return (
                <span key={ingredient} className="ingredient">
                  {ingredient}
                  {index < validIngredients.length - 1 ? ", " : ""}
                </span>
              );
            })}
          </p>
          <p>
            <span className="drink-data">instructions: </span>
            {instructions}
          </p>
        </div>
      </div>
    </Wrapper>
  );
};

export default Cocktail;
