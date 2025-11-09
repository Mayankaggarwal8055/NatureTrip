// components/paymentHistory/paymentHistory.jsx
import { useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import styles from './paymentHistory.module.css';

// Currency formatter with ₹ for INR
const money = (amt, cur = 'INR') => {
    if (cur === 'INR') return `₹${amt.toLocaleString('en-IN')}`;
    const locale = cur === 'EUR' ? 'de-DE' : cur === 'USD' ? 'en-US' : 'en-IN';
    try {
        return new Intl.NumberFormat(locale, { style: 'currency', currency: cur }).format(amt);
    } catch {
        return `${cur} ${amt}`;
    }
};

// Normalize statuses: created → pending
const normalizeStatus = (s = '') => {
    const st = s.toLowerCase();
    if (st === 'created' || st === 'authorized') return 'pending';
    return st;
};

const PaymentCard = ({ p, onDownload }) => {
    const cur = p.currency || 'INR';
    const amt = cur === 'INR' ? Math.round((p.amount || 0) / 100) : p.amount || 0;
    const st = normalizeStatus(p.status);

    return (
        <li className={styles.card}>
            <div className={styles.cardTop}>
                <span className={styles.amount}>{money(amt, cur)}</span>
                <span className={`${styles.badge} ${styles[st]}`}>{st}</span>
                <span className={styles.date}>{new Date(p.createdAt).toLocaleString()}</span>
            </div>

            {p.flight ? (
                <div className={styles.primaryRow}>
                    <div className={styles.route}>
                        <span className={styles.city}>{p.flight.from}</span>
                        <span className={styles.arrow}>→</span>
                        <span className={styles.city}>{p.flight.to}</span>
                    </div>
                    <div className={styles.metaLine}>
                        <span className={styles.meta}>{p.flight.carrier} {p.flight.flightNumber}</span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.meta}>Dep: {new Date(p.flight.departureTime).toLocaleString()}</span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.meta}>Arr: {new Date(p.flight.arrivalTime).toLocaleString()}</span>
                        <span className={styles.dot}>•</span>
                        <span className={styles.meta}>Stops: {p.flight.stops}</span>
                    </div>
                </div>
            ) : null}

            <div className={styles.travellerRow}>
                <span className={styles.traveller}>
                    Traveller: {p.traveller?.firstName} {p.traveller?.lastName}
                </span>
                {p.traveller?.ticketNumber ? (
                    <span className={styles.ticket}>Ticket: {p.traveller.ticketNumber}</span>
                ) : null}
            </div>

            <div className={styles.cardActions}>
                {p.receipt ? (
                    <button className={styles.linkBtn} onClick={() => onDownload(p)}>
                        Download receipt (PNG)
                    </button>
                ) : null}
            </div>
        </li>
    );
};

const PaymentHistory = ({ payments = [] }) => {
    const hiddenRef = useRef(null);

    // Show all payments, newest first
    const all = useMemo(() => {
        const cloned = [...payments];
        cloned.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return cloned;
    }, [payments]);

    const handleDownload = async (p) => {
        const mount = hiddenRef.current;
        if (!mount) return;

        mount.innerHTML = '';
        const host = document.createElement('div');
        host.className = styles.receiptCanvas;

        const cur = p.currency || 'INR';
        const amt = cur === 'INR' ? Math.round((p.amount || 0) / 100) : p.amount || 0;

        host.innerHTML = `
      <div class="${styles.receiptHeader}">
        <div class="${styles.brand}">FlightBooker</div>
        <div class="${styles.receiptTitle}">Payment Receipt</div>
      </div>
      <div class="${styles.receiptBody}">
        <div class="${styles.row}"><span>Ticket</span><strong>${p.traveller?.ticketNumber || '-'}</strong></div>
        <div class="${styles.row}"><span>Payment ID</span><strong>${String(p.paymentId).slice(0, 8)}</strong></div>
        <div class="${styles.row}"><span>Status</span><strong>${normalizeStatus(p.status)}</strong></div>
        <div class="${styles.row}"><span>Amount</span><strong>${money(amt, cur)}</strong></div>
        <div class="${styles.row}"><span>Date</span><strong>${new Date(p.createdAt).toLocaleString()}</strong></div>
        <div class="${styles.hr}"></div>
        <div class="${styles.row}"><span>Traveller</span><strong>${p.traveller?.firstName || ''} ${p.traveller?.lastName || ''}</strong></div>
        ${p.flight
                ? `
          <div class="${styles.hr}"></div>
          <div class="${styles.routeLine}">
            <div class="${styles.cityBig}">${p.flight.from}</div>
            <div class="${styles.routeArrow}">→</div>
            <div class="${styles.cityBig}">${p.flight.to}</div>
          </div>
          <div class="${styles.row}"><span>Carrier / Flight</span><strong>${p.flight.carrier} ${p.flight.flightNumber}</strong></div>
          <div class="${styles.row}"><span>Departure</span><strong>${new Date(p.flight.departureTime).toLocaleString()}</strong></div>
          <div class="${styles.row}"><span>Arrival</span><strong>${new Date(p.flight.arrivalTime).toLocaleString()}</strong></div>
          <div class="${styles.row}"><span>Stops</span><strong>${p.flight.stops}</strong></div>
        `
                : ''
            }
        <div class="${styles.hr}"></div>
        <div class="${styles.rowSmall}"><span>Receipt</span><strong>${p.receipt || '-'}</strong></div>
      </div>
      <div class="${styles.receiptFooter}">Thank you for booking with us.</div>
    `;

        mount.appendChild(host);

        const canvas = await html2canvas(host, { backgroundColor: '#0f172a', scale: 2 });
        const dataUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = `receipt_${String(p.paymentId).slice(0, 8)}.png`;
        a.click();

        mount.innerHTML = '';
    };

    return (
        <div className={styles.wrap}>
            <div className={styles.headerBar}>
                <h3 className={styles.title}>💳 Payment History</h3>
            </div>

            {all.length > 0 ? (
                <ul className={styles.list}>
                    {all.map((p) => (
                        <PaymentCard key={p.paymentId} p={p} onDownload={handleDownload} />
                    ))}
                </ul>
            ) : (
                <p className={styles.empty}>No payments found.</p>
            )}

            {/* Hidden mount area for PNG rendering */}
            <div ref={hiddenRef} className={styles.hiddenMount} aria-hidden="true" />
        </div>
    );
};

export default PaymentHistory;
