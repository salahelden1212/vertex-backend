import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
import errorHandler from './middleware/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(mongoSanitize());

// CORS Middleware (MUST be before routes)
app.use(cors({
  origin: [
    'https://vertex-frontend-psi.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (uploaded images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
import authRoutes from './routes/authRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import clientRoutes from './routes/clientRoutes.js';
import propertyRoutes from './routes/propertyRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import userRoutes from './routes/userRoutes.js';
import reportsRoutes from './routes/reportsRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import milestoneRoutes from './routes/milestoneRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/milestones', milestoneRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Vertex Finish API is running' });
});

// Error Handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
