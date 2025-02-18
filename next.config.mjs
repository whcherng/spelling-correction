const nextConfig = {
    /* config options here */
    async redirects() {
        return [
            {
                source: "/",
                destination: "/spelling-correction",
                permanent: true,
            },
        ];
    }
};

export default nextConfig;
