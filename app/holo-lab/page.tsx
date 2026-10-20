import { HoloCardDemo } from "./holo-card-demo";
import styles from "./holo-card-demo.module.css";

export default function HoloLabPage() {
  return <main className={styles.lab}>
    <header className={styles.topbar}>
      <a href="/ru" className={styles.backLink}>← Назад на сайт</a>
      <span className={styles.prototypeLabel}>MOTION STUDY&nbsp; / &nbsp;02</span>
    </header>
    <HoloCardDemo />
  </main>;
}
