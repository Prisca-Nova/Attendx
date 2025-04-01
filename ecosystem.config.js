module.exports = {
  apps: [
    {
      name: 'Attend X', // App name for identification in PM2
      script: 'dist/main.js', // Entry point of your compiled NestJS app
      watch: process.env.NODE_ENV === 'development', // Disable file watching in production
      instances: '4', // Use all available CPU cores
      exec_mode: 'cluster', // Cluster mode for load balancing
      autorestart: true, // Restart app on crash
      max_memory_restart: '512M', // Restart app if memory exceeds 512MB
      env: {
        NODE_ENV: 'development',
        PORT: 3000, // Port for development
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8080, // Port for production
      },
      log_date_format: 'YYYY-MM-DD HH:mm Z', // Log timestamps
      error_file: './logs/err.log', // Error logs path
      out_file: './logs/out.log', // Output logs path
      combine_logs: true, // Combine logs for easier reading
    },
  ],
};
