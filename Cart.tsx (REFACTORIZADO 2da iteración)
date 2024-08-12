import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { ICart } from "../../services/graphql/Cart";
import { ILineCart } from "../../services/graphql/LineCart";
import { DELETE_PRODUCT, UPDATE_PRODUCT } from "../../services/graphql/mutation/LineCart";
import { CART, GET_TOTAL_OF_CART } from "../../services/graphql/query/Cart";
import { useCheckUser } from "../../services/hooks/useCheckUser";
import { CartItem } from "./CartItem";
import { CartEmpty } from "./CartEmpty";
import { CartTotal } from "./CartTotal";
import { CartError } from "./CartError";
import { Spinner } from "@chakra-ui/react";

export const Cart = () => {
  useCheckUser();
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<ICart | undefined>(undefined);
  const [totalOfCart, setTotalOfCart] = useState<number>();
  const { data: cartData, loading: cartLoading, error: cartError } = useQuery(CART);
  const { fetchMore: fetchMoreTotal } = useQuery(GET_TOTAL_OF_CART);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  useEffect(() => {
    if (!cartLoading && cartData) {
      setCart(cartData.cart);
      setLoading(false);
    }
  }, [cartData, cartLoading]);

  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const { data } = await fetchMoreTotal({ query: GET_TOTAL_OF_CART });
        const { getTotalOfCart } = data;
        setTotalOfCart(getTotalOfCart.total);
      } catch (error) {
        // Handle error
        console.error("Error fetching total:", error);
      }
    };

    if (!cartLoading && cartData) {
      fetchTotal();
    }
  }, [cartData, cartLoading, fetchMoreTotal]);

  const handleUpdateLineCart = async (id_product: number, quantity: number) => {
    try {
      setLoading(true);
      await updateProduct({ variables: { input: { product_id: id_product, quantity: quantity } } });
      // Actualizar el carrito y el total después de la actualización
      setLoading(false);
    } catch (error) {
      // Handle error
      console.error("Error updating line cart:", error);
      setLoading(false);
    }
  };

  const handleDeleteLineCart = async (id: number) => {
    try {
      setLoading(true);
      await deleteProduct({ variables: { id: id } });
      // Actualizar el carrito y el total después de la eliminación
      setLoading(false);
    } catch (error) {
      // Handle error
      console.error("Error deleting line cart:", error);
      setLoading(false);
    }
  };

  return (
    <>
      {loading || cartLoading ? (
        <Spinner />
      ) : cartError ? (
        <CartError />
      ) : (
        <>
          {cart?.line_cart.length ? (
            <>
              {cart.line_cart.map((line_cart: ILineCart) => (
                <CartItem
                  key={line_cart.id}
                  lineCart={line_cart}
                  onUpdateLineCart={handleUpdateLineCart}
                  onDeleteLineCart={handleDeleteLineCart}
                />
              ))}
              <CartTotal total={totalOfCart} />
            </>
          ) : (
            <CartEmpty />
          )}
        </>
      )}
    </>
  );
};
