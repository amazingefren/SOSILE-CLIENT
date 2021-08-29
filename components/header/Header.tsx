import { gql, useLazyQuery } from "@apollo/client";
import router from "next/router";
import { useEffect, useRef, useState } from "react";
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
  return (
    <div
      className={HeaderStyle.searchBarResultItem}
      onClick={() => {
        router.push("/user/" + user.username);
      }}
    >
      <div>{user?.username}</div>
    </div>
  );
};

const Header = () => {
  const searchRef = useRef(null);
  const resultRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  const [typing, setTyping] = useState(false);
  const [findUser, { data: { userSearch: searchResult = null } = {} }] =
    useLazyQuery(SEARCH_QUERY);

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setTyping(true);
    setSearchInput(e.target.value);
  };
  const handleSearchClick = (event: any) => {
    if (
      searchRef.current &&
      resultRef.current &&
      searchRef.current != event.target &&
      resultRef.current != event.target
    ) {
      setSearchActive(false);
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => setTyping(false), 350);
    if (!typing) {
      if (searchInput != "") {
        findUser({ variables: { username: searchInput } });
      }
    }
    return () => clearTimeout(timer);
  }, [searchInput, typing, findUser]);

  useEffect(() => {
    document.addEventListener("click", handleSearchClick, false);
    return () => {
      document.removeEventListener("click", handleSearchClick, false);
    };
  }, []);

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
            ref={searchRef}
          />
          {searchActive && (
            <div id={HeaderStyle.searchBarResult} ref={resultRef}>
              {searchResult &&
                searchResult.map((user: User) => {
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
