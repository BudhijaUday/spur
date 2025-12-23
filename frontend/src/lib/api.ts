const API_URL = 'http://localhost:3434/api';

export async function sendMessage(message: string, sessionId?: string) {
    const response = await fetch(`${API_URL}/chat/message`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return response.json();
}

export async function getHistory(sessionId: string) {
    const response = await fetch(`${API_URL}/chat/history/${sessionId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch history');
    }
    return response.json();
}
