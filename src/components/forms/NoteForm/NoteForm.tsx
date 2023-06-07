import InputText from "@/components/inputs/InputText";
import { NoteData } from "@/typings/note";
import { Box, Button } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from "react";
import {
  SubmitHandler,
  useForm,
  UseFormSetError,
  UseFormSetValue,
} from "react-hook-form";
import schema from "./schema";

export type FormValues = NoteData;

type Props = {
  onSubmit: SubmitHandler<FormValues>;
  defaultValues: Partial<FormValues>;
};

export type NoteFormRefType = {
  setError: UseFormSetError<FormValues>;
  setValue: UseFormSetValue<FormValues>;
};

const NoteForm: ForwardRefRenderFunction<NoteFormRefType, Props> = (
  { onSubmit, defaultValues },
  ref
) => {
  const { handleSubmit, control, setError, setValue } = useForm({
    defaultValues: {
      id: "",
      created_at: "",
      title: "",
      description: "",
      ...defaultValues,
    },
    resolver: yupResolver(schema(defaultValues?.id)),
  });

  useImperativeHandle(ref, () => ({
    setError,
    setValue,
  }));

  return (
    <Box
      as="form"
      maxWidth="600px"
      m="auto"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <InputText label="Title" name="title" control={control} />
      <InputText label="Description" name="description" control={control} />
      <Button mt={8} type="submit" colorScheme="brand">
        Submit
      </Button>
    </Box>
  );
};

export default forwardRef(NoteForm);
