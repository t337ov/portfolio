import { LanguageTransitionDemo } from "./transition-demo";
import styles from "./transition-demo.module.css";

export default function AnimationLabPage() {
  return <main className={styles.lab}>
    <header className={styles.topbar}>
      <a href="/" className={styles.backLink}>← Back to portfolio</a>
      <span className={styles.prototypeLabel}>MOTION STUDY&nbsp; / &nbsp;01</span>
    </header>
    <LanguageTransitionDemo />
  </main>;
}
