import Link from "next/link";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useAlert } from "react-alert";
import { useCart } from "@saleor/sdk";

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
  const { items, addItem } = useCart();
  const alert = useAlert();

  const [variantStock, setVariantStock] = useState<number>(0);
  const handleAddToCart = (
    variantId: string,
    variantName: string,
    cartQuantity: number
  ) => {
    setVariantStock(variantStock - 1);
    addItem(variantId, 1).then(r => {
      alert.remove(alert.alerts?.[0]);
      alert.show(
        {
          content: `You have ${cartQuantity + 1} of this item in your cart`,
          title: `${variantName} added to cart!`,
        },
        {
          timeout: 2000,
          type: "success",
        }
      );
    });
  };

  return (
    <>
      <S.List data-test="productList" data-test-id={testingContextId}>
        {products.map(product => {
          const { id, name } = product;
          const variant = product.variants?.[0];

          if (variant) {
            const cartItem = items?.find(i => i.variant.id === variant.id);
            const cartQuantity = cartItem?.quantity || 0;

            const disableButton = !canAddToCart(
              [],
              !!product.isAvailableForPurchase,
              variant.id,
              variant.quantityAvailable - cartQuantity,
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
                    onSubmit={() =>
                      handleAddToCart(variant.id, name, cartQuantity)
                    }
                    disabled={disableButton}
                  />
                </div>
              )
            );
          }

          return (
            id &&
            name && (
              <Link href={generateProductUrl(id, name)} key={id}>
                <a>
                  <ProductTile product={product} />
                </a>
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
