import React, { useState } from "react";

import { useCart } from "@saleor/sdk";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { Button, Loader } from "@components/atoms";
import { ProductTile } from "@components/molecules";
import { canAddToCart } from "@components/organisms";

import { generateProductUrl } from "../../../../core/utils";

import * as S from "./styles";
import { IProps } from "./types";
import AddToCartButton from "../../molecules/AddToCartButton/AddToCartButton";

export const ProductList: React.FC<IProps> = ({
  products,
  canLoadMore = false,
  loading = false,
  testingContextId,
  onLoadMore = () => null,
}: IProps) => {
  return (
    <>
      <S.List data-test="productList" data-test-id={testingContextId}>
        {products.map(product => {
          const { id, name } = product;
          const variant = product.variants?.[0];

          if (variant) {
            const { items, addItem } = useCart();
            const cartItem = items?.find(
              item => item.variant.id === variant.id
            );
            const remaining =
              variant.quantityAvailable - (cartItem?.quantity || 0);

            const [variantStock, setVariantStock] = useState<number>(remaining);

            const handleAddToCart = (variantId: string) => {
              setVariantStock(variantStock - 1);
              addItem(variantId, 1);
            };

            const disableButton = !canAddToCart(
              [],
              !!product.isAvailableForPurchase,
              variant.id,
              remaining,
              1
            );

            return (
              id &&
              name && (
                <div key={id}>
                  <Link to={generateProductUrl(id, name)}>
                    <ProductTile product={product} />
                  </Link>
                  <AddToCartButton
                    onSubmit={() => handleAddToCart(variant.id)}
                    disabled={disableButton}
                  />
                </div>
              )
            );
          }

          return (
            id &&
            name && (
              <Link to={generateProductUrl(id, name)} key={id}>
                <ProductTile product={product} />
              </Link>
            )
          );
        })}
      </S.List>
      <S.Loader>
        {loading ? (
          <Loader />
        ) : (
          canLoadMore && (
            <Button
              testingContext="loadMoreProductsButton"
              color="secondary"
              onClick={onLoadMore}
            >
              <FormattedMessage defaultMessage="More +" />
            </Button>
          )
        )}
      </S.Loader>
    </>
  );
};
