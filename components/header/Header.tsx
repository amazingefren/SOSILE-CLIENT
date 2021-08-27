import { DocumentNode, gql, useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { User } from "../../graphql/user/user.model";
import HeaderStyle from "./header.module.scss";

const SEARCH_QUERY = gql`
  query searchInput($username: String!) {
    userSearch(where: $username) {
      id
      username
    }
  }
`;

const SearchResult = ({ user }: { user: User }) => {
  // useEffect(()=>{
  //   console.log(user.username)
  // })
  return (
    <div className={HeaderStyle.searchBarResultItem}>
      <div>{user?.username}</div>
    </div>
  );
};

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [typing, setTyping] = useState(false);
  const [findUser, { data }] = useLazyQuery(SEARCH_QUERY, {
    onCompleted: (d) => {
      console.log(d.userSearch);
    },
  });

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setTyping(true);
    setSearchInput(e.target.value);
  };

  // useEffect(() => {
  //   window.addEventListener("click", (e: any) => {
  //     if (document) {
  //       if (document.getElementById("searchBarId")?.contains(e.target)) {
  //         setSearchActive(true);
  //       } else {
  //         setSearchActive(false);
  //       }
  //     }
  //   });
  // });

  useEffect(() => {
    let timer = setTimeout(() => setTyping(false), 350);
    if (!typing) {
      if (searchInput != "") {
        findUser({ variables: { username: searchInput } });
      }
    }
    return () => clearTimeout(timer);
  }, [searchInput, typing]);
  return (
    <header id={HeaderStyle.container}>
      <div id={HeaderStyle.sosile}>
        <div id={HeaderStyle.logo} />
        <div id={HeaderStyle.name}>SOSILE</div>
      </div>
      {/*@TODO GLOBAL STATE MANAGEMENT*/}
      <div id={HeaderStyle.right}>
        <div
          className={
            searchActive
              ? HeaderStyle.searchBar + " " + HeaderStyle.searchBarActive
              : HeaderStyle.searchBar
          }
          id="searchBarId"
        >
          <input
            id={HeaderStyle.searchBarInput}
            placeholder="search"
            value={searchInput}
            onChange={handleSearchInput}
            onFocus={() => setSearchActive(true)}
            onBlur={() => setSearchActive(false)}
          />
          {searchActive && (
            <div id={HeaderStyle.searchBarResult}>
              {data?.userSearch &&
                data?.userSearch.map((user: User) => {
                  return <SearchResult key={user.id} user={user} />;
                })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
