import HeaderStyle from "./header.module.scss"
export default function () {
  return (
    <header id={HeaderStyle.container}>
      <div id={HeaderStyle.sosile}>
        <div id={HeaderStyle.logo}/>
        <div id={HeaderStyle.name}>SOSILE</div>
      </div>
    </header>
  );
}
