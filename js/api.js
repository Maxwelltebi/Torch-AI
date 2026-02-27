// api.js — Handles Claude API calls for career path recommendation

async function getCareerRecommendation(answers) {
  const kitList = CAREER_KITS.map((k) => `- ${k.id}: ${k.title} (${k.field})`).join("\n");

  const prompt = `You are Torch AI, a career advisor for university students at CIReN (Campus Innovation & Research Network).

A student has answered the following questions:

1. What is your major or field of study?
Answer: ${answers.major}

2. What activities or topics excite you most?
Answer: ${answers.interests}

3. What kind of work environment do you prefer?
Answer: ${answers.environment}

4. What is your primary career goal?
Answer: ${answers.goal}

5. What is your strongest skill or quality?
Answer: ${answers.strength}

Based on their answers, recommend the SINGLE most relevant career path from this list:
${kitList}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "recommendedId": "the-kit-id-here",
  "reasoning": "2-3 sentence personalized explanation of why this path fits them specifically, referencing their answers",
  "alternativeId": "another-kit-id-as-backup"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": CONFIG.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.content?.[0]?.text || "";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }
}
