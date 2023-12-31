import OpenAI from "openai"

export default async function RequestGPT(question, userInput, sampleAnswer) {
    if (process.env.REACT_APP_APIKEY === undefined) {
        return "GPT API Key does not exist."
    }

    const openai = new OpenAI({
        apiKey: process.env.REACT_APP_APIKEY,
        dangerouslyAllowBrowser: true 
    })

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role:'system', content:'You are an assistant that will check if a sample answer given to you matches the sample question given to you. If there is a sample answer given, use it to determine if the user answered the correct answer. You can ONLY reply with "y" if the answer is correct, and "n" if the answer is incorrect.'},
                { role: "user", content: `Question: ${question}, User's Answer: ${userInput}, Sample Answer: ${sampleAnswer}` }
            ],
            temperature: 0,
            max_tokens: 1000,
          });
          console.log(response)

          return response.choices[0].message.content
    } catch (err) {
        console.error("An error occured: " + err.message)
    }
}