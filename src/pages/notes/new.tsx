import PrivatePage from "@/layouts/PrivatePage";
import { Container } from "@chakra-ui/react";
import React, { ReactElement, useRef } from "react";
import { NextPageWithLayout } from "../_app";
import api, { httpErrorHandler } from "@/services/api";
import {CreatedRawNoteData, NoteData} from "@/typings/note";
import NoteForm from "@/components/forms/NoteForm";
import { SubmitHandler } from "react-hook-form";
import { FormValues } from "@/components/forms/NoteForm";
import { useRouter } from "next/router";
import omit from "lodash.omit";
import { NoteFormRefType } from "@/components/forms/NoteForm/NoteForm";
import { toast } from "react-toastify";

type Props = {
  data: NoteData;
};

type AxiosCreateNoteResponseData = {
  data: {
    note: CreatedRawNoteData;
  },
  status: string,
};

const NewNote: NextPageWithLayout<Props> = ({ data }) => {
  const router = useRouter();
  const formRef = useRef<NoteFormRefType>(null);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const apiValues = omit(values, ["confirmPassword", "id", "created_at"]);
    try {
      const { data } = await api.post<AxiosCreateNoteResponseData>("notes", apiValues);
      toast.success("Note created succesfully!");
      router.push(`/notes/${data.data.note.raw[data.data.note.raw.length - 1].id}`);
    } catch (error) {
      console.log("err: ", error)
      httpErrorHandler(error, formRef.current?.setError);
    }
  };

  return (
    <Container maxW="1400px" m="auto" py={10}>
      <NoteForm ref={formRef} onSubmit={onSubmit} defaultValues={data} />
    </Container>
  );
};

NewNote.getLayout = (page: ReactElement) => {
  return <PrivatePage>{page}</PrivatePage>;
};

export default NewNote;
