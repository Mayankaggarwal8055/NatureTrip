const signUpData = async (userData) => {
    

    try {
        const res = await fetch('http://localhost:4444/api/SignUp', {
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
        console.error(error)

        return { error: error.message }
    }


}

export default signUpData