import Record from '../models/Record.js';
import { broadcastUpdate } from '../socket/socketHandler.js';

export const handleSyncAction = async (req, res) => {
  try {
    const { action, recordId, version, payload, clientSocketId } = req.body;

    if (!recordId) {
      return res.status(400).json({ error: 'recordId is required' });
    }

    let savedRecord = null;

    if (action === 'create') {
      const existing = await Record.findOne({ id: recordId });
      if (existing) {   
        if (existing.version > version) {
          return res.status(409).json({ error: 'Conflict detected', serverVersion: existing.version });
        }
        savedRecord = existing; // Assume retry
      } else {
        const newRecord = new Record({ ...payload, version: 1 });
        await newRecord.save();
        savedRecord = newRecord;
      }
    } else if (action === 'update') {
      const existing = await Record.findOne({ id: recordId });
      if (!existing) {
        return res.status(404).json({ error: 'Record not found' });
      }
      
      // Part A: Conflict detection check
      if (existing.version !== version) {
        // Idempotency check: if the server record already matches the incoming payload,
        // it's a retry of a successful update that the client dropped the connection on.
        if (existing.title === payload.title && existing.content === payload.content) {
          return res.status(200).json({ success: true, record: existing, message: `Retry synced ${action} for record ${recordId}` });
        }
        return res.status(409).json({ error: 'Conflict detected: version mismatch', serverVersion: existing.version });
      }
      
      const nextVersion = existing.version + 1;
      savedRecord = await Record.findOneAndUpdate(
        { id: recordId }, 
        { ...payload, version: nextVersion },
        { new: true }
      );
    } else if (action === 'delete') {
      const existing = await Record.findOne({ id: recordId });
      if (existing && existing.version !== version) {
        return res.status(409).json({ error: 'Conflict detected: version mismatch' });
      }
      await Record.findOneAndDelete({ id: recordId });
      savedRecord = { id: recordId }; // Minimal payload for deletion broadcast
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    // Part B: Real-time broadcast
    if (savedRecord) {
      broadcastUpdate(action, savedRecord, clientSocketId);
    }

    res.status(200).json({ success: true, record: savedRecord, message: `Synced ${action} for record ${recordId}` });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({ error: 'Server error during sync' });
  }
};
