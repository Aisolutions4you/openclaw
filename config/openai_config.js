// Configuration file for OpenAI API
module.exports = {
    apiKey: process.env.OPENAI_API_KEY,

    getApiKey: () => {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not set in the environment variables');
        }
        return process.env.OPENAI_API_KEY;
    }
};