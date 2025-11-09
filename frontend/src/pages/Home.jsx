import { useDispatch } from "react-redux";
import { fetchUser } from "../redux/userSlice";
import Navbar from "../components/navbar/navbar";
import Bookingcard from "../components/bookingCard/bookingcard";
import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

const Home = () => {
    const dispatch = useDispatch();
    const [treesPlanted, setTreesPlanted] = useState(25347);
    const bookingRef = useRef(null);

    useEffect(() => {
        dispatch(fetchUser());
        const interval = setInterval(() => {
            setTreesPlanted((prev) => prev + Math.floor(Math.random() * 3));
        }, 4000);
        return () => clearInterval(interval);
    }, [dispatch]);

    const handleScrollToBooking = () => {
        bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <>
            <Navbar />

            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroOverlay} />
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>
                        Travel the World. <span>Heal the Planet.</span>
                    </h1>
                    <p className={styles.heroSubtitle}>
                        Every flight you book with <strong>Nature Trip</strong> helps plant trees across India.
                        Your journey inspires change, one ticket at a time.
                    </p>
                    <button className={styles.heroBtn} onClick={handleScrollToBooking}>
                        Start Booking
                    </button>
                </div>
            </section>

            {/* IMPACT */}
            <section className={styles.impactSection}>
                <div className={styles.impactCard}>
                    <h2>{treesPlanted.toLocaleString()}</h2>
                    <p>Trees planted by Nature Trip travelers</p>
                </div>
                <div className={styles.impactCard}>
                    <h2>120+</h2>
                    <p>Destinations across the globe</p>
                </div>
                <div className={styles.impactCard}>
                    <h2>1 Ticket = 1 Tree</h2>
                    <p>Book a flight, grow a forest</p>
                </div>
            </section>

            {/* BOOKING */}
            <section className={styles.bookingSection} ref={bookingRef}>
                <h2 className={styles.bookingTitle}>Book Your Next Green Journey</h2>
                <p className={styles.bookingDesc}>
                    Discover affordable flights and make a positive impact every time you travel.
                </p>
                <div className={styles.bookingWrapper}>
                    <Bookingcard />
                </div>
            </section>

            {/* WHY WE PLANT */}
            <section className={styles.whyPlant}>
                <h2>Why We Plant Trees</h2>
                <p>
                    Every flight emits carbon — we balance that by planting trees in deforested regions,
                    restoring nature and empowering local communities.
                </p>
                <div className={styles.whyGrid}>
                    <div className={styles.whyItem}>
                        <img src="https://cdn-icons-png.flaticon.com/512/1067/1067357.png" alt="carbon offset" />
                        <h3>Carbon Offset</h3>
                        <p>Trees capture CO₂ and purify our atmosphere.</p>
                    </div>
                    <div className={styles.whyItem}>
                        <img src="https://cdn-icons-png.flaticon.com/512/1843/1843544.png" alt="community" />
                        <h3>Local Empowerment</h3>
                        <p>We work with farmers and NGOs to create green jobs.</p>
                    </div>
                    <div className={styles.whyItem}>
                        <img src="https://cdn-icons-png.flaticon.com/512/616/616408.png" alt="biodiversity" />
                        <h3>Eco Diversity</h3>
                        <p>Forests protect wildlife and nurture ecosystems.</p>
                    </div>
                </div>
            </section>

            <footer className={styles.footer}>
                <p>
                    © {new Date().getFullYear()} Nature Trip — Traveling Lighter, Living Greener 🌿
                </p>
            </footer>
        </>
    );
};

export default Home;
