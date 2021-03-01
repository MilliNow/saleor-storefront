import React from "react";

import { TaxedMoney } from "@components/containers";
import { Thumbnail } from "@components/molecules";
import { useAuth } from "@saleor/sdk";

import * as S from "./styles";
import { IProps } from "./types";

export const ProductTile: React.FC<IProps> = ({ product }: IProps) => {
  const price =
    product.pricing &&
    product.pricing.priceRange &&
    product.pricing.priceRange.start
      ? product.pricing.priceRange.start
      : undefined;

  // OLIVELAND: Remove pricing if user is admin
  const { user } = useAuth();
  if (!user || !user.isStaff) {
    return (
      <S.Wrapper>
        <S.Title data-test="productTile">{product.name}</S.Title>
        <S.Image data-test="productThumbnail">
          <Thumbnail source={product} />
        </S.Image>
      </S.Wrapper>
    );
  }

  return (
    <S.Wrapper>
      <S.Title data-test="productTile">{product.name}</S.Title>
      <S.Price data-test="productPrice">
        <TaxedMoney taxedMoney={price} />
      </S.Price>
      <S.Image data-test="productThumbnail">
        <Thumbnail source={product} />
      </S.Image>
    </S.Wrapper>
  );
};
