const { ObjectId } = require('mongodb');  // Import ObjectId from mongodb

// Create a new meeting
exports.createMeeting = async (req, res) => {
    const { title, date, time, duration, participants, description } = req.body;
    if (!title || !date || !time || !duration || !participants) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const db = req.db;  // Get the database instance from the request object
        const result = await db.collection('meetings').insertOne({
            title,
            date,
            time,
            duration,
            participants,
            description
        });
        console.log(`Notification: Meeting ${result.insertedId} created`);
        res.status(201).json({ success: true, meetingId: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all meetings
exports.getAllMeetings = async (req, res) => {
    try {
        const db = req.db;  // Get the database instance from the request object
        const meetings = await db.collection('meetings').find().toArray();
        res.status(200).json(meetings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single meeting by ID
exports.getMeetingById = async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid meeting ID' });
    }
    try {
        const db = req.db;  // Get the database instance from the request object
        const meeting = await db.collection('meetings').findOne({ _id: new ObjectId(id) });
        if (!meeting) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        res.status(200).json(meeting);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a meeting by ID
exports.updateMeeting = async (req, res) => {
    const { id } = req.params;
    const { title, date, time, duration, participants, description } = req.body;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid meeting ID' });
    }
    if (!title || !date || !time || !duration || !participants) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    try {
        const db = req.db;  // Get the database instance from the request object
        const result = await db.collection('meetings').updateOne(
            { _id: new ObjectId(id) },
            { $set: { title, date, time, duration, participants, description } }
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a meeting by ID
exports.deleteMeeting = async (req, res) => {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid meeting ID' });
    }
    try {
        const db = req.db;  // Get the database instance from the request object
        const result = await db.collection('meetings').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Meeting not found' });
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};