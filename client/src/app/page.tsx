import { redirect } from "next/navigation";

const page = () => {
  redirect("/home");

  return <></>;
};

export default page;
