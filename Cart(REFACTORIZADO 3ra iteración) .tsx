import { ILineCart } from "../../services/graphql/LineCart";
import { Spinner } from "@chakra-ui/react";

interface CartItemProps {
  lineCart: ILineCart;
  onUpdateLineCart: (id_product: number, quantity: number) => void;
  onDeleteLineCart: (id: number) => void;
}

export const CartItem = ({ lineCart, onUpdateLineCart, onDeleteLineCart }: CartItemProps) => {
  return (
    // Lógica de renderizado para un elemento de carrito
    <div>{/* Renderizar la información del elemento de carrito */}</div>
  );
};

interface CartTotalProps {
  total: number | undefined;
}

export const CartTotal = ({ total }: CartTotalProps) => {
  return (
    <div>
      {total ? (
        <p>Total: ${total}</p>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export const CartEmpty = () => {
  return (
    <div>
      <p>NO TIENES PRODUCTOS EN EL CARRITO 😢</p>
    </div>
  );
};

export const CartError = () => {
  return (
    <div>
      <p>Se produjo un error al cargar el carrito. Por favor, inténtalo de nuevo más tarde.</p>
    </div>
  );
};
