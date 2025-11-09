const verifyUser = async () => {
    try {
        const res = await fetch("http://localhost:4444/api/verify", {
            method: "GET",
            credentials: "include",
        });

        if (!res.ok) return null;

        const data = await res.json();
        
        
        return data;

    } catch (err) {
        console.error(err)
        return null;
    }
};

export default verifyUser;
