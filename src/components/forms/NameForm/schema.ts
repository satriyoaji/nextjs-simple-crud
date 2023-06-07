import { setupYup } from "@/config/yup";

const Yup = setupYup();

const schema = Yup.object({
  title: Yup.string().required(),
});

export default schema;
