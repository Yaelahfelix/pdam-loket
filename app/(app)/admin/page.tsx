import { redirect } from "next/navigation";

const Home = () => {
  return redirect("/admin");
};

export default Home;
