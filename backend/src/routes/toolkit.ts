import { Router, Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = Router();

const getApiKey = () => process.env.GEMINI_API_KEY;

// 1. POST generate lesson plan
router.post('/lesson-plan', async (req: Request, res: Response) => {
  const { topic, grade, duration, objectives } = req.body;
  if (!topic || !grade) {
    return res.status(400).json({ error: 'Topic and Grade are required' });
  }

  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    // Return a high-quality mock response if key is missing
    return res.status(200).json({
      content: `# Lesson Plan: ${topic} (${grade})
**Duration:** ${duration || '60 Minutes'}
**Objectives:** ${objectives || 'Understand the core concepts of ' + topic}

## 1. Introduction (10 mins)
* Welcome students and introduce the topic: ${topic}.
* Hook: Ask a thought-provoking question to gauge prior knowledge.

## 2. Core Instruction (25 mins)
* Define the primary terms and concepts.
* Demonstrate practical examples or work through a sample problem together.
* Interactive discussion: Encourage students to ask clarifying questions.

## 3. Guided Practice (15 mins)
* Group activity: Students work in pairs to solve a simple challenge.
* Teacher walks around to provide support and assess understanding.

## 4. Assessment & Exit Ticket (10 mins)
* Quick quiz or verbal check to verify students met the objectives.
* Exit Ticket: Students write one thing they learned and one question they still have.`
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are an expert curriculum designer. Generate a highly detailed, professional lesson plan in Markdown format.
    Topic: ${topic}
    Grade/Level: ${grade}
    Duration: ${duration || '60 mins'}
    Specific Objectives/Focus: ${objectives || 'General overview'}
    
    Structure it with: Objectives, Required Materials, Lesson Introduction, Core Concepts, Guided Activity, Independent Practice, and Assessment Method. Use clean Markdown layout with appropriate headers and bullet points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ content: response.text().trim() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate lesson plan' });
  }
});

// 2. POST generate rubric
router.post('/rubric', async (req: Request, res: Response) => {
  const { task, grade, criteria } = req.body;
  if (!task || !grade) {
    return res.status(400).json({ error: 'Task and Grade are required' });
  }

  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    return res.status(200).json({
      content: `# Evaluation Rubric: ${task}
**Grade Level:** ${grade}
**Criteria list:** ${criteria || 'Understanding, Execution, Presentation'}

| Criteria | Excellent (4) | Good (3) | Satisfactory (2) | Needs Improvement (1) |
| :--- | :--- | :--- | :--- | :--- |
| **Understanding** | Demonstrates complete understanding of all key concepts with no errors. | Demonstrates strong understanding with minor errors. | Demonstrates partial understanding of the concepts. | Shows very limited or no understanding of the concepts. |
| **Execution / Logic** | Excellent application of skills. The work is accurate, clean, and logical. | Good application of skills. Work is mostly correct. | Applied some skills but missing core execution details. | Incorrect execution of skills with multiple critical errors. |
| **Presentation** | Outstanding format. Clear, tidy, and extremely well-organized. | Clear format and well-organized. | Somewhat organized but lacks clarity in some parts. | Poor formatting, untidy, and hard to follow. |`
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a senior educator. Generate a clean Markdown evaluation rubric for:
    Assessment Task: ${task}
    Grade Level: ${grade}
    Specific Criteria to Evaluate: ${criteria || 'General performance'}
    
    Output a professional markdown table containing: Criteria names, Excellent (4 points), Good (3 points), Satisfactory (2 points), and Needs Improvement (1 point) descriptions. Make sure the table columns are properly aligned.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ content: response.text().trim() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate rubric' });
  }
});

// 3. POST generate student report comment
router.post('/comment', async (req: Request, res: Response) => {
  const { studentName, subject, strengths, improvements, tone } = req.body;
  if (!studentName || !subject) {
    return res.status(400).json({ error: 'Student Name and Subject are required' });
  }

  const apiKey = getApiKey();
  if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY') {
    return res.status(200).json({
      content: `${studentName} has demonstrated a positive attitude in ${subject} this term. They show strong skills in ${strengths || 'grasping concepts quickly and class participation'}. To continue developing, ${studentName} would benefit from focusing more on ${improvements || 'consistent homework submission and detail validation'}. It has been a pleasure teaching them.`
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `You are a school teacher writing report card comments. Write a professional, encouraging report comment for a student.
    Student Name: ${studentName}
    Subject: ${subject}
    Key Strengths: ${strengths || 'Good participation'}
    Areas for Growth: ${improvements || 'Reviewing work before submission'}
    Tone requested: ${tone || 'constructive and supportive'}
    
    Keep the comment between 3 and 5 sentences. Make it professional, grammatically correct, and constructive.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return res.status(200).json({ content: response.text().trim() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to generate comment' });
  }
});

export default router;
