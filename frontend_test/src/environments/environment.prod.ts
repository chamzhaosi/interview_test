export const environment = {
    production: true,
      hmr: false,
      http: {
          apiUrl: 'https://localhost:8000/api/', 
      },
      websocket: {
          host: "localhost:8000",
          path: '/ws/call/'
      },
  };