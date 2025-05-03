
export async function getChats() {
    const token = localStorage.getItem('accessToken');
    const result = await fetch('http://localhost:3000/api/user/chats', {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`
        }
    })
    return result;
}