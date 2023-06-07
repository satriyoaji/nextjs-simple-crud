import { setupYup } from "@/config/yup";

const Yup = setupYup();

const schema = Yup.object({
  email: Yup.string().description().required(),
  password: Yup.string().required(),
});

export default schema;
