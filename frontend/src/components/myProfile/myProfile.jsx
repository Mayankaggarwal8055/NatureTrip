import styles from './myProfile.module.css';
import { useReducer } from "react";
import profileData from '../../API/profile.js';

const EmptyData = {
  firstName: "",
  lastName: "",
  gender: "",
  dob: "",
  mobile: "",
  email: "",
  passport: "",
  expiryDate: "",
};

const Reducer = (state, action) => ({ ...state, [action.type]: action.val });

const MyProfile = ({ user, userId }) => {
  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

  const [state, dispatch] = useReducer(
    Reducer,
    user
      ? {
        ...EmptyData,
        email: user.email || "",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        gender: user?.gender || "",
        dob: formatDateForInput(user?.dob) || "",
        mobile: user?.mobile || "",
        passport: user?.passport || "",
        expiryDate: formatDateForInput(user?.expiryDate) || "",
      }
      : EmptyData
  );

  const handleSave = async () => {
    await profileData(state, userId);
  };

  return (
    <div className={styles.profileMain}>
      <div className={styles.profileMainHeader}>
        <h1>My Profile</h1>
        <button onClick={handleSave}>SAVE</button>
      </div>

      <section className={styles.profileSection}>
        <h2>General Information</h2>
        <div className={styles.grid2}>
          <input
            type="text"
            name="firstName"
            placeholder="FIRST & MIDDLE NAME"
            value={state.firstName}
            onChange={(e) => dispatch({ type: "firstName", val: e.target.value })}
          />
          <input
            type="text"
            name="lastName"
            placeholder="LAST NAME"
            value={state.lastName}
            onChange={(e) => dispatch({ type: "lastName", val: e.target.value })}
          />
          <select
            name="gender"
            value={state.gender}
            onChange={(e) => dispatch({ type: "gender", val: e.target.value })}
          >
            <option value="">GENDER</option>
            <option value="male">MALE</option>
            <option value="female">FEMALE</option>
          </select>
          <input
            type="date"
            name="dob"
            value={state.dob}
            onChange={(e) => dispatch({ type: "dob", val: e.target.value })}
          />
        </div>
      </section>

      <section className={styles.profileSection}>
        <h2>Contact Details</h2>
        <div className={styles.grid2}>
          <input
            type="text"
            name="mobile"
            placeholder="MOBILE NUMBER"
            value={state.mobile}
            onChange={(e) => dispatch({ type: "mobile", val: e.target.value })}
          />
          <input
            type="email"
            name="email"
            placeholder="EMAIL ID"
            value={state.email}
            onChange={(e) => dispatch({ type: "email", val: e.target.value })}
          />
        </div>
      </section>

      <section className={styles.profileSection}>
        <h2>Documents Details</h2>
        <div className={styles.grid2}>
          <input
            type="text"
            name="passport"
            placeholder="PASSPORT NO."
            value={state.passport}
            onChange={(e) => dispatch({ type: "passport", val: e.target.value })}
          />
          <input
            type="date"
            name="expiryDate"
            placeholder="EXPIRY DATE"
            value={state.expiryDate}
            onChange={(e) => dispatch({ type: "expiryDate", val: e.target.value })}
          />
        </div>
      </section>
    </div>
  );
};

export default MyProfile;
