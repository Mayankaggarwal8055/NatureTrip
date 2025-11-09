// ProfileTravellers.jsx
import styles from './profileTravellers.module.css';

const formatMoney = (amount, currency = 'INR') => {
  const locale =
    currency === 'EUR' ? 'de-DE' :
    currency === 'USD' ? 'en-US' :
    'en-IN';
  try {
    return new Intl.NumberFormat(locale, { style: 'currency', currency })
      .format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
};

const displayBookingAmount = (b) => {
  // PaymentOrder.amount appears to be INR paise in your data model; for INR divide by 100.
  // For EUR, your booking.currency is 'EUR' and amount already looks decimal-sized; do not divide.
  if (!b) return '';
  const cur = b.currency || 'INR';
  if (cur === 'INR') {
    const inr = Math.round((b.amount || 0) / 100);
    return formatMoney(inr, 'INR');
  }
  // EUR: amount is already a proper decimal number (e.g., 383.62 or 1531.04).
  return formatMoney(b.amount || 0, cur);
};

const ProfileTravellers = ({ data }) => {
  const { travellers = [] } = data || {};

  return (
    <div className={styles.travellerPageContainer}>
      <h2 className={styles.pageTitle}>🧳 Traveller & Flight History</h2>

      {travellers.length > 0 ? (
        <div className={styles.travellersGrid || styles.flightsGrid}>
          {travellers.map((t) => (
            <div key={t.id} className={styles.travellerCard || styles.flightCard}>
              <div className={styles.travellerHeader}>
                <div className={styles.travellerName}>{t.firstName} {t.lastName}</div>
                <div className={styles.travellerMeta}>
                  <span className={styles.travellerStatus}>Status: {t.status}</span>
                  {t.ticketNumber ? <span className={styles.travellerTicket}>Ticket: {t.ticketNumber}</span> : null}
                  <span className={styles.travellerCreated}>Created: {new Date(t.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className={styles.bookingsSection}>
                <h4>Bookings</h4>
                {t.bookings && t.bookings.length > 0 ? (
                  <ul className={styles.bookingList}>
                    {t.bookings.map((b) => (
                      <li key={b.paymentId} className={styles.bookingItem}>
                        <div className={styles.bookingTop}>
                          <span className={styles.bookingStatus}>{b.status}</span>
                          <span className={styles.bookingAmount}>
                            {displayBookingAmount(b)}
                          </span>
                        </div>

                        {b.flight ? (
                          <div className={styles.flightSummary}>
                            <div className={styles.flightRoute}>
                              <span className={styles.city}>{b.flight.from}</span>
                              <span className={styles.arrow}>→</span>
                              <span className={styles.city}>{b.flight.to}</span>
                            </div>
                            <div className={styles.flightTimes}>
                              <span>Dep: {new Date(b.flight.departureTime).toLocaleString()}</span>
                              <span>Arr: {new Date(b.flight.arrivalTime).toLocaleString()}</span>
                              <span>Stops: {b.flight.stops}</span>
                            </div>
                            <div className={styles.flightMeta}>
                              <span>Carrier: {b.flight.carrier}</span>
                              <span>Flight: {b.flight.flightNumber}</span>
                              <span>Fare: {b.flight.currency} {b.flight.totalFare}</span>
                            </div>
                          </div>
                        ) : (
                          <div className={styles.flightSummary}>No flight details</div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No bookings for this traveller.</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No travellers found.</p>
      )}
    </div>
  );
};

export default ProfileTravellers;
