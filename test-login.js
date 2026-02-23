const credentials = { username: "admin@kitsakshar.ac.in", password: "AdminCSI@123" };
fetch("http://localhost:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
}).then(async res => {
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text);
}).catch(console.error);
