// UserFlights.jsx
import styles from './UserFlights.module.css';

const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount / (currency === 'INR' ? 1 : 1)); // keep raw amount as provided; your amount is already integer INR paise? If so, divide by 100.
  } catch {
    return `${currency} ${amount?.toLocaleString?.() ?? amount}`;
  }
};

const UserFlights = ({ flights }) => {
  return (
    <div className={styles.userFlightsContainer}>
      <h3 className={styles.userFlightsTitle}>✈ Flight History</h3>
      {flights && flights.length > 0 ? (
        <div className={styles.flightGrid}>
          {flights.map((f) => (
            <div key={f.id} className={styles.flightCard}>
              <div className={styles.flightCardHeader}>
                <span className={styles.flightNumber}>{f.carrier}{f.flightNumber ? ` ${f.flightNumber}` : ''}</span>
                <span className={styles.flightPrice}>
                  {formatCurrency(
                    // If PaymentOrder.amount is in INR paise, divide by 100; else pass as-is.
                    f.currency === 'INR' ? Math.round((f.price || 0) / 100) : f.price || Math.round((f.totalFare || 0) * 100) / 100,
                    f.currency || 'INR',
                    f.currency === 'EUR' ? 'de-DE' : 'en-IN'
                  )}
                </span>
              </div>
              <div className={styles.flightCardBody}>
                <div className={styles.flightFrom}>
                  <p className={styles.city}>{f.from}</p>
                  <p className={styles.time}>{new Date(f.departureTime).toLocaleString()}</p>
                </div>
                <div className={styles.flightArrow}>➡️</div>
                <div className={styles.flightTo}>
                  <p className={styles.city}>{f.to}</p>
                  <p className={styles.time}>{new Date(f.arrivalTime).toLocaleString()}</p>
                </div>
              </div>
              <div className={styles.flightCardFooter}>
                Booking ID: <span className={styles.bookingId}>{String(f.id).slice(0, 8)}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.noFlights}>No flights found.</p>
      )}
    </div>
  );
};

export default UserFlights;
