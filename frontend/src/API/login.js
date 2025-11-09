const loginData = async (userData) => {


    try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
            credentials: 'include'
        })

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Signup failed');
        }


        const data = await res.json()


        return data


    } catch (error) {
        return { error: error.message }
    }


}

export default loginData