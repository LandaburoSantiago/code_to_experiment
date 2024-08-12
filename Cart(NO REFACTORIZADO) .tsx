import { useMutation, useQuery } from "@apollo/client";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Center,
  CloseButton,
  Flex,
  Spinner,
  useToast,
  VStack,
  Text,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorModeValue,
  useColorMode,
  Button,
  Badge,
  Divider,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Tag,
  Link,
  Avatar,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { ICart } from "../../services/graphql/Cart";
import { ILineCart } from "../../services/graphql/LineCart";
import {
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from "../../services/graphql/mutation/LineCart";
import { CART, GET_TOTAL_OF_CART } from "../../services/graphql/query/Cart";
import { useCheckUser } from "../../services/hooks/useCheckUser";
import { MercadoPago } from "../MercadoPago/MercadoPago";
import { Pay } from "../Pay/Pay";
import "./Cart.css";

export const Cart = () => {
  useCheckUser();
  const [loading, setLoading] = useState(true);
  const [loadingUpdateProduct, setLoadingUpdateProduct] =
    useState<boolean>(false);
  const [cart, setCart] = useState<ICart | undefined>(undefined);
  const [totalOfCart, setTotalOfCart] = useState<number>();
  const [lineCartToDelete, setLineCartToDelete] = useState<
    number | undefined
  >();
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<any>();
  const toast = useToast();
  const navigate = useNavigate();
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const { fetchMore } = useQuery(GET_TOTAL_OF_CART);
  useQuery(CART, {
    onCompleted: async (data) => {
      const { cart } = data;
      try {
        const { data } = await fetchMore({ query: GET_TOTAL_OF_CART });
        const { getTotalOfCart } = data;
        setTotalOfCart(getTotalOfCart.total);
      } catch (error) {
        toast({
          duration: 2500,
          position: "top",
          render: () => getCartError(),
        });
      }
      setCart(cart);
      setLoading(false);
    },
    onError: (error) => {
      toast({
        duration: 2500,
        position: "top",
        render: () => getCartError(),
      });
      setLoading(false);
    },
  });

  const updateLineCart = (id_product: number, quantity: number) => {
    setLoadingUpdateProduct(true);

    updateProduct({
      variables: { input: { product_id: id_product, quantity: quantity } },
    })
      .then(async (dataLineCart) => {
        const { data } = dataLineCart;
        const { updateQuantityOfProduct } = data;
        setCart((oldState) => {
          if (oldState) {
            const newState = JSON.parse(JSON.stringify(oldState));
            const index = newState?.line_cart.findIndex(
              (ele: any) => ele.id === updateQuantityOfProduct.id
            );
            if (index > -1) {
              newState.line_cart[index] = updateQuantityOfProduct;
            }

            return newState;
          }
          return;
        });
        try {
          const { data } = await fetchMore({ query: GET_TOTAL_OF_CART });
          const { getTotalOfCart } = data;
          setTotalOfCart(getTotalOfCart.total);
        } catch (error) {
          toast({
            duration: 2500,
            position: "top",
            render: () => updateLineCartError(),
          });
        }
        setLoadingUpdateProduct(false);
      })
      .catch(() => {
        toast({
          duration: 2500,
          position: "top",
          render: () => updateLineCartError(),
        });
        setLoadingUpdateProduct(false);
      });
  };

  const deleteLineCart = (id: number) => {
    setLoadingUpdateProduct(true);
    setLoading(true);
    deleteProduct({ variables: { id: id } })
      .then(async (dataLineCart) => {
        const { data } = dataLineCart;
        const { deleteProductFromCart } = data;
        setCart((oldState) => {
          if (oldState) {
            const newState = JSON.parse(JSON.stringify(oldState));
            const index = newState?.line_cart.findIndex(
              (ele: any) => ele.id === deleteProductFromCart.id
            );
            if (index > -1) {
              newState.line_cart = newState.line_cart.filter(
                (ele: ILineCart) => ele.id !== deleteProductFromCart.id
              );
            }
            return newState;
          }
          return;
        });
        try {
          const { data } = await fetchMore({ query: GET_TOTAL_OF_CART });
          const { getTotalOfCart } = data;
          setTotalOfCart(getTotalOfCart.total);
        } catch (error) {
          toast({
            duration: 2500,
            position: "top",
            render: () => updateLineCartError(),
          });
        }
        setLoadingUpdateProduct(false);
        setLoading(false);
      })
      .catch((error) => {
        toast({
          duration: 2500,
          position: "top",
          render: () => deleteLineCartError(),
        });
        setLoadingUpdateProduct(false);
        setLoading(false);
      });
  };

  const getCartError = () => (
    <>
      <Alert status="error" variant="solid">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Ups!</AlertTitle>
          <AlertDescription display="block">
            Se produjo un error al recuperar el carrito.
          </AlertDescription>
        </Box>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    </>
  );

  const updateLineCartError = () => (
    <>
      <Alert status="error" variant="solid">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Ups!</AlertTitle>
          <AlertDescription display="block">
            Se produjo un error al actualizar la cantidad del producto.
          </AlertDescription>
        </Box>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    </>
  );

  const deleteLineCartError = () => (
    <>
      <Alert status="error" variant="solid">
        <AlertIcon />
        <Box flex="1">
          <AlertTitle>Ups!</AlertTitle>
          <AlertDescription display="block">
            Se produjo un error al eliminar el producto del carrito.
          </AlertDescription>
        </Box>
        <CloseButton position="absolute" right="8px" top="8px" />
      </Alert>
    </>
  );

  const onCloseWithCleanState = () => {
    setLineCartToDelete(undefined);
    onClose();
  };

  return (
    <>
      {loading ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <Flex
          shadow={"inner"}
          direction={"column"}
          p={4}
          borderRadius="lg"
          borderColor={colorMode === "light" ? "gray.200" : "gray.700"}
          borderWidth={"1px"}
          h="80vh"
          boxShadow={"inner"}
        >
          <VStack
            spacing={"5px"}
            direction={"row"}
            overflowY="auto"
            className="container-line-cart"
            p={2}
          >
            {cart?.line_cart.length ? (
              <>
                {cart?.line_cart?.map((line_cart) => (
                  <>
                    <Box
                      p={4}
                      display={"flex"}
                      flexDirection={{ base: "column", sm: "row" }}
                      alignItems={"center"}
                      minH={"300px"}
                      w="100%"
                      borderColor={
                        colorMode === "light" ? "gray.800" : "gray.100"
                      }
                      justifyContent="space-between"
                      h="auto"
                    >
                      <Flex
                        justifyContent={"center"}
                        direction={{ base: "column", sm: "row" }}
                        alignItems="center"
                      >
                        {line_cart.product.url_image ? (
                          <Avatar
                            src={line_cart.product.url_image}
                            size="lg"
                            mb={{ base: "15px", sm: "0" }}
                            mr={{ base: "0", sm: "15px" }}
                          />
                        ) : null}
                        <NumberInput
                          isDisabled={loadingUpdateProduct}
                          onChange={(valueAsNumber) => {
                            updateLineCart(
                              line_cart.product.id,
                              Number(valueAsNumber)
                            );
                          }}
                          min={1}
                          max={line_cart.product.stock}
                          mr={{ base: 0, sm: 5 }}
                          maxW={"100px"}
                          defaultValue={line_cart.quantity}
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        {loadingUpdateProduct ? <Spinner size={"sm"} /> : null}
                        <Text my={5} fontWeight={"bold"}>
                          {line_cart.product.name}
                        </Text>
                      </Flex>
                      <Box
                        display={"flex"}
                        alignItems="center"
                        justifyContent={"center"}
                        flexDirection={{ base: "column", sm: "row" }}
                      >
                        <Text
                          mb={{ base: "5px", sm: "0px" }}
                          mr={{ base: "0px", sm: "10px" }}
                          fontWeight={"bold"}
                        >
                          {" "}
                          ${line_cart.total}
                        </Text>
                        <IconButton
                          w={{ base: 100, sm: "auto" }}
                          icon={<DeleteIcon />}
                          aria-label="Eliminar el producto del carrito."
                          onClick={() => {
                            setLineCartToDelete(line_cart.id);
                            onOpen();
                          }}
                          isLoading={loadingUpdateProduct}
                        />
                      </Box>
                    </Box>
                    <Divider />
                  </>
                ))}
              </>
            ) : (
              <>
                <p>
                  <Tag>NO TIENES PRODUCTOS EN EL CARRITO &#128532;</Tag>
                </p>
                <Link className="link-without-underline" href="/">
                  <Button>Ir a ver productos</Button>
                </Link>
              </>
            )}
          </VStack>
        </Flex>
      )}
      {cart?.line_cart?.length && !loading ? (
        <Box
          w="100%"
          display={"flex"}
          alignItems="center"
          justifyContent={"center"}
          flexDirection={{ base: "column", sm: "row" }}
          mt="10px"
          ml={"auto"}
        >
          <Box
            w={{ base: "100%", sm: "auto" }}
            mb={{ base: "5px", sm: "0px" }}
            ml={{ base: "0px", sm: "auto" }}
          >
            <Badge
              w={{ base: "100%", sm: "auto" }}
              textAlign="center"
              p={2}
              variant="outline"
              colorScheme={"green"}
              fontSize={"lg"}
              mr={2}
            >
              Total: $ {totalOfCart}
            </Badge>
          </Box>
          <Box
            w={{ base: "100%", sm: "auto" }}
            ml={{ base: "0px", sm: "auto" }}
          >
            <Button
              w={{ base: "100%", sm: "auto" }}
              onClick={() => navigate("/pay")}
            >
              Comprar
            </Button>
          </Box>
        </Box>
      ) : null}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          onCloseWithCleanState();
        }}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Eliminar producto
            </AlertDialogHeader>

            <AlertDialogBody>
              ¿Seguro que desea eliminar el producto del carrito?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => {
                  onCloseWithCleanState();
                }}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (lineCartToDelete) {
                    deleteLineCart(lineCartToDelete);
                  }
                  onCloseWithCleanState();
                }}
                ml={3}
              >
                Eliminar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
