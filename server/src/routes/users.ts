// routes/users.ts
import express from 'express';
import User from '../models/User';
import { authenticateUser } from './auth';

const router = express.Router();

// Check if user exists
router.get('/check-email', authenticateUser, async (req: express.Request, res: express.Response) => {
  const { email } = req.query;
  if (!email) {
    res.status(400).json({ error: 'Email required' });
    return;
  }
  
  try {
    const user = await User.findOne({ email: email as string });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Invite user
router.put('/invite', authenticateUser, async (req: express.Request, res: express.Response) => {
  if ((req as any).user?.role !== 'admin') {
    res.status(403).json({ error: 'Unauthorized' });
    return;
  }
  
  const { email, role } = req.body;
  if (!email || !role) {
    res.status(400).json({ error: 'Email and role required' });
    return;
  }

  try {
    const user = await User.findOneAndUpdate(
      { email },
      { $set: { isInvited: true, role } },
      { new: true }
    );
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;