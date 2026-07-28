async function testVercelLive() {
    console.log('--- TESTING LIVE VERCEL DEPLOYMENT ENDPOINTS ---');
    try {
        const resHealth = await fetch('https://vashtralaya.vercel.app/api/health');
        console.log('1. Live Health API Status:', resHealth.status);
        const textHealth = await resHealth.text();
        console.log('Health Output:', textHealth.substring(0, 200));

        const resProd = await fetch('https://vashtralaya.vercel.app/api/product/list');
        console.log('2. Live Products API Status:', resProd.status);
        const textProd = await resProd.text();
        console.log('Products Output:', textProd.substring(0, 200));

        const resHome = await fetch('https://vashtralaya.vercel.app/');
        console.log('3. Live Frontend Status:', resHome.status);
        const textHome = await resHome.text();
        console.log('Frontend Output:', textHome.substring(0, 200));

    } catch (err) {
        console.error('Vercel live test error:', err.message);
    }
}

testVercelLive();
