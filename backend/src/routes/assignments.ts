import { Router, Request, Response } from 'express';
import { AssignmentDB } from '../models/Assignment';
import { JobQueueManager } from '../queue/worker';

const router = Router();

// 1. GET all assignments
router.get('/', async (req: Request, res: Response) => {
  try {
    const assignments = await AssignmentDB.getAll();
    return res.status(200).json(assignments);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch assignments' });
  }
});

// 2. GET single assignment
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await AssignmentDB.getById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    return res.status(200).json(assignment);
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch assignment' });
  }
});

// 3. POST create assignment
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      dueDate,
      questionTypes,
      numQuestions,
      totalMarks,
      instructions,
      fileAttached, // optional file name
      fileContent   // optional parsed text file content
    } = req.body;

    // Validation
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Assignment title is required' });
    }
    if (!dueDate) {
      return res.status(400).json({ error: 'Due date is required' });
    }
    if (!questionTypes || !Array.isArray(questionTypes) || questionTypes.length === 0) {
      return res.status(400).json({ error: 'At least one question type is required' });
    }
    if (!numQuestions || typeof numQuestions !== 'number' || numQuestions <= 0) {
      return res.status(400).json({ error: 'Number of questions must be a positive integer' });
    }
    if (!totalMarks || typeof totalMarks !== 'number' || totalMarks <= 0) {
      return res.status(400).json({ error: 'Total marks must be a positive integer' });
    }

    // Parse PDF/Text fileContent if available
    let finalFileContent: string | undefined = undefined;
    if (fileContent && typeof fileContent === 'string') {
      if (fileAttached && fileAttached.toLowerCase().endsWith('.pdf')) {
        try {
          const pdfParser = require('pdf-parse');
          const buffer = Buffer.from(fileContent, 'base64');
          const pdfData = await pdfParser(buffer);
          finalFileContent = pdfData.text;
          console.log(`[Backend] Parsed PDF successfully. Extracted ${finalFileContent?.length || 0} characters.`);
        } catch (err: any) {
          console.error('[Backend] Failed to parse uploaded PDF file:', err);
        }
      } else {
        finalFileContent = fileContent;
      }
    }

    // Create the assignment entry in database
    const assignment = await AssignmentDB.create({
      title: title.trim(),
      dueDate,
      questionTypes,
      numQuestions,
      totalMarks,
      instructions: instructions || '',
      fileAttached: fileAttached || undefined,
      fileContent: finalFileContent
    });

    await JobQueueManager.addJob(assignment.id);

    return res.status(201).json(assignment);
  } catch (err: any) {
    console.error('Error creating assignment API:', err);
    return res.status(500).json({ error: err.message || 'Failed to create assignment' });
  }
});

// 4. DELETE assignment
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await AssignmentDB.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    return res.status(200).json({ success: true, message: 'Assignment deleted successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to delete assignment' });
  }
});

// 5. POST regenerate questions for single assignment
router.post('/:id/regenerate', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const assignment = await AssignmentDB.getById(id);
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    // Reset status to 'processing' and clear sections
    await AssignmentDB.update(id, {
      status: 'processing',
      sections: undefined,
      error: undefined
    });

    // Trigger queue job again
    await JobQueueManager.addJob(id);

    return res.status(200).json({ success: true, message: 'Regeneration started successfully' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to trigger regeneration' });
  }
});

export default router;
