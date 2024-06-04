import styles from "./styles.module.css";

export default function App() {
  return (
    <div className={styles.index}>
      <h1 className={styles.heading}>A payment customization v.1.0</h1>
      <ul>
        <li>
          <strong>Product feature</strong>. This app allows to hide payment
          methods, depending on custom meta field value in products.
        </li>
      </ul>
    </div>
  );
}
