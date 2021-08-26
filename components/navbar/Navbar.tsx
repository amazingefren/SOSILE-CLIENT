import { gql, useMutation, useQuery } from "@apollo/client";
import router, { useRouter } from "next/dist/client/router";
import { useEffect, useState } from "react";
import { isAuthInVar } from "../../apollo.cache";
import NavbarStyle from "./navbar.module.scss";

const LOGOUT = gql`
  mutation LogOut {
    AuthLogout
  }
`;

const handleLogOff = async (data: any) => {
  console.log(data);
  if (data.AuthLogout) {
    console.log("LOGGING OUT");
    window.localStorage.removeItem("refresh_token");
  }
};
let token = "";
if (typeof window !== "undefined") {
  token = window.localStorage.getItem("refresh_token") || "";
}

const NavbarButton = ({ children, to }: { children: string; to: string }) => {
  const router = useRouter();
  const [route] = useState<string>(router.pathname);
  const [active, setActive] = useState<boolean>(false);
  const activeClass = NavbarStyle.navButton + " " + NavbarStyle.navButtonActive;
  useEffect(() => {
    if (to === route) {
      setActive(true);
    } else {
      setActive(false);
    }
  }, [active]);
  const handleRoute = () => {
    // router.replace(to)
  };
  return (
    <div
      className={active ? activeClass : NavbarStyle.navButton}
      onClick={handleRoute}
    >
      <div className={NavbarStyle.navButtonText}>{children}</div>
    </div>
  );
};

const Navbar = () => {
  const [logOff] = useMutation(LOGOUT, {
    onCompleted: (data) => {
      handleLogOff(data);
      isAuthInVar(false);
      router.replace("/");
    },
    onError: (e) => console.log(e),
    context: { headers: { Authorization: token } },
  });

  return (
    <div id={NavbarStyle.root}>
      <div id={NavbarStyle.center}>
        <NavbarButton to="/home">Home</NavbarButton>
        <NavbarButton to="/user">Profile</NavbarButton>
        <NavbarButton to="/tech">Technology</NavbarButton>
      </div>
      <div id={NavbarStyle.end}>
        <div
          id={NavbarStyle.logout}
          onClick={() => {
            logOff();
          }}
        >
          [O]
        </div>
      </div>
    </div>
  );
};

export default Navbar;
