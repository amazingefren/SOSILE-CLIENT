import HeaderStyle from "./header.module.scss";
const Header = () => {
  return (
    <header id={HeaderStyle.container}>
      <div id={HeaderStyle.sosile}>
        <div id={HeaderStyle.logo} />
        <div id={HeaderStyle.name}>SOSILE</div>
      </div>
      {/*@TODO GLOBAL STATE MANAGEMENT*/}
      <div id={HeaderStyle.search}>
          <div id={HeaderStyle.searchBar}>
            <input id={HeaderStyle.searchBarInput} placeholder="search"/>
        </div>
      </div>
    </header>
  );
}

export default Header
