import { setupYup } from "@/config/yup";

const Yup = setupYup();

const schema = (id: string | undefined) =>
  Yup.object(
    id
      ? {
          title: Yup.string().required(),
          description: Yup.string().required(),
        }
      : {
          title: Yup.string().required(),
          description: Yup.string().required(),
        }
  );

export default schema;
