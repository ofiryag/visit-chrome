const LLM_WHITELIST = ["chatgpt", "openai", "claude", "sonnet", "gemini", "LLM", "AI", "chatbot"];
const jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdF9oYXNoIjoiUXQ0VEVEMFBqMGtHQ0FJVU9TRzJTQSIsInN1YiI6IjVjZGY1MWJiLWFlMmUtNDQzMy1hOGQ3LWM5MTc3MDRlMjRmMiIsImNvZ25pdG86Z3JvdXBzIjpbInVzLWVhc3QtMV9mX0dvb2dsZSJdLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImN1c3RvbTpvcmdhbml6YXRpb25faWQiOiIwMzIxNWM1ZC0yYjA1LTQ4MTQtOTkzNS01ZTU4ODU5MDQ5ZmIiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3VzLWVhc3QtMV9zRU9IbzdJbnAiLCJjb2duaXRvOnVzZXJuYW1lIjoiZ29vZ2xlXzEwMzE5MzQyOTkwNjQ3MzcyMTM0MiIsImdpdmVuX25hbWUiOiJPZmlyIiwib3JpZ2luX2p0aSI6ImYzZWNkNmJhLWM0ODktNDY4NS04MjkzLTk3M2J5OTc2NTJlYyIsImF1ZCI6IjdjdDRvY2I0cXZpajllaDlzaHJlOHZuNzM4IiwiaWRlbnRpdGllcyI6W3sidXNlcklkIjoiMTAzMTkzNDI5OTA2NDczMzIxMzQyIiwicHJvdmlkZXJOYW1lIjoiR29vZ2xlIiwicHJvdmlkZXJUeXBlIjoiR29vZ2xlIiwiaXNzdWVyIjpudWxsLCJwcmltYXJ5IjoidHJ1ZSIsImRhdGVDcmVhdGVkIjoiMTcyMTY2MDExNjI0MSJ9XSwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3MjMxMDA0MzYsImV4cCI6MTcyMzM5NTI5NCwiaWF0IjoxNzIzMzkxNjk1LCJmYW1pbHlfbmFtZSI6IllhZ29kYSIsImp0aSI6IjUwNWNlMDI0LTIyNzAtNGUwYy1hMTJmLTg4OGFlNDU3MTgyOSIsImVtYWlsIjoib2ZpcnlAbGFzc28uc2VjdXJpdHkifQ.luMu09caCiaNd9WXco9ZS6RmULjGrqJrjyXyIchy6-k'; // Insert JWT here (static or dynamic)
let visits = [];  // Array to hold visit data
let visitLimit = 10;  // Send after 10 visits or 1 minute
let intervalTime = 60 * 1000;  // 1 minute in milliseconds

// Function to accumulate visit data
chrome.tabs.onActivated.addListener(async (activeInfo) => {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    const url = tab.url;
    if (!shouldSendVisit(url)) return;

    // Prepare data
    const visitData = {
        url: url,
        time: new Date().toUTCString()  // ISO 8601 timestamp for visit time
    };

    // Accumulate visit data
    visits.push(visitData);

    // Send data if the limit is reached or if it's time to send
    if (visits.length >= visitLimit) {
        sendDataToBackend(visits);
        visits = [];  // Reset visits array after sending
    }
});

/* When the extension is loaded the setInterval function is executed starting the periodic process that triggers every intervalTime
*/
setInterval(() => {
    if (visits.length > 0) {
        sendDataToBackend(visits);
        visits = [];  // Reset after sending
    }
}, intervalTime);

// Function to send data to backend API
async function sendDataToBackend(data) {
    const response = await fetch('http://localhost:3000/api/v1/visit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        console.error('Failed to send data to backend');
    }
}

const shouldSendVisit = (url) => LLM_WHITELIST.some(llm => url.toLowerCase().includes(llm.toLowerCase()));