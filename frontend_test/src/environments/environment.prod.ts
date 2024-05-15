export const environment = {
    production: true,
      hmr: false,
      http: {
        //   apiUrl: 'https://test.chamzhaosi.com:8000/api/', 
          apiUrl: 'https://metropolice.chamzhaosi.com/api/', 
      },
      websocket: {
          host: "metropolice.chamzhaosi.com",
          path: '/ws/call/'
      },
  };