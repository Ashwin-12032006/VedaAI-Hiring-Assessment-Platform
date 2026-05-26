import { GoogleGenerativeAI } from '@google/generative-ai';
import { ISection, IQuestion } from '../models/Assignment';
import { v4 as uuidv4 } from 'uuid';

// Helper to generate realistic Mock Questions when API key is missing
const generateMockQuestions = (title: string, numQuestions: number, marks: number, types: string[]): ISection[] => {
  const finalSections: ISection[] = [];
  const typeStr = types.join(' & ') || 'General Questions';
  
  // Decide how many sections based on number of questions
  const sectionCount = numQuestions > 8 ? 3 : numQuestions > 4 ? 2 : 1;
  const questionsPerSection = Math.ceil(numQuestions / sectionCount);
  
  let questionCounter = 1;
  const marksPerQuestion = Math.max(1, Math.round(marks / numQuestions));
  
  const sectionTitles = ['Section A: Fundamentals', 'Section B: Intermediate Exercises', 'Section C: Advanced Problems'];
  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];

  // Topic specific lists
  const topics: Record<string, string[]> = {
    electricity: [
      "Define Ohm's Law and express it mathematically.",
      "Calculate the equivalent resistance of three resistors (2, 4, and 6 ohms) connected in parallel.",
      "What is electric current, and what is its SI unit?",
      "Explain the difference between Alternating Current (AC) and Direct Current (DC).",
      "Explain how a fuse works and why it is placed in series in a circuit.",
      "What is the heating effect of electric current? List two household appliances that work on this effect.",
      "A lightbulb has a rating of 60W, 220V. Calculate the current running through it and its resistance.",
      "Describe the construction and working principle of a simple electric motor."
    ],
    math: [
      "Solve for x in the equation: 3x + 12 = 45.",
      "Find the derivative of f(x) = 3x^2 + 5x - 7 with respect to x.",
      "State and prove the Pythagorean Theorem.",
      "Calculate the area of a circle with a radius of 7 cm (take pi = 22/7).",
      "Solve the quadratic equation: x^2 - 5x + 6 = 0.",
      "Explain the difference between a rational and an irrational number, giving examples of each.",
      "Evaluate the limit of (x^2 - 4)/(x - 2) as x approaches 2.",
      "Solve the system of linear equations: 2x + y = 10 and x - y = 2."
    ],
    coding: [
      "What is a variable, and how does it differ from a constant?",
      "Write a function in JavaScript to check if a given string is a palindrome.",
      "Explain the concept of Recursion with a short code example.",
      "What is the time complexity of binary search on a sorted array? Explain.",
      "Explain the differences between REST and GraphQL APIs.",
      "Describe the four pillars of Object-Oriented Programming (OOP) with real-world analogies.",
      "Write a Python script that reads a text file and counts the frequency of each word.",
      "What is a deadlock in Operating Systems? Describe the four necessary conditions for it to occur."
    ]
  };

  // Match title to topics
  const lowerTitle = title.toLowerCase();
  let selectedTopicQuestions = topics.coding; // default
  if (lowerTitle.includes('electricity') || lowerTitle.includes('physics') || lowerTitle.includes('science')) {
    selectedTopicQuestions = topics.electricity;
  } else if (lowerTitle.includes('math') || lowerTitle.includes('algebra') || lowerTitle.includes('calculus')) {
    selectedTopicQuestions = topics.math;
  } else if (lowerTitle.includes('code') || lowerTitle.includes('javascript') || lowerTitle.includes('python') || lowerTitle.includes('programming') || lowerTitle.includes('computer')) {
    selectedTopicQuestions = topics.coding;
  }

  for (let s = 0; s < sectionCount; s++) {
    if (questionCounter > numQuestions) break;
    
    const sectionQuestions: IQuestion[] = [];
    const secTitle = sectionTitles[s] || `Section ${String.fromCharCode(65 + s)}`;
    
    for (let q = 0; q < questionsPerSection; q++) {
      if (questionCounter > numQuestions) break;
      
      const text = selectedTopicQuestions[(questionCounter - 1) % selectedTopicQuestions.length] 
        + ` (Topic Focus: ${title} - ${typeStr})`;
      
      const diffIdx = (s + q) % 3;
      const difficulty = difficulties[diffIdx];
      
      sectionQuestions.push({
        id: `q-${uuidv4().substring(0, 8)}`,
        text,
        difficulty,
        marks: marksPerQuestion,
        options: types.includes('MCQ') ? ['Option A', 'Option B', 'Option C', 'Option D'] : undefined
      });
      
      questionCounter++;
    }

    finalSections.push({
      id: `sec-${uuidv4().substring(0, 8)}`,
      title: secTitle,
      instruction: `Attempt all questions in this section. Each question carries ${marksPerQuestion} mark(s).`,
      questions: sectionQuestions
    });
  }

  return finalSections;
};

