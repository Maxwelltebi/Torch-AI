// api.js — Handles Gemini API calls for career path recommendation

async function getCareerRecommendation(answers) {
  const kitList = CAREER_KITS.map((k) => `- ${k.id}: ${k.title} (${k.field})`).join("\n");

  const prompt = `You are Torch AI, a career advisor for university students at CIReN (Campus Innovation & Research Network).

A student has answered the following questions:

=== ACADEMIC & EXPERIENCE ===
1. Major/Field of Study: ${answers.major}
2. Year of Study: ${answers.year}
7. Past Experience: ${answers.experience}

=== WORK PREFERENCES ===
3. Work Style: ${answers.workStyle}
4. Work Environment: ${answers.environment}
13. Work-Life Balance Importance: ${answers.workLife}

=== TECHNICAL BACKGROUND ===
5. Technical Comfort Level: ${answers.techComfort}
6. Technical Skills: ${answers.techSkills}

=== LEARNING & PROBLEM-SOLVING ===
8. Learning Style: ${answers.learningStyle}
9. Problem-Solving Approach: ${answers.problemSolving}

=== INTERESTS & AMBITIONS ===
10. Topics of Interest: ${answers.interests}
11. Long-term Ambition: ${answers.ambition}
12. Career Values: ${answers.values}

=== STRENGTHS & PREFERENCES ===
14. Greatest Strengths: ${answers.strengths}
15. What to Avoid: ${answers.dislikes}
16. Leadership Interest: ${answers.leadership}
17. Industry Preference: ${answers.industry}

=== ADDITIONAL NOTES ===
18. Anything Else: ${answers.extra || "(Not provided)"}

Based on their answers, recommend the SINGLE most relevant career path from this list:
${kitList}

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "recommendedId": "the-kit-id-here",
  "reasoning": "2-3 sentence personalized explanation of why this path fits them specifically, referencing their answers",
  "alternativeId": "another-kit-id-as-backup"
}`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${CONFIG.GEMINI_API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

  try {
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch {
    throw new Error("Failed to parse AI response. Please try again.");
  }
}
