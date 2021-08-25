import { gql, useMutation, useQuery } from "@apollo/client";
import router from "next/dist/client/router";
import { useEffect, useState } from "react";
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

const Navbar = () => {
  const [isAuth, setIsAuth] = useState(true);
  const [logOff] = useMutation(LOGOUT, {
    onCompleted: (data) => {
      handleLogOff(data), setIsAuth(false);
    },
    onError: (e) => console.log(e),
    context: { headers: { Authorization: token } },
  });
  useEffect(() => {
    !isAuth && router.replace("/");
  }, [isAuth]);
  return (
    <div id={NavbarStyle.root}>
      <div id={NavbarStyle.center}>
        <div>link</div>
        <div>link</div>
        <div>link</div>
        <div>link</div>
        <div>link</div>
        <div>link</div>
        <div>link</div>
      </div>
      <div id={NavbarStyle.end}>
        <div
          id={NavbarStyle.logout}
          onClick={() => {
            logOff();
          }}
        >
          &
        </div>
      </div>
    </div>
  );
};

export default Navbar;
