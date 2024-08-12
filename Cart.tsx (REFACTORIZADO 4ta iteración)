import { ILineCart } from "../../services/graphql/LineCart";
import {
  Box,
  Flex,
  Text,
  Avatar,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

interface CartItemProps {
  lineCart: ILineCart;
  onUpdateLineCart: (id_product: number, quantity: number) => void;
  onDeleteLineCart: (id: number) => void;
}

export const CartItem = ({ lineCart, onUpdateLineCart, onDeleteLineCart }: CartItemProps) => {
  return (
    <>
      <Box
        p={4}
        display="flex"
        flexDirection={{ base: "column", sm: "row" }}
        alignItems="center"
        minH="300px"
        w="100%"
        borderColor="gray.200"
        borderWidth="1px"
        justifyContent="space-between"
        h="auto"
      >
        <Flex
          justifyContent={{ base: "center", sm: "flex-start" }}
          direction={{ base: "column", sm: "row" }}
          alignItems="center"
        >
          {lineCart.product.url_image ? (
            <Avatar
              src={lineCart.product.url_image}
              size="lg"
              mb={{ base: "15px", sm: "0" }}
              mr={{ base: "0", sm: "15px" }}
            />
          ) : null}
          <NumberInput
            onChange={(valueAsNumber) => onUpdateLineCart(lineCart.product.id, Number(valueAsNumber))}
            min={1}
            max={lineCart.product.stock}
            mr={{ base: 0, sm: 5 }}
            maxW="100px"
            defaultValue={lineCart.quantity}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text my={5} fontWeight="bold">
            {lineCart.product.name}
          </Text>
        </Flex>
        <Box
          display="flex"
          alignItems="center"
          justifyContent={{ base: "center", sm: "flex-end" }}
          flexDirection={{ base: "column", sm: "row" }}
        >
          <Text
            mb={{ base: "5px", sm: "0px" }}
            mr={{ base: "0px", sm: "10px" }}
            fontWeight="bold"
          >
            ${lineCart.total}
          </Text>
          <IconButton
            w={{ base: 100, sm: "auto" }}
            icon={<DeleteIcon />}
            aria-label="Eliminar el producto del carrito."
            onClick={() => onDeleteLineCart(lineCart.id)}
            isLoading={false} {/* Aquí puedes poner la lógica para el spinner si lo deseas */}
          />
        </Box>
      </Box>
      <Divider />
    </>
  );
};
