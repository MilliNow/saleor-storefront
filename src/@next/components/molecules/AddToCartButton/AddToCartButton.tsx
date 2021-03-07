import React from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "@components/atoms";
import { useAuth } from "@saleor/sdk";

export interface IAddToCartButton {
  disabled: boolean;
  onSubmit: () => void;
}

export const AddToCartButton: React.FC<IAddToCartButton> = ({
  onSubmit,
  disabled,
}) => {
  // OLIVELAND: Diable adding product if not admin
  const { user } = useAuth();
  if (!user || !user.isStaff) {
    disabled = true;
  }

  return (
    <Button
      fullWidth
      testingContext="addProductToCartButton"
      onClick={onSubmit}
      color="primary"
      disabled={disabled}
    >
      <FormattedMessage defaultMessage="Add to basket" />
    </Button>
  );
};
AddToCartButton.displayName = "AddToCartButton";
export default AddToCartButton;
