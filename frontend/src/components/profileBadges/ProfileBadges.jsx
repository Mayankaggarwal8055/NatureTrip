import { useState } from "react";
import styles from "./ProfileBadges.module.css";

const ProfileBadges = ({ user }) => {
    const paidCount =
        user?.travellers?.filter(
            (t) => t.status?.toLowerCase() === "paid"
        ).length || 0;

    const [showPopup, setShowPopup] = useState(false);
    const [selectedBadge, setSelectedBadge] = useState(null);
    const [copiedType, setCopiedType] = useState(null); // 'text' or 'symbol'

    const badges = [
        { milestone: 1, key: "sprout", symbol: "⟐", title: "Sprout Beginner", desc: "Started your journey toward a greener world!", color: "#4ade80" },
        { milestone: 3, key: "ally", symbol: "⟟", title: "Nature Ally", desc: "Consistent effort for nature’s balance 🌳", color: "#22c55e" },
        { milestone: 5, key: "guardian", symbol: "⟑", title: "Eco Guardian", desc: "Making a real difference for our planet 🌎", color: "#16a34a" },
        { milestone: 10, key: "protector", symbol: "⚚", title: "Planet Protector", desc: "A hero for Earth! Share your achievement 💚", color: "#0f766e" },
        { milestone: 20, key: "forest", symbol: "⧊", title: "Forest Builder", desc: "You’ve helped grow an entire ecosystem 🌲", color: "#0d9488" },
        { milestone: 30, key: "legend", symbol: "⟴", title: "Earth Legend", desc: "An unstoppable force for sustainability 💫", color: "#115e59" },
    ];

    const unlockedBadge = badges
        .slice()
        .reverse()
        .find((b) => paidCount >= b.milestone);

    const openPopup = (badge) => {
        setSelectedBadge(badge);
        setShowPopup(true);
        setCopiedType(null);
    };

    const closePopup = () => {
        setShowPopup(false);
        setCopiedType(null);
    };

    const handleCopyText = (badge) => {
        const text = `${badge.symbol} ${user?.name || "Eco Hero"} — ${badge.title} 🌿 #NatureTrip`;
        navigator.clipboard.writeText(text);
        setCopiedType("text");
        setTimeout(() => setCopiedType(null), 2000);
    };

    const handleCopySymbol = (badge) => {
        navigator.clipboard.writeText(badge.symbol);
        setCopiedType("symbol");
        setTimeout(() => setCopiedType(null), 2000);
    };

    return (
        <div className={styles.badgeContainer}>
            <h2 className={styles.title}>🏅 Your Eco Journey</h2>
            <p className={styles.subtitle}>
                You’ve planted <strong>{paidCount}</strong> trees so far 🌳
            </p>

            {unlockedBadge && (
                <div
                    className={styles.badgeCard}
                    style={{ borderColor: unlockedBadge.color }}
                >
                    <div className={styles.badgeEmoji}>{unlockedBadge.symbol}</div>
                    <h3 className={styles.badgeTitle}>{unlockedBadge.title}</h3>
                    <p className={styles.badgeDesc}>{unlockedBadge.desc}</p>
                    <p className={styles.badgeOwner}>Awarded to {user?.name || "User"}</p>

                    <button
                        className={styles.downloadBtn}
                        onClick={() => openPopup(unlockedBadge)}
                    >
                        View & Copy Badge 🪶
                    </button>
                </div>
            )}

            <h3 className={styles.sectionTitle}>🌿 Badge Milestones</h3>
            <div className={styles.badgeList}>
                {badges.map((b) => (
                    <div
                        key={b.key}
                        className={`${styles.badgeLine} ${paidCount >= b.milestone ? styles.completed : ""
                            }`}
                    >
                        <div className={styles.lineLeft}>
                            <span className={styles.lineMilestone}>{b.milestone} Completed</span>
                            <span className={styles.lineBadge}>{b.symbol} {b.title}</span>
                        </div>
                        <div className={styles.lineRight}>
                            {paidCount >= b.milestone ? (
                                <button
                                    className={styles.downloadSmall}
                                    onClick={() => openPopup(b)}
                                >
                                    Copy 🪶
                                </button>
                            ) : (
                                <span className={styles.locked}>🔒 Locked</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {showPopup && selectedBadge && (
                <div className={styles.popupOverlay}>
                    <div className={styles.popup}>
                        <button className={styles.closeBtn} onClick={closePopup}>
                            ×
                        </button>
                        <div
                            className={styles.badgePreview}
                            style={{ background: selectedBadge.color }}
                        >
                            <span className={styles.badgeSymbol}>{selectedBadge.symbol}</span>
                            <span className={styles.badgeName}>{user?.name || "Eco Hero"}</span>
                        </div>
                        <h3>{selectedBadge.title}</h3>
                        <p className={styles.desc}>{selectedBadge.desc}</p>

                        <div className={styles.copyBtns}>
                            <button
                                className={`${styles.copyBtn} ${copiedType === "text" ? styles.copied : ""
                                    }`}
                                onClick={() => handleCopyText(selectedBadge)}
                            >
                                {copiedType === "text" ? "✅ Copied!" : "Copy Full Badge ✨"}
                            </button>
                            <button
                                className={`${styles.copyBtnAlt} ${copiedType === "symbol" ? styles.copiedAlt : ""
                                    }`}
                                onClick={() => handleCopySymbol(selectedBadge)}
                            >
                                {copiedType === "symbol" ? "✅ Copied!" : "Copy Symbol 🔣"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileBadges;
