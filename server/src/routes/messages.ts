import { Router, Request, Response } from 'express';
import { authenticateUser } from './auth';
import Message from '../models/Message';
import { Server } from 'socket.io';
import mongoose from 'mongoose';

const router = Router();

export default (io: Server) => {
  router.post("/", authenticateUser, async (req: Request, res: Response) => {
    console.log('Received message send request:', {
      body: req.body,
      user: req.user
    });

    try {
      const { content, receiver } = req.body;
      const sender = req.user?.userId;

      if (!sender) {
        console.error('Missing sender in authenticated user');
        res.status(401).json({ error: 'Unauthorized - missing sender ID' });
        return;
      }

      if (!content || !receiver) {
        console.error('Missing required fields:', { content, receiver });
        res.status(400).json({ 
          error: 'Missing required fields',
          details: !content ? 'Message content is required' : 'Receiver ID is required'
        });
        return;
      }

      if (receiver.startsWith('temp-id-') || !mongoose.Types.ObjectId.isValid(receiver)) {
        console.error('Invalid receiver ID format:', receiver);
        res.status(400).json({ 
          error: 'Invalid receiver ID',
          details: 'Cannot send to temporary or invalid user ID'
        });
        return;
      }

      
      const message = new Message({
        sender,
        receiver,
        content,
      });

      const savedMessage = await message.save();
      console.log('Message saved successfully:', savedMessage._id);
      
      const populatedMessage = await Message.populate(savedMessage, {
        path: 'sender',
        select: 'name avatar'
      });

      io.to(sender).to(receiver).emit('newMessage', populatedMessage);
      res.status(201).json(populatedMessage);
      
    } catch (error) {
      console.error('Error saving message:', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      res.status(500).json({ 
        error: 'Failed to save message',
        details: 'Internal server error'
      });
    }
  });

  // Add a new route to get conversation messages
  router.get("/conversation/:userId", authenticateUser, async (req: Request, res: Response) => {
    console.log('Fetching conversation for user:', req.params.userId);
    console.log('Authenticated user:', req.user?.userId);
    
    try {
      const currentUserId = req.user?.userId;
      const otherUserId = req.params.userId;
      
      if (!currentUserId) {
        console.log('Unauthorized - missing currentUserId');
        res.status(401).json({ 
          error: 'Unauthorized',
          details: 'Missing authenticated user ID'
        });
        return;
      }

      if (!otherUserId || otherUserId.startsWith('temp-id-')) {
        console.log('Invalid user ID:', otherUserId);
        res.status(400).json({ 
          error: 'Invalid user ID',
          details: 'Temporary or invalid user ID provided'
        });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
        console.log('Invalid ObjectId format:', otherUserId);
        res.status(400).json({ 
          error: 'Invalid user ID format',
          details: 'User ID must be a valid MongoDB ObjectId'
        });
        return;
      }

      console.log('Querying messages between:', currentUserId, 'and', otherUserId);
      const messages = await Message.find({
        $or: [
          { sender: currentUserId, receiver: otherUserId },
          { sender: otherUserId, receiver: currentUserId }
        ]
      })
      .sort({ createdAt: 1 })
      .populate('sender', 'name avatar');
      
      console.log('Found', messages.length, 'messages');
      res.json(messages);
      
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ 
        error: 'Failed to fetch conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return router;
};