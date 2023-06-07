import NotesTable from "@/components/tables/UsersTable";
import PrivatePage from "@/layouts/PrivatePage";
import { Container } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

const Notes: NextPageWithLayout = () => {
  return (
    <Container maxWidth="1400px" m="auto" py={10}>
      <NotesTable />
    </Container>
  );
};

Notes.getLayout = function getLayout(page: ReactElement) {
  return <PrivatePage title="Notes">{page}</PrivatePage>;
};

export default Notes;
