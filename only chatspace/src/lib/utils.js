export const fetchBotResponse = async (message) => {
    // Mock API request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ reply: "This is a bot reply." });
      }, 1000);
    });
  };
  