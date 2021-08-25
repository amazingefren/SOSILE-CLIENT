import { useRouter } from "next/router";
// import Link from 'next/link'
import Layout from "../../../components/layout/Layout";
import cachedUser from "../../../hooks/getUser";
import { protect } from "../../../hooks/protected";

const UserLikes = () => {
  const router = useRouter();
  const { username } = router.query;
  protect({
    to: "/",
  });
  const { user } = cachedUser() as any;

  return (
    <Layout title={user ? user.username + "@" + username : ""}>
      {user && username ? <div id={"hi"}>{username} Likes</div> : <div></div>}
    </Layout>
  );
};

export default UserLikes;
