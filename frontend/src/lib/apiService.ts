export const analyzeFromAPI = async (userId: string) => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/analyze/${userId}`
    );

    return await res.json();
  } catch (error) {
    console.error("API error:", error);
  }
};