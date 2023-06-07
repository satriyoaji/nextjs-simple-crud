import DataTable from "@/components/DataTable";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "@/services/api";
import { useCallback, useMemo, useState } from "react";
import { HStack, IconButton, useBoolean } from "@chakra-ui/react";
import { MdArrowRightAlt, MdDelete } from "react-icons/md";
import { UserResponse } from "@/typings/user";
import { toast } from "react-toastify";
import Link from "next/link";
import NameForm from "@/components/forms/NameForm";
import { format, parseISO } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import ModalFullscreen from "@/components/ModalFullscreen";
import UsersFilterForm from "@/components/forms/UsersFilterForm";
import { SubmitHandler } from "react-hook-form";
import { FormValues } from "@/components/forms/UsersFilterForm/UsersFilterForm";
import InlineEdit from "@/components/InlineEdit";

function NotesTable() {
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCell, setCurrentCell] = useState(null);
  const [currentText, setCurrentText] = useState("");
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [isFilterOpen, { on, off }] = useBoolean();
  const [applitedFilters, setApplitedFilters] = useState({});
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading: isLoadingDeletion } = useMutation(() =>
    api.delete(`/notes/${idToDelete}`)
  );

  const {
    data: notes,
    isLoading,
    error,
  } = useQuery(["note", page, searchTerm, applitedFilters], () =>
    api
      .get("notes/paged", {
        params: {
          q: searchTerm,
          page,
          size: perPage,
          order: "created_at",
          status: true,
          ...applitedFilters,
        },
      })
      .then((response) => response.data)
  );

  const onEscapeKeypress = useCallback(() => {
    setCurrentCell(null);
    setCurrentText("");
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Title",
        accessor: "title",
        // Cell: (data: any) => (
        //   <InlineEdit
        //     isEditing={currentCell === data.cell.row.original.id}
        //     onClickEdit={() => {
        //       setCurrentCell(data.cell.row.original.id);
        //       setCurrentText(data.value);
        //     }}
        //     value={data.value}
        //     FormComponent={
        //       <NameForm
        //         onSubmit={(values) => {
        //           api
        //             .put(`notes/${currentCell}`, {
        //               title: values.title,
        //             })
        //             .catch(() => {
        //               toast.error("Couldn't edit note, try again later");
        //             });
        //           queryClient.setQueryData(
        //             ["note", page, searchTerm, applitedFilters],
        //             (old: Partial<UserResponse> | undefined) => {
        //               return {
        //                 ...old,
        //                 data: old?.data?.map((data) =>
        //                   data.id === currentCell
        //                     ? { ...data, title: values.title }
        //                     : data
        //                 ),
        //               };
        //             }
        //           );
        //           setCurrentCell(null);
        //           setCurrentText("");
        //         }}
        //         defaultValues={{ title: currentText }}
        //         onEscapeKeypress={onEscapeKeypress}
        //       />
        //     }
        //   />
        // ),
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Created at",
        accessor: (row: { created_at: string }) =>
          format(parseISO(row.created_at), "Pp"),
        id: "created_at",
      },
      {
        Header: "Actions",
        Cell: (data: any) => (
          <HStack>
            <Link href={`/notes/${data.cell.row.original.id}`} passHref>
              <IconButton
                aria-label={"Edit note"}
                icon={<MdArrowRightAlt size={22} />}
              />
            </Link>
            <IconButton
              aria-label={"Edit note"}
              onClick={() => {
                setIdToDelete(data.cell.row.original.id);
              }}
              icon={<MdDelete size={22} />}
            />
          </HStack>
        ),
      },
    ],
    [
      applitedFilters,
      currentCell,
      currentText,
      onEscapeKeypress,
      page,
      queryClient,
      searchTerm,
    ]
  );

  const onSearchDebounced = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  const onConfirmDeletion = async () => {
    await mutateAsync();
    queryClient.invalidateQueries(["note", page, searchTerm]);
    setIdToDelete(null);
    toast.success("User deleted successfully!");
  };

  const onSubmitFilters: SubmitHandler<FormValues> = (values) => {
    setPage(1);
    setApplitedFilters(values);
    off();
  };

  const onClearFilters = () => {
    setPage(1);
    setApplitedFilters({});
    off();
  };

  if (error) {
    return (
      <div>
        An error has ocurred: "{(error as { message: string }).message}"
      </div>
    );
  }

  return (
    <>
      <ModalFullscreen title="Filters" isOpen={isFilterOpen} onClose={off}>
        <UsersFilterForm
          onClearFilters={onClearFilters}
          onSubmit={onSubmitFilters}
          defaultValues={applitedFilters}
        />
      </ModalFullscreen>
      <ConfirmDialog
        isOpen={!!idToDelete}
        onConfirm={onConfirmDeletion}
        onClose={() => setIdToDelete(null)}
        isLoading={isLoadingDeletion}
      />
      <DataTable
        columns={columns}
        data={notes?.data}
        pagination={notes?.pagination}
        page={page}
        onChangePage={setPage}
        perPage={perPage}
        isLoading={isLoading}
        onSearchDebounced={onSearchDebounced}
        inputPlaceholder="Search by title, description..."
        onClickFilter={on}
      />
    </>
  );
}

export default NotesTable;
