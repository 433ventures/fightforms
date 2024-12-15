import { config } from 'dotenv';

config({
    path: '../../.env',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
};

export default nextConfig;
