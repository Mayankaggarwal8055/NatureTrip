import { useMemo, useState } from 'react';
import styles from './profilePage.module.css'; // ← new modular CSS
import MyProfile from '../../components/myProfile/myProfile';
import UserFlights from '../../components/UserFlights/userFlights';
import ProfileTravellers from '../../components/profileTravellers/profileTravellers';
import PaymentHistory from '../../components/paymentHistory/paymentHistory';

const ProfilePage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');

  // Flatten all flights across travellers
  const flights = useMemo(() => {
    if (!user?.travellers) return [];
    const list = [];

    for (const t of user.travellers) {
      for (const b of t.bookings || []) {
        if (b.flight) {
          list.push({
            id: b.flight.id,
            from: b.flight.from,
            to: b.flight.to,
            departureTime: b.flight.departureTime,
            arrivalTime: b.flight.arrivalTime,
            flightNumber: b.flight.flightNumber,
            carrier: b.flight.carrier,
            currency: b.flight.currency,
            price:
              typeof b.amount === 'number'
                ? b.amount
                : Math.round((b.flight.totalFare || 0) * 100),
            totalFare: b.flight.totalFare,
            baseFare: b.flight.baseFare,
            stops: b.flight.stops,
            segments: b.flight.segments || [],
          });
        }
      }
    }

    // Unique by flight ID
    const seen = new Set();
    return list.filter(f => (seen.has(f.id) ? false : seen.add(f.id)));
  }, [user]);

  // Payments list
  const payments = useMemo(() => {
    if (!user?.travellers) return [];
    const rows = [];

    for (const t of user.travellers) {
      for (const b of t.bookings || []) {
        rows.push({
          paymentId: b.paymentId,
          razorpayId: b.razorpayId,
          gatewayPaymentId: b.gatewayPaymentId,
          receipt: b.receipt,
          amount: b.amount,
          currency: b.currency || 'INR',
          status: b.status,
          createdAt: b.createdAt,
          traveller: {
            id: t.id,
            firstName: t.firstName,
            lastName: t.lastName,
            ticketNumber: t.ticketNumber,
            status: t.status,
          },
          flight: b.flight || null,
        });
      }
    }

    rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return rows;
  }, [user]);

  // Tab switching content
  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <MyProfile user={{ ...user.profile, email: user.email }} userId={user.id} />
        );
      case 'FlightData':
        return <UserFlights flights={flights} />;
      case 'traveller':
        return <ProfileTravellers data={{ travellers: user.travellers, flights }} />;
      case 'payments':
        return <PaymentHistory payments={payments} />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.profileContainer}>
      <aside className={styles.profileSidebar} role="navigation" aria-label="Account">
        <h2>My Account</h2>
        <ul>
          <li
            onClick={() => setActiveTab('profile')}
            className={activeTab === 'profile' ? styles.active : ''}
          >
            My Profile
          </li>
          <li
            onClick={() => setActiveTab('FlightData')}
            className={activeTab === 'FlightData' ? styles.active : ''}
          >
            Flight Data
          </li>
          <li
            onClick={() => setActiveTab('traveller')}
            className={activeTab === 'traveller' ? styles.active : ''}
          >
            All Travellers
          </li>
          <li
            onClick={() => setActiveTab('payments')}
            className={activeTab === 'payments' ? styles.active : ''}
          >
            Payments
          </li>
        </ul>
      </aside>

      <main className={styles.profileMain}>{renderContent()}</main>
    </div>
  );
};

export default ProfilePage;