export class AIService {
  /**
   * Generates question papers based on user prompts
   */
  public static async generateQuestionPaper(
    title: string,
    numQuestions: number,
    totalMarks: number,
    questionTypes: string[],
    instructions: string,
    fileContent?: string
  ): Promise<ISection[]> {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
      console.warn('[AI] Gemini API Key is not set or using placeholder. Using mock generation service.');
      // Wait 1.5 seconds to simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      return generateMockQuestions(title, numQuestions, totalMarks, questionTypes);
    }

    try {
      console.log(`[AI] Initializing Gemini API for assessment: "${title}"...`);
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

      const typesJoined = questionTypes.join(', ');
      const hasSourceMaterial = fileContent && fileContent.trim().length > 0;
      
      const systemPrompt = `You are an expert AI Assessment Creator and Senior Educator. Your job is to generate a structured, extremely well-designed and rigorous exam question paper.
      You MUST output the result ONLY as a valid JSON array of sections. Follow the exact schema below.

      JSON Format:
      [
        {
          "title": "Section A: Multiple Choice Questions",
          "instruction": "Attempt all questions. Choose the most appropriate option.",
          "questions": [
            {
              "text": "What is the SI unit of electrical resistance?",
              "difficulty": "easy",
              "marks": 1,
              "options": ["Ohm", "Ampere", "Volt", "Watt"]
            }
          ]
        }
      ]

      STRICT CONSTRAINTS:
      1. Total number of questions across ALL sections MUST be exactly: ${numQuestions}.
      2. The sum of all question marks across all sections MUST equal exactly: ${totalMarks}.
      3. Question types to generate: ${typesJoined}.
      4. If "MCQ" type is selected, provide EXACTLY 4 realistic, plausible options in the "options" array. The correct answer must be one of the four options. For all other question types, do NOT include the "options" field.
      5. Difficulty must be one of exactly: "easy", "medium", or "hard". Distribute them naturally.
      6. Output ONLY raw JSON. No markdown, no code blocks, no explanation text.
      ${hasSourceMaterial ? `
      7. CRITICAL: The questions MUST be derived directly and specifically from the SOURCE MATERIAL provided below. Do NOT use general knowledge. Every question must test content that is explicitly present in the source material. Options for MCQs must be plausible based on the source material.` : ''}`;

      const prompt = `
      Create an assessment paper titled: "${title}"
      Number of Questions: ${numQuestions}
      Total Marks: ${totalMarks}
      Question Types: ${typesJoined}
      Additional Guidelines: ${instructions || 'None provided'}
      ${hasSourceMaterial ? `\n--- SOURCE MATERIAL (Base ALL questions on this text) ---\n${fileContent?.substring(0, 15000)}\n--- END OF SOURCE MATERIAL ---` : ''}

      Generate the complete JSON array now.
      `;

      const result = await model.generateContent([systemPrompt, prompt]);
      const response = await result.response;
      const responseText = response.text().trim();

      // Clean response text just in case Gemini wrapped it in a ```json code block
      let cleanJsonText = responseText;
      if (cleanJsonText.startsWith('```json')) {
        cleanJsonText = cleanJsonText.replace(/^```json/, '');
      }
      if (cleanJsonText.startsWith('```')) {
        cleanJsonText = cleanJsonText.replace(/^```/, '');
      }
      if (cleanJsonText.endsWith('```')) {
        cleanJsonText = cleanJsonText.substring(0, cleanJsonText.length - 3);
      }
      cleanJsonText = cleanJsonText.trim();

      console.log('[AI] Gemini raw output received. Parsing JSON...');
      const parsedSections: any[] = JSON.parse(cleanJsonText);

      // Map and validate structure
      let qCounter = 0;
      const formattedSections: ISection[] = parsedSections.map((sec, sIdx) => {
        const questions: IQuestion[] = (sec.questions || []).map((q: any) => {
          qCounter++;
          const diff = q.difficulty?.toLowerCase();
          const finalDiff: 'easy' | 'medium' | 'hard' = 
            (diff === 'easy' || diff === 'medium' || diff === 'hard') ? diff : 'medium';
            
          return {
            id: q.id || `q-${uuidv4().substring(0, 8)}`,
            text: q.text || 'Sample Question Text',
            difficulty: finalDiff,
            marks: typeof q.marks === 'number' ? q.marks : 1,
            options: q.options && Array.isArray(q.options) ? q.options : undefined
          };
        });

        return {
          id: sec.id || `sec-${uuidv4().substring(0, 8)}`,
          title: sec.title || `Section ${String.fromCharCode(65 + sIdx)}`,
          instruction: sec.instruction || 'Attempt all questions in this section.',
          questions
        };
      });

      console.log(`[AI] Successfully parsed ${qCounter} questions in ${formattedSections.length} sections.`);
      return formattedSections;

    } catch (err) {
      console.error('[AI] Gemini Generation failed. Falling back to Mock service.', err);
      return generateMockQuestions(title, numQuestions, totalMarks, questionTypes);
    }
  }
}
