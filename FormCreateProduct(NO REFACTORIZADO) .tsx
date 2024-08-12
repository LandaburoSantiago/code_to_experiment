import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Center,
  CloseButton,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Spinner,
  Switch,
  Text,
  useToast,
  Link,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { COLLECTIONS } from "../../../services/graphql/query/Collection";
import { ICollection } from "../../../services/graphql/Collection";
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  LINK_IMAGE_WITH_PRODUCT,
} from "../../../services/graphql/mutation/Product";
import { Upload } from "antd";
import { storage } from "../../../firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytes,
} from "firebase/storage";
import { FaUpload } from "react-icons/fa";
import { useUnauthorizedAction } from "../../../services/hooks/useUnauthorizedAction";
import { MessageError } from "../../../shared/MessageError";
import { MessageSuccess } from "../../../shared/MessageSuccess";
import { IProductAdmin } from "../../../services/graphql/Product";
import moment from "moment";

interface IFormCreateProduct {
  editMode?: boolean;
  productToUpdate?: IProductAdmin;
  onSuccess?: () => void;
  onError?: () => void;
}
export const FormCreateProduct = (props: IFormCreateProduct) => {
  const { onSuccess, onError, editMode, productToUpdate } = props;
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(true);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [linkImageWithProduct] = useMutation(LINK_IMAGE_WITH_PRODUCT);
  const [file, setFile] = useState<any>();
  const { action } = useUnauthorizedAction();
  const toast = useToast();
  const unauthorized = useCallback(() => {
    action();
  }, []);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();
  useQuery(COLLECTIONS, {
    onCompleted: (data) => {
      const { collections } = data;
      setCollections(collections);
      setLoadingCollections(false);
    },
    onError: (error) => {
      setLoadingCollections(false);
      toast({
        duration: 2500,
        position: "top",
        render: () =>
          MessageError(
            error.message
              ? error.message
              : "Error al recuperar las colecciones."
          ),
      });
    },
  });
  async function onSubmitCreate(values: any) {
    setLoadingForm(true);
    let refImage = "";
    let urlImage = "";
    if (file) {
      refImage = `${moment(new Date()).format("DD-MM-YYYY HH:mm:ss")}-product`;
      const storageRef = ref(storage, refImage);
      await uploadBytes(storageRef, file as Blob).catch((error) => {
        console.log(error);
      });
      await getDownloadURL(ref(storageRef))
        .then((url) => {
          urlImage = url;
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (values.catalog_number) {
      values.catalog_number = Number(values.catalog_number);
    } else {
      delete values.catalog_number;
    }
    if (values.price) {
      values.price = Number(values.price);
    } else {
      delete values.price;
    }
    if (values.stock) {
      values.stock = Number(values.stock);
    } else {
      delete values.stock;
    }
    if (values.collection_id) {
      values.collection_id = Number(values.collection_id);
    } else {
      delete values.collection_id;
    }

    await createProduct({
      variables: {
        input: { ...values },
      },
    })
      .then(async (dataProduct) => {
        const { data } = dataProduct;
        const { createProduct } = data;
        if (refImage && urlImage) {
          await linkImageWithProduct({
            variables: {
              input: {
                id: createProduct.id,
                url_image: urlImage,
                ref_image: refImage,
              },
            },
          }).catch((error) => {
            toast({
              duration: 2500,
              position: "top",
              render: () =>
                MessageError(
                  error.message
                    ? error.message
                    : "Ocurrió un error al cargar la imagen."
                ),
            });
            if (onError) onError();
          });
        }
        toast({
          duration: 2500,
          position: "bottom",
          render: () =>
            MessageSuccess({
              title: "Bien hecho!",
              description: "Tu producto se registró exitosamente!.",
            }),
        });
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        if (error.message !== "Unauthorized") {
          toast({
            duration: 2500,
            position: "top",
            render: () =>
              MessageError(
                error.message
                  ? error.message
                  : "Ocurrió un error al registrar su producto. Por favor intente nuevamente."
              ),
          });
          if (onError) {
            console.log("asdasd");
            onError();
          }
        } else {
          unauthorized();
        }
      })
      .finally(() => {
        setLoadingForm(false);
      });
  }

  async function onSubmitUpdate(values: any) {
    if (!productToUpdate || !productToUpdate?.id) {
      toast({
        duration: 2500,
        position: "top",
        render: () =>
          MessageError(
            "No pudimos encontrar el producto para poder acutalizarlo."
          ),
      });
      if (onError) {
        onError();
      }
      return;
    }
    setLoadingForm(true);
    let refImage = "";
    let urlImage = "";
    let oldStorageRef: StorageReference;
    if (file) {
      if (productToUpdate.ref_image) {
        oldStorageRef = ref(storage, productToUpdate.ref_image);
      }
      refImage = `${moment(new Date()).format("DD-MM-YYYY HH:mm:ss")}-product`;
      const storageRef = ref(storage, refImage);
      await uploadBytes(storageRef, file as Blob).catch((error) => {
        console.log(error);
      });
      await getDownloadURL(ref(storageRef))
        .then((url) => {
          urlImage = url;
        })
        .catch((error) => {
          console.log(error);
        });
    }
    if (values.catalog_number) {
      values.catalog_number = Number(values.catalog_number);
    } else {
      delete values.catalog_number;
    }
    if (values.price) {
      values.price = Number(values.price);
    } else {
      delete values.price;
    }
    if (values.stock) {
      values.stock = Number(values.stock);
    } else {
      delete values.stock;
    }
    if (values.collection_id) {
      values.collection_id = Number(values.collection_id);
    } else {
      delete values.collection_id;
    }

    setLoadingForm(true);
    await updateProduct({
      variables: {
        input: { id: productToUpdate.id, ...values },
      },
    })
      .then(async (dataProduct) => {
        const { data } = dataProduct;
        const { updateProduct } = data;
        if (refImage && urlImage) {
          await linkImageWithProduct({
            variables: {
              input: {
                id: updateProduct.id,
                url_image: urlImage,
                ref_image: refImage,
              },
            },
          })
            .then(async () => {
              if (oldStorageRef) {
                await deleteObject(oldStorageRef).catch((error) => {
                  console.log(error);
                });
              }
            })
            .catch((error) => {
              toast({
                duration: 2500,
                position: "top",
                render: () =>
                  MessageError(
                    error.message
                      ? error.message
                      : "Ocurrió un error al cargar la imagen."
                  ),
              });
              if (onError) onError();
            });
        }
        toast({
          duration: 2500,
          position: "bottom",
          render: () =>
            MessageSuccess({
              title: "Bien hecho!",
              description: "Tu producto se actualizó exitosamente!.",
            }),
        });
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((error) => {
        if (error.message !== "Unauthorized") {
          toast({
            duration: 2500,
            position: "top",
            render: () =>
              MessageError(
                error.message
                  ? error.message
                  : "Ocurrió un error al actualizar su producto. Por favor intente nuevamente."
              ),
          });
          if (onError) {
            onError();
          }
        } else {
          unauthorized();
        }
      })
      .finally(() => {
        setLoadingForm(false);
      });
  }

  return (
    <>
      {editMode && loadingCollections ? (
        <Center>
          <Spinner />
        </Center>
      ) : (
        <>
          <Flex
            alignItems={{ base: "flex-start", sm: "center" }}
            direction={{ base: "column", sm: "row" }}
            mb={2}
          >
            <CloseButton
              ml={"auto"}
              display={{ base: "block", sm: "none" }}
              onClick={() => {
                if (onSuccess) {
                  onSuccess();
                }
              }}
            />
            <Heading mb={0} as={"h4"}>
              {!editMode ? "Agregar producto" : "Actualizar producto"}
            </Heading>
            <CloseButton
              ml={"auto"}
              display={{ base: "none", sm: "block" }}
              onClick={() => {
                if (onSuccess) {
                  onSuccess();
                }
              }}
            />
          </Flex>
          <form
            autoComplete="off"
            onSubmit={handleSubmit(!editMode ? onSubmitCreate : onSubmitUpdate)}
          >
            <FormControl isInvalid={errors.catalog_number}>
              <FormLabel>Número de catálogo</FormLabel>
              <NumberInput defaultValue={productToUpdate?.catalog_number}>
                <NumberInputField
                  placeholder="Ingrese número catálogo..."
                  id="catalog_number"
                  {...register("catalog_number", {
                    required: "Debe especificar un número de catálogo",
                  })}
                />
              </NumberInput>
              <FormErrorMessage>
                {errors.catalog_number && errors.catalog_number.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.name}>
              <FormLabel>Nombre del producto</FormLabel>
              <Input
                defaultValue={productToUpdate?.name}
                maxLength={30}
                placeholder="Ingrese nombre..."
                id="name"
                {...register("name", {
                  required: "Debe ingresar un nombre",
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.description}>
              <FormLabel>Descripción</FormLabel>
              <Input
                defaultValue={productToUpdate?.description}
                maxLength={30}
                placeholder="Ingrese descripción..."
                id="description"
                {...register("description", {
                  required: "Debe ingresar una descripción",
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.price}>
              <FormLabel>Precio</FormLabel>
              <NumberInput defaultValue={productToUpdate?.price}>
                <NumberInputField
                  placeholder="Ingrese precio..."
                  id="price"
                  {...register("price", {
                    required: "Debe especificarle el precio",
                  })}
                />
              </NumberInput>
              <FormErrorMessage>
                {errors.price && errors.price.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.stock}>
              <FormLabel>Stock</FormLabel>
              <NumberInput defaultValue={productToUpdate?.stock}>
                <NumberInputField
                  placeholder="Ingrese stock..."
                  id="stock"
                  {...register("stock", {
                    required: "Debe especificarle el stock",
                  })}
                />
              </NumberInput>
              <FormErrorMessage>
                {errors.stock && errors.stock.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.shine}>
              <FormLabel>Brilla</FormLabel>
              <Switch
                defaultChecked={productToUpdate?.shine}
                size="md"
                id="shine"
                {...register("shine")}
              />
              <FormErrorMessage>
                {errors.shine && errors.shine.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.collection_id}>
              <FormLabel>Collección</FormLabel>
              <Select
                defaultValue={
                  productToUpdate?.collection_id
                    ? productToUpdate.collection_id.toString()
                    : undefined
                }
                variant={"filled"}
                placeholder="Seleccione colección"
                id="collection_id"
                {...register("collection_id")}
              >
                {collections.map((location) => (
                  <option value={location.id}>{location.name}</option>
                ))}
              </Select>
              <FormErrorMessage>
                {errors.collection_id && errors.collection_id.message}
              </FormErrorMessage>
            </FormControl>
            <Text>
              Si tu colección no existe creala{" "}
              <Link
                href="/administration/adminCollections"
                textDecoration={"underline"}
              >
                aqui
              </Link>
            </Text>

            <Upload
              customRequest={async (uploadRequestOptions) => {
                const { onSuccess, onError, file } = uploadRequestOptions;
                setFile(file);
                if (onSuccess) onSuccess("asd");
              }}
            >
              <Button style={{ marginTop: "15px" }} leftIcon={<FaUpload />}>
                Click para cargar imagen
              </Button>
            </Upload>
            <Button
              isLoading={loadingForm || loadingCollections}
              type="submit"
              w={"100%"}
              mt={4}
            >
              {!editMode ? "Agregar" : "Guardar"}
            </Button>
          </form>
        </>
      )}
    </>
  );
};
