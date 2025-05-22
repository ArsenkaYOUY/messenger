
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

export async function createChat(type, members, creatorId) {
    console.log('creator: ', creatorId);
    console.log('type: ', type);
    console.log('members: ', members);
    const response = await fetch('http://localhost:3000/api/user/chats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type: type,
            members: members, // ID найденного пользователя
            creatorId: creatorId
        })
    });
    return response;
}

export async function getMessages(chatId) {
    const token = localStorage.getItem('accessToken');
    const result = await fetch(`http://localhost:3000/api/user/chats/${chatId}/messages`, {
        method: 'GET',
        // headers: {
        //     'authorization': `Bearer ${token}`
        // }
    })
    return result;
}