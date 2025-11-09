// FareSummary.jsx
import styles from './FareSummary.module.css';

const FareSummary = ({ flight, discount = 0 }) => {
  const fare = flight?.fareSelection;

  if (!fare) {
    return (
      <aside className={styles.container}>
        <h2 className={styles.heading}>Fare Summary</h2>
        <p>No fare data available.</p>
      </aside>
    );
  }

  // Currency formatting
  const nf = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });

  // Extract prices
  const totalINR = Math.round(Number(fare.totalPriceINR || 0));
  const outboundINR = Math.round(Number(fare.outbound?.priceINR || 0));
  const inboundINR = Math.round(Number(fare.inbound?.priceINR || 0));

  // Simple tax assumption (for UI display)
  const taxes = Math.round(totalINR * 0.18);
  const base = Math.max(totalINR - taxes, 0);
  const grand = Math.max(totalINR - discount, 0);

  return (
    <aside className={styles.container} role="region" aria-labelledby="fare-summary-title">
      <h2 id="fare-summary-title" className={styles.heading}>Fare Summary</h2>

      {/* Breakdown of routes */}
      <div className={styles.row}>
        <span className={styles.label}>Outbound ({fare.outbound?.cabinClass || 'N/A'})</span>
        <span className={styles.value}>{nf.format(outboundINR)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Inbound ({fare.inbound?.cabinClass || 'N/A'})</span>
        <span className={styles.value}>{nf.format(inboundINR)}</span>
      </div>

      <hr className={styles.hr} />

      <div className={styles.row}>
        <span className={styles.label}>Base Fare</span>
        <span className={styles.value}>{nf.format(base)}</span>
      </div>

      <div className={styles.row}>
        <span className={styles.label}>Taxes and Surcharges</span>
        <span className={styles.value}>{nf.format(taxes)}</span>
      </div>

      {discount > 0 && (
        <>
          <hr className={styles.hr} />
          <div className={`${styles.row} ${styles.discount}`}>
            <span className={styles.label}>Discounts</span>
            <span className={styles.value}>−{nf.format(discount)}</span>
          </div>
        </>
      )}

      <hr className={styles.hr} />

      <div className={`${styles.row} ${styles.total}`}>
        <span className={styles.totalLabel}>Total Amount</span>
        <span className={styles.totalValue}>{nf.format(grand)}</span>
      </div>

      <section className={styles.coupons} aria-labelledby="coupon-title">
        <h3 id="coupon-title" className={styles.couponHeading}>Coupons and Offers</h3>

        <div className={styles.inputRow}>
          <input
            type="text"
            placeholder="Enter coupon code"
            className={styles.input}
            aria-label="Enter coupon code"
          />
          <button type="button" className={styles.applyBtn}>Apply</button>
        </div>

        <button type="button" className={styles.viewAll}>VIEW ALL COUPONS</button>
      </section>
    </aside>
  );
};

export default FareSummary;
