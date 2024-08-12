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
  NumberInput,
  NumberInputField,
  Select,
  Spinner,
  Switch,
  Text,
  useToast,
  Link,
} from "@chakra-ui/react";
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
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import moment from "moment";

import { useUnauthorizedAction } from "../../../services/hooks/useUnauthorizedAction";
import { COLLECTIONS } from "../../../services/graphql/query/Collection";
import {
  CREATE_PRODUCT,
  UPDATE_PRODUCT,
  LINK_IMAGE_WITH_PRODUCT,
} from "../../../services/graphql/mutation/Product";
import { MessageError } from "../../../shared/MessageError";
import { MessageSuccess } from "../../../shared/MessageSuccess";
import { ICollection, IProductAdmin } from "../../../services/graphql/Collection";

interface IFormCreateProductProps {
  editMode?: boolean;
  productToUpdate?: IProductAdmin;
  onSuccess?: () => void;
  onError?: () => void;
}

const FormCreateProduct: React.FC<IFormCreateProductProps> = ({
  editMode,
  productToUpdate,
  onSuccess,
  onError,
}) => {
  const { handleSubmit, register, formState: { errors, isSubmitting } } = useForm();
  const toast = useToast();
  const { action } = useUnauthorizedAction();
  const [loadingForm, setLoadingForm] = useState<boolean>(false);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(true);
  const [collections, setCollections] = useState<ICollection[]>([]);
  const [file, setFile] = useState<any>();
  
  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [linkImageWithProduct] = useMutation(LINK_IMAGE_WITH_PRODUCT);

  const unauthorized = useCallback(() => {
    action();
  }, []);

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

  const onSubmit = async (values: any) => {
    setLoadingForm(true);
    let refImage = "";
    let urlImage = "";

    if (file) {
      refImage = `${moment(new Date()).format("DD-MM-YYYY HH:mm:ss")}-product`;
      const storageRef = ref(storage, refImage);

      try {
        await uploadBytes(storageRef, file);
        urlImage = await getDownloadURL(ref(storageRef));
      } catch (error) {
        console.log(error);
      }
    }

    try {
      const { data: { createProduct: { id: productId } } } = await createProduct({
        variables: { input: { ...values } },
      });

      if (refImage && urlImage) {
        await linkImageWithProduct({
          variables: { input: { id: productId, url_image: urlImage, ref_image: refImage } },
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

      if (onSuccess) onSuccess();
    } catch (error) {
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
        if (onError) onError();
      } else {
        unauthorized();
      }
    } finally {
      setLoadingForm(false);
    }
  };

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
                if (onSuccess) onSuccess();
              }}
            />
            <Heading mb={0} as={"h4"}>
              {!editMode ? "Agregar producto" : "Actualizar producto"}
            </Heading>
            <CloseButton
              ml={"auto"}
              display={{ base: "none", sm: "block" }}
              onClick={() => {
                if (onSuccess) onSuccess();
              }}
            />
          </Flex>
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
            {/* Añade aquí los otros campos del formulario */}
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

export default FormCreateProduct;
