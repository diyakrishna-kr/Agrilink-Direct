async function test() {
    const baseUrl = 'http://localhost:3000';
    try {
        const resAdd = await fetch(`${baseUrl}/bag/add`, { 
            method: 'POST', 
            headers: { 'Accept': 'application/json' } 
        });
        console.log('Add to Bag (unauthorized):', resAdd.status, await resAdd.json());

        const resGet = await fetch(`${baseUrl}/bag/get`);
        console.log('Get Bag:', resGet.status, await resGet.json());
    } catch (e) {
        console.error('Fetch failed:', e.message);
    }
}
test();
