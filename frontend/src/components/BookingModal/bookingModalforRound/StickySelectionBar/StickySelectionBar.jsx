import React from "react";
import styles from "./StickySelectionBar.module.css";

const LegChip = ({ title, data, onClear }) => (
  <div className={styles.legChip} aria-live="polite">
    <div className={styles.legTitle}>{title}</div>
    {data ? (
      <div className={styles.legBody}>
        <div className={styles.legSummary}>
          <div className={styles.legRoute}>{data.summary?.route || ""}</div>
          <div className={styles.legMeta}>{data.summary?.time || ""}</div>
        </div>
        <div className={styles.legPrice}>
          {data.currency} {data.price.toLocaleString()}
        </div>
        <button type="button" className={styles.clearBtn} onClick={onClear} aria-label={`Clear ${title}`}>
          Remove
        </button>
      </div>
    ) : (
      <div className={styles.placeholder}>Select a flight</div>
    )}
  </div>
);

const StickySelectionBar = ({
  tripType,
  outbound,
  inbound,
  total,
  currency,
  onClearOutbound,
  onClearInbound,
  onBook,
  canBook,
}) => {
  return (
    <div className={styles.stickyBar} role="region" aria-label="Selected flights summary" aria-live="polite">
      <div className={styles.barLeft}>
        <LegChip title="Departure" data={outbound} onClear={onClearOutbound} />
        {tripType === "roundTrip" && <LegChip title="Return" data={inbound} onClear={onClearInbound} />}
      </div>

      <div className={styles.barRight}>
        <div className={styles.totalWrap}>
          <div className={styles.totalLabel}>Total</div>
          <div className={styles.totalPrice}>
            {currency} {Number(total || 0).toLocaleString()}
          </div>
        </div>
        <button
          className={styles.bookBtn}
          type="button"
          onClick={onBook}
          disabled={!canBook}
          aria-disabled={!canBook}
        >
          Book Now
          <span className={styles.btnShine} />
        </button>
      </div>
    </div>
  );
};

export default StickySelectionBar;
