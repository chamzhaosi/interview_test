export const environment = {
    production: true,
      hmr: false,
      http: {
          apiUrl: 'http://localhost:8000/api/', 
      },
      websocket: {
          host: "localhost:8000",
          path: '/ws/call/'
      },
  };