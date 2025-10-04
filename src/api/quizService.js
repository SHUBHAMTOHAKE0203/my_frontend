import axios from "axios";

export const fetchSkillsAndGenerateQuiz = async (skill) => {
  const prompt = `Generate a strict JSON quiz for the skill: ${skill}.
  Create 5 multiple-choice questions with 4 options each.
  Use this structure:
  [
    {
      "skill": "${skill}",
      "questions": [
        {
          "question": "string",
          "options": ["A", "B", "C", "D"],
          "correctAnswerIndex": 0
        }
      ]
    }
  ]`;

  const res = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "openai/gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  let content = res.data.choices[0].message.content;

  // Clean code fences if AI wraps JSON
  if (content.includes("```")) {
    content = content.replace(/```json|```/g, "").trim();
  }

  return JSON.parse(content);
};
