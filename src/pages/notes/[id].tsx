import { GetServerSideProps } from "next";
import PrivatePage from "@/layouts/PrivatePage";
import { Container } from "@chakra-ui/react";
import React, { ReactElement, useRef } from "react";
import { NextPageWithLayout } from "../_app";
import api, { getAPIClient, httpErrorHandler } from "@/services/api";
import { NoteData } from "@/typings/note";
import NoteForm from "@/components/forms/NoteForm";
import { SubmitHandler } from "react-hook-form";
import { FormValues } from "@/components/forms/NoteForm";
import { toast } from "react-toastify";
import omit from "lodash.omit";
import { removeEmptyValues } from "@/utils/parse";
import { NoteFormRefType } from "@/components/forms/NoteForm/NoteForm";
import {useRouter} from "next/router";

type Props = {
  data: NoteData;
};

const NoteId: NextPageWithLayout<Props> = ({ data }) => {
  const router = useRouter();
  const formRef = useRef<NoteFormRefType>(null);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    removeEmptyValues(values);
    const apiValues = omit(values, ["id", "created_at", "confirmPassword"]);
    try {
      await api.put(`/notes/${values.id}`, apiValues);
      router.push("/notes");
    } catch (error) {
      httpErrorHandler(error, formRef.current?.setError);
    }
    toast.success("Data edited successfully!");
    (document.activeElement as HTMLElement).blur();
  };

  return (
    <Container maxW="1400px" m="auto" py={10}>
      <NoteForm ref={formRef} onSubmit={onSubmit} defaultValues={data} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.query.id;
  const api = getAPIClient(ctx);
  const { data } = await api.get(`notes/${id}`);

  return {
    props: data,
  };
};

NoteId.getLayout = (page: ReactElement) => {
  return <PrivatePage>{page}</PrivatePage>;
};

export default NoteId;
