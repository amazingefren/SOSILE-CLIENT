import { useRouter } from "next/router";
// import Link from 'next/link'
import Layout from "../../../components/layout/Layout";
import cachedUser from "../../../hooks/getUser";
import { protect } from "../../../hooks/protected";

const UserProfile = () => {
  const router = useRouter();
  const { username } = router.query;
  protect({
    to: "/",
  });
  const { user } = cachedUser() as any;

  return (
    <Layout title={user ? user.username + "@" + username : ""}>
      {user && username ? <div id={"hi"}>Hey I'm {username}</div> : <div></div>}
    </Layout>
  );
};

export default UserProfile;
