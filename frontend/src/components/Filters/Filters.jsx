import React from "react";
import styles from "./Filters.module.css";

const Filters = () => {
  return (
    <aside className={styles.filters}>
      {/* Popular Filters */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Popular Filters</h3>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Non Stop</span>
          <span className={styles.price}>₹ 9,628</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Hide Nearby Airports</span>
          <span className={styles.price}>₹ 9,628</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Refundable Fares</span>
          <span className={styles.price}>₹ 9,878</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Early Morning Departures</span>
          <span className={styles.price}>₹ 9,936</span>
        </label>
        <button className={styles.link}>+ 5 more</button>
      </div>

      {/* Arrival Airports */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Arrival Airports</h3>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Don Mueang Intl (32Km)</span>
          <span className={styles.price}>₹ 24,096</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Bangkok</span>
          <span className={styles.price}>₹ 9,628</span>
        </label>
      </div>

      {/* One Way Price */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>One Way Price</h3>
        <div className={styles.range}>
          <input id="priceRange" type="range" min="9628" max="146000" defaultValue="9628" />
          <div className={styles.rangeMeta}>
            <span>₹ 9,628</span>
            <span id="priceVal">₹ 9,628</span>
            <span>₹ 1,46,000</span>
          </div>
        </div>
      </div>

      {/* Duration */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Duration</h3>
        <div className={styles.range}>
          <input id="durRange" type="range" min="260" max="2640" defaultValue="260" />
          <div className={styles.rangeMeta}>
            <span>4 h 20 m</span>
            <span id="durVal">4 h 20 m</span>
            <span>44 h 0 m</span>
          </div>
        </div>
      </div>

      {/* Stops */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Stops From Mumbai</h3>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Non Stop</span>
          <span className={styles.price}>₹ 9,628</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>1 Stop</span>
          <span className={styles.price}>₹ 10,516</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>1+ Stop</span>
          <span className={styles.price}>₹ 13,868</span>
        </label>
      </div>

      {/* Departure */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Departure From Mumbai</h3>
        <div className={styles.chips}>
          <button className={styles.chip}>Before 6 AM</button>
          <button className={styles.chip}>6 AM to 12 PM</button>
          <button className={styles.chip}>12 PM to 6 PM</button>
          <button className={styles.chip}>After 6 PM</button>
        </div>
      </div>

      {/* Arrival */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Arrival at Bangkok</h3>
        <div className={styles.chips}>
          <button className={styles.chip}>Before 6 AM</button>
          <button className={styles.chip}>6 AM to 12 PM</button>
          <button className={styles.chip}>12 PM to 6 PM</button>
          <button className={styles.chip}>After 6 PM</button>
        </div>
      </div>

      {/* Airlines */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Alliances & Airlines</h3>
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${styles.active}`}>Oneworld</button>
          <button className={styles.tab}>SkyTeam</button>
          <button className={styles.tab}>Star Alliance</button>
        </div>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Air Astana</span>
          <span className={styles.price}>₹ 1,41,333</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Air India</span>
          <span className={styles.price}>₹ 9,628</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Batik Air</span>
          <span className={styles.price}>₹ 24,096</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Cathay Pacific</span>
          <span className={styles.price}>₹ 1,30,342</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Emirates</span>
          <span className={styles.price}>₹ 99,955</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Etihad Airways</span>
          <span className={styles.price}>₹ 99,077</span>
        </label>
        <button className={styles.link}>+ 11 more</button>
      </div>

      {/* Layover Airports */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Layover Airports</h3>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Abu Dhabi</span>
          <span className={styles.price}>₹ 99,077</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Ahmedabad</span>
          <span className={styles.price}>₹ 13,868</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Almaty</span>
          <span className={styles.price}>₹ 1,41,333</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Bengaluru</span>
          <span className={styles.price}>₹ 11,228</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Chennai</span>
          <span className={styles.price}>₹ 10,516</span>
        </label>
        <button className={styles.link}>+ 10 more</button>
      </div>

      {/* Layover Duration */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Layover Duration</h3>
        <div className={styles.range}>
          <input id="layRange" type="range" min="95" max="2190" defaultValue="95" />
          <div className={styles.rangeMeta}>
            <span>1 h 35 m</span>
            <span id="layVal">1 h 35 m</span>
            <span>36 h 30 m</span>
          </div>
        </div>
      </div>

      {/* Aircraft Size */}
      <div className={styles.filterCard}>
        <h3 className={styles.cardTitle}>Aircraft Size</h3>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Small / Mid - size aircraft</span>
          <span className={styles.price}>₹ 9,628</span>
        </label>
        <label className={styles.check}>
          <input type="checkbox" /> <span>Large Aircraft</span>
          <span className={styles.price}>₹ 19,206</span>
        </label>
      </div>
    </aside>
  );
};

export default Filters;
