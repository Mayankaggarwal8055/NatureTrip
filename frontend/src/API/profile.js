const profileData = async (updatedProfileData, userId) => {

    
    
    try {

        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/profileData`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ updatedProfileData, userId })
        });
        const data = await res.json();
        return data

        //yha tak data aa gya payment order ka 

    } catch (error) {
        console.error(error)
    }

}

export default profileData